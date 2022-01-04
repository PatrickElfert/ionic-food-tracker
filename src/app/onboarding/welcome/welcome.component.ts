import { Component, OnInit } from '@angular/core';
import { OnboardingService } from '../onboarding.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.sass'],
})
export class WelcomeComponent implements OnInit {
  constructor(
    public onboardingService: OnboardingService,
    private router: Router
  ) {}

  ngOnInit() {}

  public async navigateToIntakePage(knowsIntake: boolean): Promise<void> {
    this.onboardingService.knowsIntake = knowsIntake;
    await this.router.navigate(['onboarding/intake']);
  }
}
