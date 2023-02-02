/// <reference types="cypress" />

import { getApp, initializeApp } from 'firebase/app';
import {
  connectAuthEmulator,
  signInWithEmailAndPassword,
  getAuth,
} from 'firebase/auth';
import { environment } from '../../src/environments/environment';
import {
  connectFirestoreEmulator,
  deleteDoc,
  doc,
  initializeFirestore,
} from 'firebase/firestore';

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

Cypress.Commands.add('resetFirestore', () => {
  const emulatorHost = Cypress.env('firestoreEmulatorHost');
  const emulatorPort = Cypress.env('firestoreEmulatorPort');
  return cy.request('DELETE',
    `http://${emulatorHost}:${emulatorPort}/emulator/v1/projects/strongtrack-e271f/databases/(default)/documents`
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

