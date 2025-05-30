import Foundation
import Capacitor
import TalsecRuntime

@objc(FreeraspPlugin)
public class FreeraspPlugin: CAPPlugin {

    public static var shared: FreeraspPlugin?
    
    let threatChannelKey = String(Int.random(in: 100_000..<999_999_999)) // key of the argument map under which threats are expected
    let threatChannelName = String(Int.random(in: 100_000..<999_999_999)) // name of the channel over which threat callbacks are sent
    
    override public func load() {
        FreeraspPlugin.shared = self
    }
    
    /// Runs Talsec with given configuration
    @objc func talsecStart(_ call: CAPPluginCall) {
        guard let config = call.getObject("config") else {
            call.reject("Missing config parameter in freeRASP Native Plugin")
            return
        }
        
        do {
            try initializeTalsec(talsecConfig: config)
        } catch let error as NSError {
            call.reject("Could not initialize freeRASP: \(error.domain)", "TalsecInitializationError", error)
            return
        }
        call.resolve([
            "started": true
        ])
    }

    @objc func storeExternalId(_ call: CAPPluginCall) -> Void {
        guard let externalId = call.getString("data") else {
            call.reject("Missing external ID data parameter in freeRASP Native Plugin", "MissingArgumentError")
            return
        }
        UserDefaults.standard.set(externalId, forKey: "app.talsec.externalid")
        call.resolve(["result": true])
    }

    @objc func blockScreenCapture(_ call: CAPPluginCall) -> Void {
        guard let enable = call.getBool("enable") else {
            call.reject("Enable argument is missing or empty in the call", "MissingArgumentError")
            return
        }
        
        getProtectedWindow { window in
            if let window = window {
                Talsec.blockScreenCapture(enable: enable, window: window)
                call.resolve(["result": true])
            } else {
                call.reject("No windows found to block screen capture", "BlockScreenCaptureError")
            }
        }
    }
    
    @objc func isScreenCaptureBlocked(_ call: CAPPluginCall) -> Void {
        getProtectedWindow { window in
            if let window = window {
                let isBlocked = Talsec.isScreenCaptureBlocked(in: window)
                call.resolve(["result": isBlocked])
            } else {
                call.reject("Error while checking if screen capture is blocked", "IsScreenCaptureBlockedError")
            }
        }
    }
    
    private func getProtectedWindow(completion: @escaping (UIWindow?) -> Void) {
        DispatchQueue.main.async {
            if #available(iOS 13.0, *) {
                if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene {
                    if let window = windowScene.windows.first {
                        completion(window)
                    } else {
                        completion(nil)
                    }
                } else {
                    completion(nil)
                }
            }
        }
    }
    
    /**
     * Method to setup the message passing between native and React Native
     */
    @objc func getThreatChannelData(_ call: CAPPluginCall) -> Void {
        call.resolve([
                    "ids": [threatChannelName, threatChannelKey]
                ])
    }
    
    /**
     * Method to get the random identifiers of callbacks
     */
    @objc func getThreatIdentifiers(_ call: CAPPluginCall) -> Void {
        call.resolve([
                    "ids": getThreatIdentifiers()
                ])
    }
    
    /**
     * We never send an invalid callback over our channel.
     * Therefore, if this happens, we want to kill the app.
     */
    @objc func onInvalidCallback() -> Void {
        abort()
    }
    
    private func getThreatIdentifiers() -> [Int] {
        return SecurityThreat.allCases
            .filter {
                threat in threat.rawValue != "passcodeChange"
            }
            .map {
                threat in threat.callbackIdentifier
            }
    }
    
    private func initializeTalsec(talsecConfig: JSObject) throws {
        guard let iosConfig = talsecConfig["iosConfig"] as? JSObject else {
            throw NSError(domain: "Missing iosConfig parameter in Talsec Native Plugin", code: 1)
        }
        guard let appBundleIds = iosConfig["appBundleId"] as? String else {
            throw NSError(domain: "Missing appBundleId parameter in Talsec Native Plugin", code: 2)
        }
        guard let appTeamId = iosConfig["appTeamId"] as? String else {
            throw NSError(domain: "Missing appTeamId parameter in Talsec Native Plugin", code: 3)
        }
        guard let watcherMailAddress = talsecConfig["watcherMail"] as? String else {
            throw NSError(domain: "Missing watcherMail parameter in Talsec Native Plugin", code: 4)
        }
        let isProd = talsecConfig["isProd"] as? Bool ?? true
        
        let config = TalsecConfig(appBundleIds: [appBundleIds], appTeamId: appTeamId, watcherMailAddress: watcherMailAddress, isProd: isProd)
        Talsec.start(config: config)
    }
}

extension SecurityThreatCenter: SecurityThreatHandler {
    
    public func threatDetected(_ securityThreat: TalsecRuntime.SecurityThreat) {
        if (securityThreat.rawValue == "passcodeChange") {
            return
        }

        FreeraspPlugin.shared!.notifyListeners(FreeraspPlugin.shared!.threatChannelName, data: [FreeraspPlugin.shared!.threatChannelKey: securityThreat.callbackIdentifier], retainUntilConsumed: true)
    }
}

struct ThreatIdentifiers {
    static let threatIdentifierList: [Int] = (1...14).map { _ in Int.random(in: 100_000..<999_999_999) }
}

/// An extension to unify callback names with Capacitor ones.
extension SecurityThreat {

    var callbackIdentifier: Int {
        switch self {
            case .signature:
                return ThreatIdentifiers.threatIdentifierList[0]
            case .jailbreak:
                return ThreatIdentifiers.threatIdentifierList[1]
            case .debugger:
                return ThreatIdentifiers.threatIdentifierList[2]
            case .runtimeManipulation:
                return ThreatIdentifiers.threatIdentifierList[3]
            case .passcode:
                return ThreatIdentifiers.threatIdentifierList[4]
            case .passcodeChange:
                return ThreatIdentifiers.threatIdentifierList[5]
            case .simulator:
                return ThreatIdentifiers.threatIdentifierList[6]
            case .missingSecureEnclave:
                return ThreatIdentifiers.threatIdentifierList[7]
            case .systemVPN:
                return ThreatIdentifiers.threatIdentifierList[8]
            case .deviceChange:
                return ThreatIdentifiers.threatIdentifierList[9]
            case .deviceID:
                return ThreatIdentifiers.threatIdentifierList[10]
            case .unofficialStore:
                return ThreatIdentifiers.threatIdentifierList[11]
            case .screenshot:
                return ThreatIdentifiers.threatIdentifierList[12]
            case .screenRecording:
                return ThreatIdentifiers.threatIdentifierList[13]
            @unknown default:
                abort()
        }
    }
}
