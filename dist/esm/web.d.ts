import { WebPlugin } from '@capacitor/core';
import type { FreeraspPlugin, FreeraspConfig } from './definitions';
export declare class FreeraspWeb extends WebPlugin implements FreeraspPlugin {
    talsecStart(_options: {
        config: FreeraspConfig;
    }): Promise<{
        started: boolean;
    }>;
}
