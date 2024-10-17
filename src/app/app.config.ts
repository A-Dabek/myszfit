import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: "AIzaSyCWP2LUPrqs0tvVNRVYL9u72nhVLay3EoM",
        authDomain: "myszfit-5e771.firebaseapp.com",
        projectId: "myszfit-5e771",
        storageBucket: "myszfit-5e771.appspot.com",
        messagingSenderId: "295260259757",
        appId: "1:295260259757:web:c11ea5e3aa0ccf30d9cd24"
      })
    ),
    provideFirestore(() => getFirestore()),
  ]
};
