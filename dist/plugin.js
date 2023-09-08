var capacitorFreerasp = (function (exports, core) {
    'use strict';

    const activeListeners = [];
    const Freerasp = core.registerPlugin('Freerasp', {
        web: () => Promise.resolve().then(function () { return web; }).then(m => new m.FreeraspWeb()),
    });
    const setThreatListeners = async (callbacks) => {
        for (const [threat, action] of Object.entries(callbacks)) {
            if ((threat === 'obfuscationIssues' && core.Capacitor.getPlatform() === 'ios') || (action === undefined)) {
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

    class FreeraspWeb extends core.WebPlugin {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async talsecStart(_options) {
            throw new Error('Method not implemented.');
        }
    }

    var web = /*#__PURE__*/Object.freeze({
        __proto__: null,
        FreeraspWeb: FreeraspWeb
    });

    exports.Freerasp = Freerasp;
    exports.removeThreatListeners = removeThreatListeners;
    exports.setThreatListeners = setThreatListeners;
    exports.startFreeRASP = startFreeRASP;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({}, capacitorExports);
//# sourceMappingURL=plugin.js.map
