export const commonChecks = [
  { name: 'Privileged Access', isSecure: true },
  { name: 'Debug', isSecure: true },
  { name: 'Simulator', isSecure: true },
  { name: 'App Integrity', isSecure: true },
  { name: 'Unofficial Store', isSecure: true },
  { name: 'Hooks', isSecure: true },
  { name: 'Device Binding', isSecure: true },
  { name: 'Secure Hardware Not Available', isSecure: true },
  { name: 'Passcode', isSecure: true },
];

export const iosChecks = [{ name: 'Device ID', isSecure: true }];

export const androidChecks = [{ name: 'Obfuscation Issues', isSecure: true }];
