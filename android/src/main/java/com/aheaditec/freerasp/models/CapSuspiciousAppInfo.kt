package com.aheaditec.freerasp.models

import kotlinx.serialization.Serializable


/**
 * Simplified, serializable wrapper for Talsec's SuspiciousAppInfo
 */
@Serializable
data class CapSuspiciousAppInfo(
    val packageInfo: CapPackageInfo,
    val reason: String,
)

/**
 * Simplified, serializable wrapper for Android's PackageInfo
 */
@Serializable
data class CapPackageInfo(
    val packageName: String,
    val appName: String?,
    val version: String?,
    val appIcon: String?,
    val installerStore: String?
)
