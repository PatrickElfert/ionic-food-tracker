import { Component, OnInit } from '@angular/core';
import {
  CaloricIntakeVariables,
  OnboardingService,
} from '../onboarding.service';
import { UserService } from '../../user.service';
import {Router} from '@angular/router';
import { UserSettingsService } from "../../user-settings.service";

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
    activityLevel: 'LIGHTLY ACTIVE',
  };

  public fixedCalories = 1800;

  constructor(
    public onboardingService: OnboardingService,
    public userSettingsService: UserSettingsService,
    public router: Router
  ) {}

  ngOnInit() {}

  public updateIntakeOnUserSettings() {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
/*
    this.userSettingsService.setUserSettings({
      userId: '',
      caloricIntakeVariables: this.caloricIntakeVariables,
    }),
    this.router.navigate(['tabs/tab1']);
*/
  }

  public saveUserSetCalories() {
    /*this.userSettingsService.setUserSettings({
      userId: '',
      fixedCalories: this.fixedCalories
    });*/
  }
}
