import { Injectable, OnInit } from "@angular/core";
import { Observable } from 'rxjs';
import { User } from "../../../interfaces/user";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export abstract class AuthService {

  abstract authStateChanged$: Observable<User | undefined>;
  constructor(protected router: Router) { }

  abstract signIn(): void;
  abstract signOut(): void;

  public registerRedirects(): void {
    this.authStateChanged$.subscribe((user) => {
      if(user) {
        this.router.navigate(['tabs', 'tab1']);
      } else {
        this.router.navigate(['auth']);
      }
    });
  }

}
