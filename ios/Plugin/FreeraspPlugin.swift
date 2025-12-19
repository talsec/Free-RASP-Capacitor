import Foundation
import Capacitor
import TalsecRuntime

@objc(FreeraspPlugin)
public class FreeraspPlugin: CAPPlugin {

    public static var shared: FreeraspPlugin?

    static var threatCache = Set<SecurityThreat>()
    static var executionStateCache = Set<RaspExecutionStates>()
    
    override public func load() {
        FreeraspPlugin.shared = self
        FreeraspPlugin.flushCache()
    }

    private static func flushCache() {
        FreeraspPlugin.threatCache.forEach(FreeraspPlugin.dispatchEvent)
        FreeraspPlugin.threatCache.removeAll()

        FreeraspPlugin.executionStateCache.forEach(FreeraspPlugin.dispatchRaspExecutionStateEvent)
        FreeraspPlugin.executionStateCache.removeAll()
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

    static func dispatchEvent(securityThreat: SecurityThreat) {
        if let instance = FreeraspPlugin.shared {
            instance.notifyListeners(EventIdentifiers.threatChannelName, data: [EventIdentifiers.threatChannelKey: securityThreat.callbackIdentifier], retainUntilConsumed: true)
        } else {
            FreeraspPlugin.threatCache.insert(securityThreat)
        }
    }

    static func dispatchRaspExecutionStateEvent(event: RaspExecutionStates) -> Void {
        if let instance = FreeraspPlugin.shared {
            instance.notifyListeners(EventIdentifiers.raspExecutionStateChannelName, data: [EventIdentifiers.raspExecutionStateChannelKey: event.callbackIdentifier], retainUntilConsumed: true)
        } else {
            FreeraspPlugin.executionStateCache.insert(event)
        }
    }
    
    /**
     * Method to setup the message passing between native and Capacitor
     */
    @objc func getThreatChannelData(_ call: CAPPluginCall) -> Void {
        call.resolve([
                    "ids": [EventIdentifiers.threatChannelName, EventIdentifiers.threatChannelKey]
                ])
    }

    /**
     * Method to setup the message passing between native and Capacitor
     */
    @objc func getRaspExecutionStateChannelData(_ call: CAPPluginCall) -> Void {
        call.resolve([
                    "ids": [EventIdentifiers.raspExecutionStateChannelName, EventIdentifiers.raspExecutionStateChannelKey]
                ])
    }
    
    /**
     * Method to get the random identifiers of callbacks
     */
    @objc func getThreatIdentifiers(_ call: CAPPluginCall) -> Void {
        call.resolve([
                    "ids": getThreatIdentifiersList()
                ])
    }

    @objc func getRaspExecutionStateIdentifiers(_ call: CAPPluginCall) -> Void {
        call.resolve([
            "ids": getRaspExecutionStateIdentifiersList()
        ])
    }
    
    /**
     * We never send an invalid callback over our channel.
     * Therefore, if this happens, we want to kill the app.
     */
    @objc func onInvalidCallback() -> Void {
        abort()
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

extension SecurityThreatCenter:  @retroactive SecurityThreatHandler, @retroactive RaspExecutionState {
    
    public func threatDetected(_ securityThreat: TalsecRuntime.SecurityThreat) {
        if (securityThreat.rawValue == "passcodeChange") {
            return
        }

        FreeraspPlugin.dispatchEvent(securityThreat: securityThreat)
    }
    
    public func onAllChecksFinished() {
        FreeraspPlugin.dispatchRaspExecutionStateEvent(event: RaspExecutionStates.allChecksFinished)
    }
}