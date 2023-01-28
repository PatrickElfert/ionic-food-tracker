import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.sass'],
})
export class Tab1Page {
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}
  navigate() {
    this.router.navigate(['meal'], { relativeTo: this.activatedRoute });
  }
}
