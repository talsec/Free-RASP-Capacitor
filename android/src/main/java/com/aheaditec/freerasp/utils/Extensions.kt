package com.aheaditec.freerasp.utils

import android.content.Context
import android.content.pm.PackageInfo
import android.util.Base64
import android.util.Log
import com.aheaditec.freerasp.models.CapPackageInfo
import com.aheaditec.freerasp.models.CapSuspiciousAppInfo
import com.aheaditec.talsec_security.security.api.SuspiciousAppInfo
import com.getcapacitor.JSArray
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject

private inline fun <reified T> JSONArray.toPrimitiveArray(): Array<T> {
    val output = mutableListOf<T>()

    for (i in 0 until this.length()) {
        val element: T = when (T::class) {
            String::class -> this.getString(i) as T
            Int::class -> this.getInt(i) as T
            Double::class -> this.getDouble(i) as T
            Long::class -> this.getLong(i) as T
            Boolean::class -> this.getBoolean(i) as T
            else -> throw JSONException("Cannot parse JSON array - unsupported type")
        }
        output.add(element)
    }
    return output.toTypedArray()
}

internal fun JSONObject.getArraySafe(key: String): Array<String> {
    if (this.has(key)) {
        val inputArray = this.getJSONArray(key)
        return inputArray.toPrimitiveArray()
    }
    return arrayOf()
}

internal fun JSONObject.getNestedArraySafe(key: String): Array<Array<String>> {
    val outArray = mutableListOf<Array<String>>()
    if (this.has(key)) {
        val inputArray = this.getJSONArray(key)
        for (i in 0 until inputArray.length()) {
            outArray.add(inputArray.getJSONArray(i).toPrimitiveArray())
        }
    }
    return outArray.toTypedArray()
}

/**
 * Converts the Talsec's SuspiciousAppInfo to Capacitor equivalent
 */
internal fun SuspiciousAppInfo.toCapSuspiciousAppInfo(context: Context): CapSuspiciousAppInfo {
    return CapSuspiciousAppInfo(
        packageInfo = this.packageInfo.toCapPackageInfo(context),
        reason = this.reason,
    )
}

/**
 * Converts the Android's PackageInfo to Capacitor equivalent
 */
internal fun PackageInfo.toCapPackageInfo(context: Context): CapPackageInfo {
    return CapPackageInfo(
        packageName = this.packageName,
        appName = Utils.getAppName(context, this.applicationInfo),
        version = this.versionName,
        appIcon = null, // this requires heavier computations, so appIcon has to be retrieved separately
        installerStore = Utils.getInstallationSource(context, this.packageName)
    )
}

/**
 * Convert the Talsec's SuspiciousAppInfo to base64-encoded JSArray,
 * which can be then sent to Capacitor
 */
internal fun MutableList<SuspiciousAppInfo>.toEncodedJSArray(context: Context): JSArray {
    val output = JSArray()
    this.forEach { suspiciousAppInfo ->
        val capSuspiciousAppInfo = suspiciousAppInfo.toCapSuspiciousAppInfo(context)
        try {
            val encodedAppInfo =
                Base64.encodeToString(
                    Json.encodeToString(capSuspiciousAppInfo).toByteArray(),
                    Base64.DEFAULT
                )
            output.put(encodedAppInfo)
        } catch (e: Exception) {
            Log.e("Talsec", "Could not serialize suspicious app data: ${e.message}")
        }
    }
    return output
}
