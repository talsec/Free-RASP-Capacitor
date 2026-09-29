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
            url: "https://storage.googleapis.com/talsec-artifact-repository/freerasp/ios/capacitor/7.1.4/TalsecRuntime.xcframework.zip",
            checksum: "a040b95fbfd555277b578259d8e85befb125e4c8b19138b991f45c4920adf1d3"
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
