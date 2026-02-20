package com.aheaditec.freerasp.interfaces

import com.aheaditec.talsec_security.security.api.SuspiciousAppInfo
import com.aheaditec.freerasp.events.ThreatEvent

internal interface PluginThreatListener {
    fun threatDetected(threatEventType: ThreatEvent)
    fun malwareDetected(suspiciousApps: MutableList<SuspiciousAppInfo>)
}
