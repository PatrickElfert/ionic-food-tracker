import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from "../data-access/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent implements OnInit {
  constructor(private authService: AuthService) {}

  async ngOnInit() {
  }

  async signIn() {
    await this.authService.signIn();
  }
}
