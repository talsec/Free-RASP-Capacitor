import Foundation
import Capacitor
import TalsecRuntime

@objc(FreeraspPlugin)
public class FreeraspPlugin: CAPPlugin {

    public static var shared:FreeraspPlugin?
    
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
    
    static let threatEventMap: [String: String] = [
        "missingSecureEnclave": "secureHardwareNotAvailable",
        "device binding": "deviceBinding",
    ]
    
    public func threatDetected(_ securityThreat: TalsecRuntime.SecurityThreat) {
        let threatName = SecurityThreatCenter.threatEventMap[securityThreat.rawValue] ?? securityThreat.rawValue
        if (threatName == "passcodeChange") {
            return
        }
        FreeraspPlugin.shared!.notifyListeners(threatName, data: [:])
    }
}
