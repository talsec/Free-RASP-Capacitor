package com.aheaditec.freerasp.interfaces

import com.aheaditec.freerasp.events.RaspExecutionStateEvent

internal interface PluginExecutionStateListener {
    fun raspExecutionStateChanged(event: RaspExecutionStateEvent)
}
