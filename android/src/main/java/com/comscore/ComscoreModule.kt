package com.comscore

import com.facebook.react.bridge.ReactApplicationContext

class ComscoreModule(reactContext: ReactApplicationContext) :
  NativeComscoreSpec(reactContext) {

  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }

  companion object {
    const val NAME = NativeComscoreSpec.NAME
  }
}
