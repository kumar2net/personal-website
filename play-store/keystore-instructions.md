# Android Keystore Generation Instructions

## Generate Release Keystore

Run the following command to generate a release keystore for signing your Android app:

```bash
keytool -genkey -v -keystore android/app/release.keystore \
  -alias portfolio \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass android \
  -keypass android \
  -dname "CN=Kumar Portfolio, OU=Development, O=Kumar, L=City, S=State, C=US"
```

## Get SHA256 Fingerprint

After generating the keystore, get the SHA256 fingerprint:

```bash
keytool -list -v -keystore android/app/release.keystore -alias portfolio
```

Copy the SHA256 fingerprint and update the `assetlinks.json` file:

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.kumar.portfolio",
    "sha256_cert_fingerprints": ["YOUR_SHA256_FINGERPRINT_HERE"]
  }
}]
```

## Important Security Notes

- **Never commit the keystore to version control**
- **Store the keystore securely and backup safely**
- **Remember the passwords - losing them means you can't update your app**
- **Use Google Play App Signing for production apps**

## Google Play App Signing

For production apps, it's recommended to use Google Play App Signing:

1. Upload your APK to Google Play Console
2. Google will generate a new signing key
3. Use Google's signing key for future updates
4. Keep your upload key secure for initial uploads