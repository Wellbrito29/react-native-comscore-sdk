require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "RNComscore"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => '15.1' }
  s.source       = { :git => "https://github.com/Wellbrito29/react-native-comscore-sdk.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,swift,cpp}"
  s.private_header_files = "ios/**/*.h"

  s.dependency "ComScore", "~> 6.0"

  begin
    install_modules_dependencies(s)
  rescue => e
    s.dependency "React-Core"
    s.dependency "ReactCodegen"
    s.dependency "RCTRequired"
    s.dependency "RCTTypeSafety"
    s.dependency "ReactCommon/turbomodule/bridging"
    s.dependency "ReactCommon/turbomodule/core"
    s.dependency "React-NativeModulesApple"
    s.dependency "React-RCTFabric"
    s.dependency "React-Fabric"
    s.dependency "React-graphics"
    s.dependency "React-utils"
    s.dependency "React-featureflags"
    s.dependency "React-debug"
    s.dependency "React-ImageManager"
    s.dependency "React-rendererdebug"
    s.dependency "React-jsi"
    s.dependency "React-renderercss"
    s.dependency "Yoga"
    s.dependency "RCT-Folly"
  end
end
