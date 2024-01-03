import { WebPlugin } from '@capacitor/core';

import type { FreeraspPlugin, FreeraspConfig } from './definitions';

export class FreeraspWeb extends WebPlugin implements FreeraspPlugin {
  onInvalidCallback(): void {
    throw new Error('Method not implemented.');
  }
  getThreatIdentifiers(): Promise<{ ids: number[]; }> {
    throw new Error('Method not implemented.');
  }
  getThreatChannelData(): Promise<{ ids: [string, string]; }> {
    throw new Error('Method not implemented.');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async talsecStart(_options: { config: FreeraspConfig }): Promise<{ started: boolean }> {
    throw new Error('Method not implemented.');
  }
}
