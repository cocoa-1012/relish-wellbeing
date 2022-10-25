import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  "appId": "com.relish.wellbeing",
  "appName": "Relish Wellbeing",
  "bundledWebRuntime": false,
  // "npmClient": "npm",
  "webDir": "www",
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 0
    }
  },
  "cordova": {}
};

export default config;
