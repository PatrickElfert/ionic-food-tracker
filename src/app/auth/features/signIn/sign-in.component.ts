import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from '../data-access/auth.service';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  imports: [IonicModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class SignInComponent implements OnInit {

  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}
  async ngOnInit() {}
  async signIn() {
    await this.authService.signInWithEmailAndPassword(this.email, this.password);
    await this.router.navigate(['/']);
  }
}
