import {Component, OnInit} from '@angular/core';
import {Platform} from '@ionic/angular';
import {Keyboard, KeyboardResize} from '@capacitor/keyboard';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.sass'],
})
export class AppComponent implements OnInit
{
  constructor(platform: Platform) {
  }

  async ngOnInit(): Promise<void> {
  }

}
