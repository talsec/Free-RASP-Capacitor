import { Capacitor } from '@capacitor/core';
export class Threat {
    constructor(value) {
        this.value = value;
    }
    static getValues() {
        return Capacitor.getPlatform() === 'android'
            ? [
                this.AppIntegrity,
                this.PrivilegedAccess,
                this.Debug,
                this.Hooks,
                this.Passcode,
                this.Simulator,
                this.SecureHardwareNotAvailable,
                this.SystemVPN,
                this.DeviceBinding,
                this.UnofficialStore,
                this.Overlay,
                this.ObfuscationIssues,
                this.DevMode,
                this.Malware,
            ]
            : [
                this.AppIntegrity,
                this.PrivilegedAccess,
                this.Debug,
                this.Hooks,
                this.Passcode,
                this.Simulator,
                this.SecureHardwareNotAvailable,
                this.SystemVPN,
                this.DeviceBinding,
                this.DeviceID,
                this.UnofficialStore,
            ];
    }
}
Threat.AppIntegrity = new Threat(0);
Threat.PrivilegedAccess = new Threat(0);
Threat.Debug = new Threat(0);
Threat.Hooks = new Threat(0);
Threat.Passcode = new Threat(0);
Threat.Simulator = new Threat(0);
Threat.SecureHardwareNotAvailable = new Threat(0);
Threat.SystemVPN = new Threat(0);
Threat.DeviceBinding = new Threat(0);
Threat.DeviceID = new Threat(0);
Threat.UnofficialStore = new Threat(0);
Threat.Overlay = new Threat(0);
Threat.ObfuscationIssues = new Threat(0);
Threat.DevMode = new Threat(0);
Threat.Malware = new Threat(0);
//# sourceMappingURL=definitions.js.map