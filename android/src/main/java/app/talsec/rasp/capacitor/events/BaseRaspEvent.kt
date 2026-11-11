package app.talsec.rasp.capacitor.events

internal interface BaseRaspEvent {
    val value: Int
    val channelName: String
    val channelKey: String
}