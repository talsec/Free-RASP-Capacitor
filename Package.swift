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
            url: "https://storage.googleapis.com/talsec-artifact-repository/freerasp/ios/capacitor/7.1.2/TalsecRuntime.xcframework.zip",
            checksum: "db6c4236bb9619b9c19ccada6b6787c137da2d72cc2e52c73537404c080024b3"
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
