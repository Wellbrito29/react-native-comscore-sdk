# SDK Validation Process for Apps - Mobile/OTT APPS Mobile

- Source PDF: `202410 EN - SDK Validation Process for Apps - Mobile_OTT.pdf`
- Pages: 5

## Extracted text by page

### Page 1

SDK Validation Process for Apps - Mobile/OTT
APPS Mobile

The validation process is as follows:

•
If the apps are public in the stores, please send us the links (iTunes store, Google Play Store,
Huawei App Gallery)

•
If the app is pre-release: There are 2 options (choose only one):

1. Reply to this email thread with the links of the APK (Android) and IPA (iOS) files through
a shared folder (Onedrive, GoogleDrive, WeTransfer, etc.)
2. Send through test managers such as Hockeyapp or TestFlight an invite to
csi_tagging@comscore.com to access the app.

a. Only in Firebase and Google Play invites add the email
csitagging.usa@gmail.com
b. In addition to this step, as that mailbox is not controlled by us but by colleagues
from the USA, please let us know in this email/thread when you send the invite in
order to have control of the date and QA department can search and review it.
Recommendation for iOS apps in pre-release or beta:

Always add our iOS UDIDs to be able to review them:

iPhone 11: 00008030-00064c363ee0402e
iPhone Spain: 1707593ee5ac1d0b0d3cb676ae93b480b5c532c6
iPad Mini : 86c6daf0a50610e4fe6529d0bde00ab0f8a47649
iPhone 5 : 022231bb2ef2f6836f5cebeb446c627b21f243e8
new iPad mini retina: 922cdaf06c0f091ecec6978a6cbf73322d0df67d
iPhone 5s: ce3c878937e5eaab8c735c69e4aaa5c19663bf7f
iPhone 7: ffd819faac56f559958c8a89c406bb10cfe3ac66
iPhone 11 Max Pro - 00008030000e209a0290802e

It is necessary to compile the build with version equal or greater than XCode 13 to avoid problems in the
installation/review of the app in our devices with iOS 15.

Process for Android app (necessary pre-release and public -Google Play store link-)

Because the SDK by default has the measurement encrypted, it is necessary to create and send a new
build that allows to see the responses of the tag. There are two ways to achieve it, please apply the
option that is most convenient for you

At the end of the revisions (with the final ok from Comscore) please put the build back with the encryption.

### Page 2

 Activate the “Validation Mode” feature

Validation Mode can be called by including the function
Analytics.getConfiguration().enableImplementationValidationMode()

The instructions can be consulted in the implementation manual section "Test your Implementation" as
seen in the following image.

 Add the Charles Debugger certificate to see the tag responses

With our new SDK 6.0+ the secureTransmission(true) by default, that is from Android OS 7.0+ all the
measurements for Android apps will be on HTTPS channel and the measurements will be encrypted.

For validation purpose client needs to whitelist our domain scorecardresearch and this can be done by
the below steps:

### Page 3

The client needs to add the certificate so the domain is whitelisted (
https://sb.scorecardresearch.com) for validation.

Sample certificate code for whitelisting our domain
<!-- AndroidManifest.xml -->
<application
...
android:networkSecurityConfig="@xml/network_security_config"
.../>
<!-- res/xml/network_security_config.xml -->
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
<domain-config cleartextTrafficPermitted="true">
<domain includeSubdomains="true">scorecardresearch.com</domain>
</domain-config>
<debug-overrides>
<trust-anchors>
<certificates src="system" />
<certificates src="user" />
<certificates src="@raw/charles_ssl"/>
</trust-anchors>
</debug-overrides>
<base-config cleartextTrafficPermitted="true">
<trust-anchors>
<certificates src="user" />
<certificates src="system" />
</trust-anchors>
</base-config>
</network-security-config>

To obtain the local Charles Debugging SSL certificate, go to Help -> SSL Proxying->
Save Charles root certificate... and place it into the android app in the folder res/raw

References:

https://android.googlesource.com/platform/frameworks/base.git/+/01a959d60a2c5f04a
b240513a853d7845b3a309e

https://developer.android.com/training/articles/security-
config#CleartextTrafficPermitted

(Android section) https://www.charlesproxy.com/documentation/using-
charles/ssl-certificates/

### Page 4

In this case you need to add/modify 3 files into your build

1) The AndroidManifest.xml with the code shared before.
2) The network_security_config.xml with the code shared before.
3) The file mentioned in raw folder (pointed in the network_security_config.xml code) you can get it when
browse (from the android phone/emulator) in this link http://chls.pro/ssl
*that file it’s only downloaded when your android phone/emulator is connected/proxy with
Charles debugger in your computer
**instructions to do that process with pictures: https://stackoverflow.com/a/31945622

These 3 main files edited/added looks like this (image as illustration from these instructions
https://stackoverflow.com/a/75672599 -- P.S. Use only our code from this guide for whitelist our
Comscore domain in the SDK for validations)

### Page 5

CTV APPs

•
To review your Apps regarding CTV we would use the device lab TVs to test (please share the
links/names of the apps),
•
If the apps are not available on playstore then we suggest to pass us the build (vía Onedrive,
GoogleDrive, WeTransfer, etc. link that everyone with can access -with no lock or login lock-) with
our devices whitelisted so we can test the videos, and if subscription is required to view content
then a test credential will be highly appreciated..

These are the devices that you need to add/whitelist to the builds in case you send us directly:

LGTV: 010MXYG5R866
SAMSUNG – 4: H3CB2NS2E6UQA
SAMSUNG 8000: MTCGUU3YP4TYY
VIZIO – D: 47LINIXTAU05902
VIZIO – V: LINIF97Y4404415

The build that you share with us could be file extension .ipk .apk .wdgt . tpk formats whichever you
develop the build in.
