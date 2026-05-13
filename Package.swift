// swift-tools-version: 5.9
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "CapacitorFreerasp",
    platforms: [.iOS(.v13)],
    products: [
        .library(
            name: "CapacitorFreerasp",
            targets: ["FreeraspPlugin"]
        ),
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", "6.0.0"..<"9.0.0"),
    ],
    targets: [
        .binaryTarget(
            name: "TalsecRuntime",
            path: "ios/Plugin/TalsecRuntime.xcframework"
        ),
        .target(
            name: "FreeraspPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm"),
                "TalsecRuntime",
            ],
            path: "ios/Plugin",
            exclude: ["TalsecRuntime.xcframework"],
            sources: [
                "FreeraspPlugin.swift",
                "models/SecurityThreat.swift",
                "models/RaspExecutionStates.swift",
                "utils/Utils.swift",
                "utils/RandomGenerator.swift",
                "utils/EventIdentifiers.swift",
                "dispatchers/ThreatDispatcher.swift",
                "dispatchers/ExecutionStateDispatcher.swift",
            ]
        ),
    ]
)