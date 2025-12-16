import Foundation

internal class RandomGenerator { 
    
    private static var generatedNumbers = Set<Int>()
    private static let lock = NSLock()

    internal static func next() -> Int {
        lock.lock()
        defer { lock.unlock() }

        let min = 10_000_000
        let max = 999_999_999

        var nextNumber = Int.random(in: min...max)

        while !generatedNumbers.insert(nextNumber).inserted {
            nextNumber = Int.random(in: min...max)
        }

        return nextNumber
    }
}