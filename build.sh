#!/usr/bin/env bash
# 一键出 Android APK：网页产物 + Capacitor sync + Gradle 打包。
set -euo pipefail; cd "$(dirname "$0")"

# JDK 17（Capacitor 6 要求）；未设则探测 Homebrew 安装
if [ -z "${JAVA_HOME:-}" ]; then
  for d in /opt/homebrew/Cellar/openjdk@17/*/libexec/openjdk.jdk/Contents/Home /usr/local/Cellar/openjdk@17/*/libexec/openjdk.jdk/Contents/Home; do
    [ -d "$d" ] && export JAVA_HOME="$d" && break
  done
fi
# Android SDK；未设则探测 Homebrew command-line tools
export ANDROID_HOME="${ANDROID_HOME:-/opt/homebrew/share/android-commandlinetools}"

[ -d node_modules ] || npm install
node scripts/build-web.js
[ -d android ] || npx cap add android
npx cap sync
( cd android && ./gradlew assembleDebug 2>&1 | tail -3 )
echo "📦 APK: android/app/build/outputs/apk/debug/app-debug.apk"
