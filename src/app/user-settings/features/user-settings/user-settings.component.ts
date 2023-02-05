import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/features/data-access/auth.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsComponent implements OnInit {

  constructor(
    private authService: AuthService,
  ) {}

  async logOut() {
    await this.authService.signOut();
  }

  ngOnInit() {}
}
