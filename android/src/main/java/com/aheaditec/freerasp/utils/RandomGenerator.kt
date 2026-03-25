package com.aheaditec.freerasp.utils

import java.security.SecureRandom
import java.util.concurrent.ConcurrentHashMap

internal object RandomGenerator {
    private val secureRandom = SecureRandom()

    private val generatedNumbers = ConcurrentHashMap.newKeySet<Int>()

    internal fun next(): Int {
        val min = 10_000_000
        val max = 999_999_999
        val range = (max - min) + 1

        var nextNumber: Int
        do {
            nextNumber = secureRandom.nextInt(range) + min
        } while (!generatedNumbers.add(nextNumber))

        return nextNumber
    }
}
