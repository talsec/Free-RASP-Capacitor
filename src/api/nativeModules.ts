import type { PluginListenerHandle } from '@capacitor/core';
import { registerPlugin } from '@capacitor/core';

import type { NativeEvent, TalsecConfig } from '../types/types';

/**
 * Native bridge of the plugin. Internal: apps use the exported functions instead.
 */
interface TalsecPlugin {
  talsecStart(options: { config: TalsecConfig }): Promise<{ started: boolean }>;
  addListener(eventName: string, callback: (event: NativeEvent) => void): Promise<PluginListenerHandle>;
  onInvalidCallback(): void;
  removeListenerForEvent(options: { eventName: string }): Promise<{ result: string }>;
  getThreatIdentifiers(): Promise<{ ids: number[] }>;
  getThreatChannelData(): Promise<{ ids: [string, string, string, string] }>;
  getRaspExecutionStateIdentifiers(): Promise<{ ids: number[] }>;
  getRaspExecutionStateChannelData(): Promise<{ ids: [string, string] }>;
  storeExternalId(options: { data: string }): Promise<{ result: boolean }>;
  removeExternalId(): Promise<{ result: boolean }>;
  addToWhitelist(options: { packageName: string }): Promise<{ result: boolean }>;
  blockScreenCapture(options: { enable: boolean }): Promise<{ result: boolean }>;
  isScreenCaptureBlocked(): Promise<{ result: boolean }>;
  blockScreenControl(options: { enable: boolean }): Promise<{ result: boolean }>;
  isScreenControlBlocked(): Promise<{ result: boolean }>;
  blockOverlayWindows(options: { enable: boolean }): Promise<{ result: boolean }>;
  isOverlayWindowsBlocked(): Promise<{ result: boolean }>;
  startOngoingCallDetection(): Promise<{ result: boolean }>;
  stopOngoingCallDetection(): Promise<{ result: boolean }>;
  getAppIcon(options: { packageName: string }): Promise<{ result: string }>;
}

export const Talsec = registerPlugin<TalsecPlugin>('Freerasp', {});
