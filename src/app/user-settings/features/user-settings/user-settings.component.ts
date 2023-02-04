import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/features/data-access/auth.service';
import { UserSettingsService } from '../../../shared/data-access/user-settings.service';
import { combineLatest, lastValueFrom, merge, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, skipWhile, startWith, switchMap, tap } from 'rxjs/operators';
import { IntakeSource, UserSettings } from '../../../shared/interfaces/user';
import { CaloricIntakeVariables } from '../../../shared/interfaces/caloric-intake-variables';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
})
export class UserSettingsComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private userSettingService: UserSettingsService
  ) {}

  async logOut() {
    await this.authService.signOut();
  }

  ngOnInit() {}
}
