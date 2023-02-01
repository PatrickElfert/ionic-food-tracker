import { Injectable } from '@angular/core';
import { UserService } from '../shared/data-access/user.service';
import { map } from 'rxjs/operators';

export interface CaloricIntakeVariables {
  ageInYears: number;
  weightInKg: number;
  heightInCm: number;
  gender: 'MALE' | 'FEMALE';
  activityLevel: 'NOT ACTIVE' | 'LIGHTLY ACTIVE' | 'ACTIVE' | 'VERY ACTIVE';
  goal: 'LOSS' | 'GAIN' | 'KEEP';
}

@Injectable({
  providedIn: 'root',
})
export class OnboardingService {
  public knowsIntake = false;
  public caloricIntake = this.userService.userDocumentReference$.pipe(
    map((user) => {})
  );
  constructor(private userService: UserService) {}

}
