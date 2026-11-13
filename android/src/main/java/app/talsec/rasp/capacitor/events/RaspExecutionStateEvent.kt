package app.talsec.rasp.capacitor.events

import app.talsec.rasp.capacitor.utils.RandomGenerator
import org.json.JSONArray

internal sealed class RaspExecutionStateEvent(override val value: Int) : BaseRaspEvent {
    override val channelName: String get() = CHANNEL_NAME
    override val channelKey: String get() = CHANNEL_KEY

    object FastChecksFinished : RaspExecutionStateEvent(RandomGenerator.next())
    object CriticalChecksFinished : RaspExecutionStateEvent(RandomGenerator.next())
    object PostponedChecksFinished : RaspExecutionStateEvent(RandomGenerator.next())

    companion object {
        internal val CHANNEL_NAME = RandomGenerator.next().toString()
        internal val CHANNEL_KEY = RandomGenerator.next().toString()

        internal val ALL_EVENTS = JSONArray(
            listOf(
                FastChecksFinished.value,
                CriticalChecksFinished.value,
                PostponedChecksFinished.value
            )
        )
    }
}