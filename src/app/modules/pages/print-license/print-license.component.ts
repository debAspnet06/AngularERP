import { Component, OnDestroy, OnInit } from '@angular/core';
import { SvTradeRegistrationService } from '../page-service/trade-reg/sv-trade-registration.service';

@Component({
  selector: 'app-print-license',
  templateUrl: './print-license.component.html',
  styleUrls: ['./print-license.component.scss'],
})
export class PrintLicenseComponent implements OnInit, OnDestroy {
  formNo = sessionStorage.getItem('formNo');
  userLicense: any[] = [];
  constructor(private svTrade: SvTradeRegistrationService) {}

  ngOnInit(): void {
    console.log('FROM license: ', this.formNo);

    this.svTrade.recieveLicesne(this.formNo).subscribe((response: any) => {
      this.userLicense = response.body;
      console.log('recived', this.userLicense);
    });
  }
  ngOnDestroy() {
    sessionStorage.removeItem('formNo'); // not necessary to remove
  }
}
