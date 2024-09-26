package com.aheaditec.freerasp

import org.json.JSONArray
import org.json.JSONObject

class Utils {}

internal fun JSONArray.toArray(): Array<String> {
    val output = mutableListOf<String>()
    for (i in 0 until this.length()) {
        this.getString(i)?.let(output::add)
    }
    return output.toTypedArray()
}

internal fun JSONObject.getArraySafe(key: String): Array<String> {
    if (this.has(key)) {
        val inputArray = this.getJSONArray(key)
        return inputArray.toArray()
    }
    return arrayOf()
}
