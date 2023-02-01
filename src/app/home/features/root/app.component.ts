import { Component, OnInit } from '@angular/core';
import { BarcodeScannerService } from '../../../shared/data-access/barcode-scanner.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/features/data-access/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.sass'],
})
export class AppComponent implements OnInit {
  constructor(public barcodeScannerService: BarcodeScannerService, private authService: AuthService, public router: Router) {}

  async ngOnInit(): Promise<void> {
   this.authService.registerRedirects();
  }

  async closeScanner() {
    await this.barcodeScannerService.closeBarcodeScanner();
  }
}
