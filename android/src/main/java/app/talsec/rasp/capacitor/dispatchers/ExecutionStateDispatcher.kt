package com.aheaditec.freerasp.dispatchers

import com.aheaditec.freerasp.events.RaspExecutionStateEvent
import com.aheaditec.freerasp.interfaces.PluginExecutionStateListener

internal object ExecutionStateDispatcher {
    private lateinit var listener: PluginExecutionStateListener
    private val cache = mutableSetOf<RaspExecutionStateEvent>()

    private var isAppInForeground = false
    private var isListenerRegistered = false

    fun registerListener(newListener: PluginExecutionStateListener) {
        listener = newListener
        isListenerRegistered = true
        isAppInForeground = true
        flushCache()
    }

    fun unregisterListener() {
        isListenerRegistered = false
        isAppInForeground = false
    }

    fun onResume() {
        isAppInForeground = true
        if (isListenerRegistered) {
            flushCache()
        }
    }

    fun onPause() {
        isAppInForeground = false
    }

    fun dispatch(event: RaspExecutionStateEvent) {
        if (isAppInForeground && isListenerRegistered) {
            listener.raspExecutionStateChanged(event)
        } else {
            synchronized(cache) {
                cache.add(event)
            }
        }
    }

    private fun flushCache() {
        if (!isListenerRegistered || !isAppInForeground) {
            return
        }
        val events = synchronized(cache) {
            val snapshot = cache.toSet()
            cache.clear()
            snapshot
        }
        events.forEach { listener.raspExecutionStateChanged(it) }
    }
}
