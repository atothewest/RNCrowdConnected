# React Native Crowd Connected Demo

Example integration of Crowd Connected SDK (`1.3.0`) in a React Native project, with initial support for limited subset of CC functionality including starting/stopping navigation and setting device alias.

### Environment

```
Node: v16.15.0
React: v18.0.0
React Native: v0.69.1
```

## Setup

Make sure Cocoapods is installed by running `pod --version`. If it is not, run:

`$ sudo gem install cocoapods`

To install dependencies for the project, run:

```
make setup
```

In `App.tsx`, update the following credentials constants:

```
const CC_KEY = "YOUR_APP_KEY";
const CC_TOKEN = "YOUR_APP_TOKEN";
const CC_SECRET = "YOUR_APP_SECRET";
```

## Running

### iOS

With Xcode and Command Line Tools installed, run:

```
make start-ios
```

You can also use `make xcode` to open the project with Xcode and build directly to any device.

### Android

Install Android Studio, then from `Tools -> SDK Manager` ensure the followed are installed:

- Android SDK Build-Tools
- Android SDK Platform-Tools
- Android SDK Command-line Tools
- Android Emulator

You will also need to configure a Virtual Device. Then either launch directly from Android Studio, or run:

```
make start-android
```
