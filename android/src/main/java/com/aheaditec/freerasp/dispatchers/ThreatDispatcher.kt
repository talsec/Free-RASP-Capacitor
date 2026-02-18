package com.aheaditec.freerasp.dispatchers

import com.aheaditec.talsec_security.security.api.SuspiciousAppInfo
import com.aheaditec.freerasp.events.ThreatEvent
import com.aheaditec.freerasp.interfaces.PluginThreatListener

internal class ThreatDispatcher {
    private val threatCache = mutableSetOf<ThreatEvent>()
    private val malwareCache = mutableSetOf<SuspiciousAppInfo>()

    var listener: PluginThreatListener? = null
        set(value) {
            field = value
            if (value != null) {
                flushCache(value)
            }
        }

    fun dispatchThreat(event: ThreatEvent) {
        val checkedListener = synchronized(threatCache) {
            val currentListener = listener
            if (currentListener != null) {
                currentListener
            } else {
                threatCache.add(event)
                null
            }
        }
        checkedListener?.threatDetected(event)
    }

    fun dispatchMalware(apps: MutableList<SuspiciousAppInfo>) {
        val checkedListener = synchronized(malwareCache) {
            val currentListener = listener
            if (currentListener != null) {
                currentListener
            } else {
                malwareCache.addAll(apps)
                null
            }
        }
        checkedListener?.malwareDetected(apps)
    }

    private fun flushCache(registeredListener: PluginThreatListener) {
        val threats = synchronized(threatCache) {
            val snapshot = threatCache.toSet()
            threatCache.clear()
            snapshot
        }
        threats.forEach { registeredListener.threatDetected(it) }

        val malware = synchronized(malwareCache) {
            val snapshot = malwareCache.toMutableList()
            malwareCache.clear()
            snapshot
        }
        if (malware.isNotEmpty()) {
            registeredListener.malwareDetected(malware)
        }
    }
}
