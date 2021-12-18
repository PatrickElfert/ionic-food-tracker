import { CapacitorConfig } from '@capacitor/cli';
/// <reference types="@capacitor/firebase-authentication" />;

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Strong Track',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    FirebaseAuthentication: {
      skipNativeAuth: true,
      providers: ['google.com'],
    },
  },
};

export default config;
