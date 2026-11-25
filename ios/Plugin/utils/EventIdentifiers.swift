struct EventIdentifiers {
    static var generatedNumbers: [Int] = {
        var numbers = [Int]()
        for _ in 0..<22 {
            numbers.append(RandomGenerator.next())
        }
        return numbers
    }()

    static let threatChannelKey: String = String(generatedNumbers[0])
    static let threatChannelName: String = String(generatedNumbers[1])
    static let raspExecutionStateChannelKey: String = String(generatedNumbers[2])
    static let raspExecutionStateChannelName: String = String(generatedNumbers[3])

    static let raspExecutionStateIdentifierList: [Int] = Array(generatedNumbers[4...6])
    static let threatIdentifierList: [Int] = generatedNumbers.suffix(15)
}
