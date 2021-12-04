import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalorieBarComponent } from './calorie-bar.component';

describe('CalorieBarComponent', () => {
  let component: CalorieBarComponent;
  let fixture: ComponentFixture<CalorieBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalorieBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalorieBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
