import { WebPlugin } from '@capacitor/core';
export class FreeraspWeb extends WebPlugin {
    onInvalidCallback() {
        throw new Error('Method not implemented.');
    }
    getThreatIdentifiers() {
        throw new Error('Method not implemented.');
    }
    getThreatChannelData() {
        throw new Error('Method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async talsecStart(_options) {
        throw new Error('Method not implemented.');
    }
}
//# sourceMappingURL=web.js.map