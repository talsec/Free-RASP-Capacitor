import { Capacitor, registerPlugin } from '@capacitor/core';
const activeListeners = [];
const Freerasp = registerPlugin('Freerasp', {
    web: () => import('./web').then(m => new m.FreeraspWeb()),
});
const setThreatListeners = async (callbacks) => {
    for (const [threat, action] of Object.entries(callbacks)) {
        if ((threat === 'obfuscationIssues' && Capacitor.getPlatform() === 'ios') || (action === undefined)) {
            continue;
        }
        const listener = await Freerasp.addListener(threat, action);
        activeListeners.push(listener);
    }
};
const removeThreatListeners = () => {
    activeListeners.forEach((listener) => listener.remove());
};
const startFreeRASP = async (config, reactions) => {
    await setThreatListeners(reactions);
    const { started } = await Freerasp.talsecStart({ config });
    return started;
};
export * from './definitions';
export { Freerasp, startFreeRASP, setThreatListeners, removeThreatListeners };
//# sourceMappingURL=index.js.map