import { Component, OnInit } from '@angular/core';
import { OnboardingService } from '../onboarding.service';

@Component({
  selector: 'app-intake',
  templateUrl: './intake.component.html',
  styleUrls: ['./intake.component.sass'],
})
export class IntakeComponent implements OnInit {
  constructor(public onboardingService: OnboardingService) {}

  ngOnInit() {}
}
