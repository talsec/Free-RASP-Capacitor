package app.talsec.rasp.capacitor.interfaces

import app.talsec.rasp.capacitor.events.RaspExecutionStateEvent

internal interface PluginExecutionStateListener {
    fun raspExecutionStateChanged(event: RaspExecutionStateEvent)
}
