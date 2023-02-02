// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    projectId: 'strongtrack-e271f',
    appId: '1:575184755521:web:76060808997128ebf7dfc0',
    storageBucket: 'strongtrack-e271f.appspot.com',
    apiKey: 'AIzaSyC-igTnJ2UEYeeCBe1HHadBsyPZ-w8heb4',
    authDomain: 'strongtrack-e271f.firebaseapp.com',
    messagingSenderId: '575184755521',
    measurementId: 'G-CP3RLGS0VE',
  },
  production: false,
  useEmulators: true,
  baseUrl: 'http://localhost:8100',
  authEmulatorHost: 'localhost',
  firestoreEmulatorHost: 'localhost',
  authEmulatorPort: 9099,
  firestoreEmulatorPort: 9090,
  cypressUser: {
    email: 'test@user.com',
    password: 'testPassword',
    uid: 'IbFVmko4S7BNSrA74tEZpqeu5Ta3'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
