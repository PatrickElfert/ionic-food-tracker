/// <reference types="cypress" />

import { getApp, initializeApp } from 'firebase/app';
import {
  connectFirestoreEmulator,
  doc,
  getFirestore,
  initializeFirestore,
  setDoc,
} from 'firebase/firestore';
import {
  connectAuthEmulator,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { environment } from '../../src/environments/environment';
import {
  ActivityLevel,
  Gender,
  Goal,
} from '../../src/app/shared/interfaces/caloric-intake-variables';

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//

Cypress.Commands.add(
  'signIn',
  (
    redirectPath = '/',
    credentials = {
      email: Cypress.env(`cypressUser`).email as string,
      password: Cypress.env(`cypressUser`).password as string,
    }
  ) => {
    signInProgrammatically(credentials);
    cy.visit(redirectPath);
  }
);

Cypress.Commands.add('resetFirestore', () =>
  cy.request(
    'DELETE',
    `http://${Cypress.env('firestoreEmulatorHost')}:${Cypress.env(
      'firestoreEmulatorPort'
    )}/emulator/v1/projects/strongtrack-e271f/databases/(default)/documents`
  )
);

Cypress.Commands.add('initializeFireStore', () => {
  const firestore = initializeFirestore(getApp(), {
    experimentalForceLongPolling: true,
    ignoreUndefinedProperties: true,
  });

  connectFirestoreEmulator(
    firestore,
    Cypress.env('firestoreEmulatorHost'),
    Cypress.env('firestoreEmulatorPort')
  );
});

Cypress.Commands.add('initializeUserSettings', () => {
  return cy.wrap(
    setDoc(
      doc(getFirestore(), 'userSettings', Cypress.env('cypressUser').uid),
      {
        caloricIntakeVariables: {
          birthdate: new Date('1998-01-01').getTime(),
          heightInCm: 180,
          weightInKg: 80,
          gender: Gender.male,
          goal: Goal.keep,
          activityLevel: ActivityLevel.active,
        },
        calories: undefined,
        fixedCalories: 2000,
        userId: 'test',
        mealCategories: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
        intakeSource: 'fixed',
      }
    )
  );
});

const getAuthEmulatorHost = () => {
  const host = Cypress.env('authEmulatorHost') as string;
  const port = Cypress.env('authEmulatorPort') as string;

  return ['http://', host, ':', port].join('');
};

const initAuth = () => {
  const app = initializeApp(environment.firebase);
  const auth = getAuth(app);
  connectAuthEmulator(auth, getAuthEmulatorHost());
  return auth;
};

export const signInProgrammatically = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const currentAuth = initAuth();

  const signIn = signInWithEmailAndPassword(currentAuth, email, password).catch(
    (e) => {
      cy.log(`User could not sign in programmatically!`);
      console.error(e);
    }
  );
  return cy.wrap(signIn);
};

export const dataCy = (element: string) => `[data-cy=${element}]`;
