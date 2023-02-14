import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.sass'],
  imports: [
    IonicModule
  ],
  standalone: true
})
export class WelcomeComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  public async navigateToIntakePage(knowsIntake: boolean): Promise<void> {
    await this.router.navigate(['onboarding/intake', knowsIntake]);
  }
}
