import { Injectable, OnInit } from "@angular/core";
import { Observable } from 'rxjs';
import { User } from "../../../shared/interfaces/user";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export abstract class AuthService {

  abstract authStateChanged$: Observable<User | undefined>;
  constructor(protected router: Router) { }

  abstract signIn(): void;
  abstract signOut(): void;
}
