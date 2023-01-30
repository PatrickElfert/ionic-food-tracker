import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../../auth/features/data-access/auth.service";
import { UserSettingsService } from "../../../user-settings.service";
import { lastValueFrom } from "rxjs";

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
})
export class UserSettingsComponent implements OnInit {

  constructor(private authService: AuthService, private userSettingService: UserSettingsService) {}

  async logOut() {
    await this.authService.signOut();
  }

  ngOnInit() {}

  addUserSettings() {
    void lastValueFrom(this.userSettingService.initializeUserSettings(3000));
  }
}
