// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "CapacitorFreerasp",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "CapacitorFreerasp",
            targets: ["CapacitorFreerasp"]
        )
    ],
    dependencies: [
        .package(
            url: "https://github.com/ionic-team/capacitor-swift-pm.git",
            from: "8.0.0"
        )
    ],
    targets: [
        .binaryTarget(
            name: "TalsecRuntime",
            url: "https://storage.googleapis.com/talsec-artifact-repository/freerasp/ios/capacitor/7.1.1/TalsecRuntime.xcframework.zip",
            checksum: "fced1ed1c8ce3eec19ca66f290e65a3a1dab0ed2d2893ca82ced76e6e890b08b"
        ),
        .target(
            name: "CapacitorFreerasp",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                "TalsecRuntime"
            ],
            path: "ios/Plugin",
            exclude: [
                "FreeraspPlugin.h",
                "FreeraspPlugin.m",
                "Info.plist",
                "TalsecRuntime.xcframework"
            ]
        )
    ]
)
