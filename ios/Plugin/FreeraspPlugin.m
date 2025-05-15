#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// Define the plugin using the CAP_PLUGIN Macro, and
// each method the plugin supports using the CAP_PLUGIN_METHOD macro.
CAP_PLUGIN(FreeraspPlugin, "Freerasp",
           CAP_PLUGIN_METHOD(getThreatChannelData, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getThreatIdentifiers, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(onInvalidCallback, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(talsecStart, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(storeExternalId, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(blockScreenCapture, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(isScreenCaptureBlocked, CAPPluginReturnPromise);
)
