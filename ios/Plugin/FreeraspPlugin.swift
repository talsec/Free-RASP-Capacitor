import Foundation
import Capacitor
import TalsecRuntime

@objc(FreeraspPlugin)
public class FreeraspPlugin: CAPPlugin {

    public static var shared:FreeraspPlugin?
    
    let threatChannelKey = String(Int.random(in: 100_000..<999_999_999)) // key of the argument map under which threats are expected
    let threatChannelName = String(Int.random(in: 100_000..<999_999_999)) // name of the channel over which threat callbacks are sent
    let threatIdentifierList = (1...12).map { _ in Int.random(in: 100_000..<999_999_999) }
    
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
            call.reject(error.localizedDescription)
            return
        }
        call.resolve([
            "started": true
        ])
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

/// An extension to unify callback names with RN ones.
extension SecurityThreat {

    var callbackIdentifier: Int {
        switch self {
            case .signature:
            return FreeraspPlugin.shared!.threatIdentifierList[0]
            case .jailbreak:
                return FreeraspPlugin.shared!.threatIdentifierList[1]
            case .debugger:
                return FreeraspPlugin.shared!.threatIdentifierList[2]
            case .runtimeManipulation:
                return FreeraspPlugin.shared!.threatIdentifierList[3]
            case .passcode:
                return FreeraspPlugin.shared!.threatIdentifierList[4]
            case .passcodeChange:
                return FreeraspPlugin.shared!.threatIdentifierList[5]
            case .simulator:
                return FreeraspPlugin.shared!.threatIdentifierList[6]
            case .missingSecureEnclave:
                return FreeraspPlugin.shared!.threatIdentifierList[7]
            case .deviceChange:
                return FreeraspPlugin.shared!.threatIdentifierList[8]
            case .deviceID:
                return FreeraspPlugin.shared!.threatIdentifierList[9]
            case .unofficialStore:
            return FreeraspPlugin.shared!.threatIdentifierList[10]
            @unknown default:
                abort()
        }
    }
}
