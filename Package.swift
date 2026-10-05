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
            url: "https://storage.googleapis.com/talsec-artifact-repository/freerasp/ios/capacitor/8.0.1/TalsecRuntime.xcframework.zip",
            checksum: "c31ec0bb9bfcbdf1f44114a35e663fbe3655803b4479c20f0d550c0488589f62"
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
