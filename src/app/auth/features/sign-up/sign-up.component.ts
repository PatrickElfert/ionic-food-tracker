import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ToastService } from 'src/app/shared/data-access/toast.service';
import { AuthService } from '../data-access/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  imports: [IonicModule, FormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class SignUpComponent implements OnInit {
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {}

  async signUpWithEmailAndPassword() {
    try {
      await this.authService.signUpWithEmailAndPassword(
        this.email,
        this.password
      );
      await this.router.navigate(['']);
    } catch (e) {
      if (e instanceof FirebaseError) {
        this.toastService.showErrorToast(e.code);
      }
    }
  }

  async signUpWithGoogle() {
    try {
      await this.authService.signUpWithGoogle();
      await this.router.navigate(['']);
    } catch (e) {
      if (e instanceof FirebaseError) {
        this.toastService.showErrorToast(e.code);
      }
    }
  }
}
