import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {GestureController} from '@ionic/angular';
import {Ingredient, IngredientService} from '../ingredient.service';
import {Haptics, ImpactStyle} from '@capacitor/haptics';

@Component({
  selector: 'app-food-card',
  templateUrl: './food-card.component.html',
  styleUrls: ['./food-card.component.sass'],
})
export class FoodCardComponent implements AfterViewInit{
  @ViewChild('slider') slider: ElementRef | undefined;
  @Input() data: Ingredient | undefined;
  @Input() actions = true;
  @Output() deleted: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() edited: EventEmitter<boolean> = new EventEmitter<boolean>();

  public selected = false;
  public delete = false;
  public edit = false;

  constructor(private gestureController: GestureController, public ingredientService: IngredientService) {}

  ngAfterViewInit(): void {
    this.registerSlider();
  }

  private registerSlider() {
    if(!this.actions) {
      return;
    }
    const ANIMATION_BREAKPOINT = 120;
    const style = this.slider.nativeElement.style;
    const moveGesture = this.gestureController.create({
      el: this.slider.nativeElement,
      gestureName: 'slide',
      threshold: 0,
      onMove: ev => {
        style.transform = `translate3d(${ev.deltaX}px, 0, 0)`;
        if (ev.deltaX < ANIMATION_BREAKPOINT * -1 && !this.delete) {
          Haptics.impact({style: ImpactStyle.Medium});
          this.delete = true;
        } else if (ev.deltaX > ANIMATION_BREAKPOINT * -1 && this.delete) {
          this.delete = false;
        }
        if (ev.deltaX > ANIMATION_BREAKPOINT && !this.edit) {
          Haptics.impact({style: ImpactStyle.Medium});
          this.edit = true;
        } else if (ev.deltaX < ANIMATION_BREAKPOINT && this.edit) {
          this.edit = false;
        }
      }
      ,
      onEnd: ev => {
        console.log(this.edit);
        console.log(this.delete);
        if (this.delete) {
          this.deleted.emit();
        } else if (this.edit) {
          this.edited.emit();
        }
        style.transform = `translate(0)`;
      }
    });
    moveGesture.enable();
  }
}
