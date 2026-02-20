package com.aheaditec.freerasp.dispatchers

import com.aheaditec.freerasp.events.RaspExecutionStateEvent
import com.aheaditec.freerasp.interfaces.PluginExecutionStateListener

internal class ExecutionStateDispatcher {
    private val cache = mutableSetOf<RaspExecutionStateEvent>()

    var listener: PluginExecutionStateListener? = null
        set(value) {
            field = value
            if (value != null) {
                flushCache(value)
            }
        }

    fun dispatch(event: RaspExecutionStateEvent) {
        val checkedListener = synchronized(cache) {
            val currentListener = listener
            if (currentListener != null) {
                currentListener
            } else {
                cache.add(event)
                null
            }
        }
        checkedListener?.raspExecutionStateChanged(event)
    }

    private fun flushCache(registeredListener: PluginExecutionStateListener) {
        val events = synchronized(cache) {
            val snapshot = cache.toSet()
            cache.clear()
            snapshot
        }
        events.forEach { registeredListener.raspExecutionStateChanged(it) }
    }
}
