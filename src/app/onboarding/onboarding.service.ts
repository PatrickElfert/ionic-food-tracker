import { Injectable } from '@angular/core';
import { UserService } from '../user.service';
import { map } from 'rxjs/operators';

export interface CaloricIntakeVariables {
  ageInYears: number;
  weightInKg: number;
  heightInCm: number;
  gender: 'MALE' | 'FEMALE';
  activityLevel: 'LIGHT' | 'ACTIVE' | 'VERY ACTIVE' | 'FAT FUCK';
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
