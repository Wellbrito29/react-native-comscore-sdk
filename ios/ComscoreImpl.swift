import Foundation
import ComScore

@objc(ComscoreImpl)
public class ComscoreImpl: NSObject {
    private var isInitialized = false

    @objc
    public func initialize(
        publisherId: String,
        applicationName: String,
        autoUpdateMode: String,
        autoUpdateIntervalSeconds: Double,
        childDirected: Bool,
        validationMode: Bool,
        startOnlyWhenUIIsVisible: Bool,
        initialConsent: String,
        debugLogs: Bool,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        if isInitialized {
            resolve(nil)
            return
        }

        let config = SCORAnalytics.configuration()

        // 1. Publisher Config (mandatory)
        let publisherConfig = SCORPublisherConfiguration(builderBlock: { builder in
            builder?.publisherId = publisherId
        })
        config.addClient(with: publisherConfig)

        // 2. Application Name (optional)
        if !applicationName.isEmpty {
            config.applicationName = applicationName
        }

        // 3. Auto Update Mode (optional)
        switch autoUpdateMode {
        case "foregroundOnly":
            config.usagePropertiesAutoUpdateMode = .foregroundOnly
        case "foregroundAndBackground":
            config.usagePropertiesAutoUpdateMode = .foregroundAndBackground
        case "disabled":
            config.usagePropertiesAutoUpdateMode = .disabled
        default:
            break
        }

        // 4. Auto Update Interval (optional, default 60s)
        if autoUpdateIntervalSeconds >= 60 {
            config.usagePropertiesAutoUpdateInterval = Int32(autoUpdateIntervalSeconds)
        }

        // 5. Child Directed (before start)
        if childDirected {
            config.childDirectedAppMode = true
        }

        // 6. Validation Mode (before start, block in release)
        if validationMode {
            #if DEBUG
            config.enableImplementationValidationMode()
            #endif
        }

        // 7. Initial Consent (cs_ucfr as Persistent Label)
        if !initialConsent.isEmpty {
            config.setPersistentLabelWithName("cs_ucfr", value: initialConsent)
        }

        // 8. Start the SDK
        SCORAnalytics.start()

        isInitialized = true
        resolve(nil)
    }

    @objc
    public func notifyUxActive(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        SCORAnalytics.notifyUxActive()
        resolve(nil)
    }

    @objc
    public func notifyUxInactive(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        SCORAnalytics.notifyUxInactive()
        resolve(nil)
    }

    @objc
    public func trackSection(sectionName: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        SCORAnalytics.notifyViewEvent(withLabels: ["ns_category": sectionName])
        resolve(nil)
    }

    @objc
    public func updateConsent(value: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        SCORAnalytics.configuration().setPersistentLabelWithName("cs_ucfr", value: value)
        // According to guidelines: if consent changes after start, update cs_ucfr AND fire hidden event
        SCORAnalytics.notifyHiddenEvent()
        resolve(nil)
    }

    @objc
    public func setChildDirected(enabled: Bool, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        SCORAnalytics.configuration().childDirectedAppMode = enabled
        resolve(nil)
    }

    @objc
    public func setValidationMode(enabled: Bool, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        #if DEBUG
        if enabled {
            SCORAnalytics.configuration().enableImplementationValidationMode()
        }
        #endif
        resolve(nil)
    }

    @objc
    public func getVersion(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        resolve(SCORAnalytics.version())
    }
}
