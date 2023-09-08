import Foundation

@objc public class Freerasp: NSObject {
    @objc public func echo(_ value: String) -> String {
        print(value)
        return value
    }
}
