import { Component, OnInit } from '@angular/core';
import { BarcodeScannerService } from '../../../shared/data-access/barcode-scanner.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/features/data-access/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(public barcodeScannerService: BarcodeScannerService,  public router: Router) {}

  async ngOnInit(): Promise<void> {}

  async closeScanner() {
    await this.barcodeScannerService.closeBarcodeScanner();
  }
}
