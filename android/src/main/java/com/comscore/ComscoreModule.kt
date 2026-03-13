package com.comscore

import android.app.ActivityManager
import android.content.Context
import android.os.Process
import com.comscore.Analytics
import com.comscore.PublisherConfiguration
import com.comscore.UsagePropertiesAutoUpdateMode
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import java.util.HashMap

class ComscoreModule(reactContext: ReactApplicationContext) :
  NativeComscoreSpec(reactContext) {

  private var isInitialized = false

  private fun isMainProcess(): Boolean {
    val activityManager = reactApplicationContext.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
    val runningProcesses = activityManager.runningAppProcesses
    if (runningProcesses != null) {
      val pid = Process.myPid()
      for (processInfo in runningProcesses) {
        if (processInfo.pid == pid) {
          return processInfo.processName == reactApplicationContext.packageName
        }
      }
    }
    return true // Fallback to true if we can't determine
  }

  override fun initialize(
    publisherId: String,
    applicationName: String,
    autoUpdateMode: String,
    autoUpdateIntervalSeconds: Double,
    childDirected: Boolean,
    validationMode: Boolean,
    startOnlyWhenUIIsVisible: Boolean,
    initialConsent: String,
    debugLogs: Boolean,
    promise: Promise
  ) {
    if (isInitialized) {
      promise.resolve(null)
      return
    }

    if (!isMainProcess()) {
      promise.reject("PROCESS_ERROR", "Comscore can only be initialized from the main process.")
      return
    }

    try {
      val config = Analytics.getConfiguration()

      // 1. Publisher Config (mandatory)
      val publisherConfig = PublisherConfiguration.Builder()
        .publisherId(publisherId)
        .build()
      config.addClient(publisherConfig)

      // 2. Application Name (optional)
      if (applicationName.isNotEmpty()) {
        config.setApplicationName(applicationName)
      }

      // 3. Auto Update Mode (optional)
      when (autoUpdateMode) {
        "foregroundOnly" -> config.setUsagePropertiesAutoUpdateMode(UsagePropertiesAutoUpdateMode.FOREGROUND_ONLY)
        "foregroundAndBackground" -> config.setUsagePropertiesAutoUpdateMode(UsagePropertiesAutoUpdateMode.FOREGROUND_AND_BACKGROUND)
        "disabled" -> config.setUsagePropertiesAutoUpdateMode(UsagePropertiesAutoUpdateMode.DISABLED)
      }

      // 4. Auto Update Interval (optional, default 60s)
      if (autoUpdateIntervalSeconds >= 60) {
        config.setUsagePropertiesAutoUpdateInterval(autoUpdateIntervalSeconds.toInt())
      }

      // 5. Child Directed (before start)
      if (childDirected) {
        config.setChildDirectedAppMode(true)
      }

      // 6. Validation Mode (before start, block in release)
      if (validationMode) {
        val isDebug = (reactApplicationContext.applicationInfo.flags and android.content.pm.ApplicationInfo.FLAG_DEBUGGABLE) != 0
        if (isDebug) {
          config.enableImplementationValidationMode()
        }
      }

      // 7. Initial Consent (cs_ucfr as Persistent Label)
      if (initialConsent.isNotEmpty()) {
        config.setPersistentLabel("cs_ucfr", initialConsent)
      }

      // 8. Start the SDK
      Analytics.start(reactApplicationContext)

      isInitialized = true
      promise.resolve(null)
    } catch (e: Exception) {
      promise.reject("INIT_ERROR", e.message)
    }
  }

  override fun notifyUxActive(promise: Promise) {
    Analytics.notifyUxActive()
    promise.resolve(null)
  }

  override fun notifyUxInactive(promise: Promise) {
    Analytics.notifyUxInactive()
    promise.resolve(null)
  }

  override fun trackSection(sectionName: String, promise: Promise) {
    val labels = HashMap<String, String>()
    labels["ns_category"] = sectionName
    Analytics.notifyViewEvent(labels)
    promise.resolve(null)
  }

  override fun updateConsent(value: String, promise: Promise) {
    try {
      val config = Analytics.getConfiguration()
      config.setPersistentLabel("cs_ucfr", value)
      
      // According to guidelines: if consent changes after start, update cs_ucfr AND fire hidden event
      Analytics.notifyHiddenEvent()
      
      promise.resolve(null)
    } catch (e: Exception) {
      promise.reject("CONSENT_ERROR", e.message)
    }
  }

  override fun setChildDirected(enabled: Boolean, promise: Promise) {
    Analytics.getConfiguration().setChildDirectedAppMode(enabled)
    promise.resolve(null)
  }

  override fun setValidationMode(enabled: Boolean, promise: Promise) {
    val isDebug = (reactApplicationContext.applicationInfo.flags and android.content.pm.ApplicationInfo.FLAG_DEBUGGABLE) != 0
    if (enabled && isDebug) {
      Analytics.getConfiguration().enableImplementationValidationMode()
    }
    // If release, this is a no-op as per guidelines
    promise.resolve(null)
  }

  override fun getVersion(promise: Promise) {
    promise.resolve(Analytics.getVersion())
  }

  companion object {
    const val NAME = "Comscore"
  }
}
