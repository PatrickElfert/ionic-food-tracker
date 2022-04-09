import { Component, OnInit } from '@angular/core';
import {
  CaloricIntakeVariables,
  OnboardingService,
} from '../onboarding.service';
import { UserService } from '../../user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-intake',
  templateUrl: './intake.component.html',
  styleUrls: ['./intake.component.sass'],
})
export class IntakeComponent implements OnInit {
  public caloricIntakeVariables: CaloricIntakeVariables = {
    ageInYears: 20,
    heightInCm: 170,
    weightInKg: 70,
    gender: 'MALE',
    goal: 'KEEP',
    activityLevel: 'LIGHT',
  };
  constructor(
    public onboardingService: OnboardingService,
    public userService: UserService,
    public router: Router
  ) {}

  ngOnInit() {}

  updateIntakeOnUserSettings() {
    this.userService.setUserSettings({
      userId: '',
      caloricIntakeVariables: this.caloricIntakeVariables,
    }),
    this.router.navigate(['tabs/tab1']);
  }
}
