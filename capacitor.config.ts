import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Strong Track',
  webDir: 'www',
  bundledWebRuntime: false,
  ios: {
    contentInset: 'always'
  }
};

export default config;
