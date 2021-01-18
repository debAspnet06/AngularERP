import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SvProfileService } from '../page-service/profile/sv-profile.service';

@Component({
  selector: 'app-approved-files',
  templateUrl: './approved-files.component.html',
  styleUrls: ['./approved-files.component.scss'],
})
export class ApprovedFilesComponent implements OnInit, OnDestroy {
  responseToShowWithinTable: any[] = [];
  shouldShowForwardTo: boolean = false;
  loggedUser: string = sessionStorage.getItem('username');
  isEventName: string = '';

  constructor(
    private proObj: SvProfileService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('from payment ther user: ', this.loggedUser);
    this.proObj
      .formDetailsActivityByUser(this.loggedUser)
      .subscribe((userResponse: any) => {
        this.responseToShowWithinTable = userResponse.body;
        console.log('from payment: ', this.responseToShowWithinTable);
      });
  }

  onFormNoClick(event: any, formNo: string) {
    console.log('FORM NO from approved files: ', formNo);
    this.isEventName = event.target.textContent;
    sessionStorage.setItem('menu', event.target.textContent); // setting the clicked menu
    this.router.navigate(['members/dash', formNo]);
  }
  onClickGoToPrint(event, formNo) {
    if (event.target.textContent !== 'View') {
      sessionStorage.setItem('formNo', formNo);

      this.router.navigate(['members/print']);
    }
  }
  ngOnDestroy() {
    this.router.navigate(['members/approved']);
  }
}
