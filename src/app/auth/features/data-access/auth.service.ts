import { Injectable, OnInit } from "@angular/core";
import { Observable } from 'rxjs';
import { User } from "../../../shared/interfaces/user";
import { Router } from "@angular/router";
import { UserCredential } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export abstract class AuthService {

  abstract authStateChanged$: Observable<User | undefined>;
  constructor(protected router: Router) { }

  abstract signInWithEmailAndPassword(email: string, password: string): Promise<UserCredential>;
  abstract signInWithGoogle(): Promise<UserCredential>;
  abstract signUpWithEmailAndPassword(email: string, password: string): Promise<UserCredential>;
  abstract signUpWithGoogle(): Promise<UserCredential>;
  abstract signOut(): void;
}
