import { registerPlugin } from '@capacitor/core';

import type { TalsecPlugin } from '../types/types';

export const Talsec = registerPlugin<TalsecPlugin>('Freerasp', {});
