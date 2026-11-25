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
            url: "https://storage.googleapis.com/talsec-artifact-repository/freerasp/ios/capacitor/9.0.0/TalsecRuntime.xcframework.zip",
            checksum: "166af6cd457831460c5e442a7f6d488a7a939905a916c272aecf729af97928fd"
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
