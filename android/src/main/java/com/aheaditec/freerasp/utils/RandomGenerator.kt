package com.aheaditec.freerasp.utils

internal object RandomGenerator {
    private val generatedNumbers = mutableSetOf<Int>()

    internal fun next(): Int {
        var nextNumber = (10000..999999999).random()
        while (!generatedNumbers.add(nextNumber)) {
            nextNumber = (10000..999999999).random()
        }
        return nextNumber
    }
}