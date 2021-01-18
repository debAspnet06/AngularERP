import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SvProfileService } from '../page-service/profile/sv-profile.service';

@Component({
  selector: 'app-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.scss'],
})
export class MakePaymentComponent implements OnInit {
  responseToShowWithinTable: any[] = [];
  shouldShowForwardTo: boolean = false;
  loggedUser: string = sessionStorage.getItem('username');

  constructor(
    private proObj: SvProfileService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('from payment ther user: ', this.loggedUser);

    this.proObj
      .formDetailsPaymentPendingByUser(this.loggedUser)
      .subscribe((userResponse: any) => {
        this.responseToShowWithinTable = userResponse.body;
        console.log('from payment: ', this.responseToShowWithinTable);
      });
  }
  onFormNoClick(event: any, formNo: string) {
    console.log('FORM NO from payment: ', formNo);
    sessionStorage.setItem('menu', event.target.textContent);
    const isPayment = sessionStorage.getItem('menu').trim() == 'Payment';
    console.log(isPayment, 'here');

    if (isPayment) {
      this.router.navigate(['members/dash', formNo]);
    }

    // sessionStorage.setItem('menu', event.target.textContent);
    // if (event.target.textContent !== 'Followup') {
    //   this.router.navigate(['members/dash', formNo]);
    // } else if (event.target.textContent === 'Followup') {
    //   this.proObj.formDetailsByFormNo(formNo).subscribe((formResponse: any) => {
    //     this.userTypeFromThisFormNo = formResponse.body[0]['Entry_Type_User'];
    //     this.proObj
    //       .formTradeFollupDetails(formResponse.body[0]['app_TL_ID'])
    //       .subscribe((responseFollowup: any) => {
    //         this.formTradeFollowUpValues = responseFollowup.body;
    //         console.log('followUp-dashboard: ', this.formTradeFollowUpValues);
    //       });
    //     this.proObj
    //       .knowUserNameViaFormNo(formNo)
    //       .subscribe((userResponse: any) => {
    //         console.log('user: ', userResponse.body);
    //         this.userNameViaFormNo = userResponse.body;
    //       });
    //   });
    //   //when modal hidden; remove menu from sessionStorage
    //   $('#theFollowUp').on('hidden.bs.modal', () => {
    //     sessionStorage.removeItem('menu');
    //   });
    //   // followup
    // }
  }
}
