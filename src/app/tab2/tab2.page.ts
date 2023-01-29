import { Component } from '@angular/core';
import { Auth } from "@angular/fire/auth";
import { AuthService } from "../auth/features/data-access/auth.service";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.sass']
})
export class Tab2Page {

  constructor(private authService: AuthService) {}

  async logOut() {
    await this.authService.signOut();
  }
}
