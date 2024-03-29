import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from '../data-access/auth.service';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastService } from 'src/app/shared/data-access/toast.service';
import { FirebaseError } from '@angular/fire/app';

@Component({
  selector: 'app-login',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  imports: [IonicModule, FormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class SignInComponent implements OnInit {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}
  async ngOnInit() {}

  async signUpWithEmailAndPassword() { try {
      await this.authService.signInWithEmailAndPassword(
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

  async signInWithGoogle() {
    try {
      await this.authService.signInWithGoogle();
      await this.router.navigate(['']);
    } catch (e) {
      if (e instanceof FirebaseError) {
        this.toastService.showErrorToast(e.code);
      }
    }
  }

}
