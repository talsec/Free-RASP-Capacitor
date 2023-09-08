import { WebPlugin } from '@capacitor/core';

import type { FreeraspPlugin, FreeraspConfig } from './definitions';

export class FreeraspWeb extends WebPlugin implements FreeraspPlugin {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async talsecStart(_options: { config: FreeraspConfig }): Promise<{ started: boolean }> {
    throw new Error('Method not implemented.');
  }
}
