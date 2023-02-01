import { Injectable } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Injectable({
  providedIn: 'root',
})
export class BarcodeScannerService {
  public scannerShown = false;
  constructor() {}

  public async openBarcodeScanner(): Promise<string | undefined> {
    await BarcodeScanner.checkPermission({ force: true });
    await BarcodeScanner.hideBackground();
    document.body.style.background = 'none';
    this.scannerShown = true;
    const result = await BarcodeScanner.startScan();
    this.scannerShown = false;
    return result.content;
  }

  public async closeBarcodeScanner(): Promise<void> {
    await BarcodeScanner.stopScan();
    document.body.style.background = '';
    this.scannerShown = false;
  }
}
