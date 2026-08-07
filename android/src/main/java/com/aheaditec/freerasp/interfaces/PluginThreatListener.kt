package com.aheaditec.freerasp.interfaces

import app.talsec.rasp.security.api.SuspiciousAppInfo
import com.aheaditec.freerasp.events.ThreatEvent

internal interface PluginThreatListener {
    fun threatDetected(threatEventType: ThreatEvent)
    fun malwareDetected(suspiciousApps: MutableList<SuspiciousAppInfo>)
}
