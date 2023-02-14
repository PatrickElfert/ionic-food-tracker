import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.sass'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class TabsPage {
  constructor() {}
}
