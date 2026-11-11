package com.aheaditec.freerasp.events

internal interface BaseRaspEvent {
    val value: Int
    val channelName: String
    val channelKey: String
}