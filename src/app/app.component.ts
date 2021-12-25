import { Component, OnInit } from '@angular/core';
import { BarcodeScannerService } from './barcode-scanner.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.sass'],
})
export class AppComponent implements OnInit {
  constructor(public barcodeScannerService: BarcodeScannerService) {}

  async ngOnInit(): Promise<void> {}

  async closeScanner() {
    await this.barcodeScannerService.closeBarcodeScanner();
  }
}
