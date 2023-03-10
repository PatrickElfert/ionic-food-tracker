import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from '../data-access/auth.service';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.sass'],
  imports: [IonicModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class SignInComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}
  async ngOnInit() {}
  async signIn() {
    await this.authService.signIn();
    await this.router.navigate(['/']);
  }
}
