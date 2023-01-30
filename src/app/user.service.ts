import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  CollectionReference,
  setDoc,
  Firestore, docData
} from "@angular/fire/firestore";
import { User, UserSettings } from './interfaces/user';
import { DocumentReference } from 'rxfire/firestore/interfaces';
import { Router } from '@angular/router';
import {
  combineLatest,
  from,
  Subject
} from "rxjs";
import { filter, map, switchMap, take, tap } from "rxjs/operators";
import { isNotUndefinedOrNull } from "../utils";
import { AuthService } from "./auth/features/data-access/auth.service";

@Injectable({
  providedIn: 'root',
})
export class UserService {

  public userDocumentReference$ = this.authService.authStateChanged$.pipe(
    filter(isNotUndefinedOrNull),
    map((user) => this.buildUserDocumentReference(user.userId)),
  );

  constructor(
    private router: Router,
    private firestore: Firestore,

    private authService: AuthService,
  ) {}


  public buildUserDocumentReference(userId: string): DocumentReference<User> {
      return doc<User>(
        collection(this.firestore, 'user') as CollectionReference<User>,
        userId
      );
  }
}
