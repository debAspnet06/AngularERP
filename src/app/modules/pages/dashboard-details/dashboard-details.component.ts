import { Route } from '@angular/compiler/src/core';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { distinctUntilChanged, first } from 'rxjs/operators';
import { SvProfileService } from '../page-service/profile/sv-profile.service';
declare var $;

@Component({
  selector: 'app-dashboard-details',
  templateUrl: './dashboard-details.component.html',
  styleUrls: ['./dashboard-details.component.scss'],
})
export class DashboardDetailsComponent implements OnInit, OnDestroy {
  followUpForm = new FormGroup({
    nextFollowUp: new FormControl('', [Validators.required]),
    forwardTo: new FormControl('', [Validators.required]),
    showUserType: new FormControl('', [Validators.required]),
    remarks: new FormControl('', [Validators.required]),
    // selectDate: new FormControl('', [Validators.required]),
  });
  routeReloadWithoutRefresh: Subscription;
  formNo: string;
  fileManager: any[] = [];
  fileMangerImages: any[] = [];
  savedfileMangerImages: any[] = [];
  savedfileMangerImages2: any[];
  modalTitle: string;
  modalImage: string;
  shouldHideForwardButton: boolean = true;
  shouldShowLoader: boolean = true;
  isSessionStoragView: boolean =
    sessionStorage.getItem('menu').trim() === 'View';
  isMenuPayment: boolean = sessionStorage.getItem('menu').trim() === 'Payment';
  isVc: boolean = JSON.parse(sessionStorage.getItem('user'))[0].User_ID === 9;
  isMenuFee: boolean = sessionStorage.getItem('menu').trim() == 'Print Fee';

  shouldShowForwardTo: boolean = false;
  shouldShowUserList: boolean = false;
  formdataByFormNo: any[];
  Tl_ID: number;
  userNameViaFormNo: any[];
  clonedUserNameViaFormNo: any[] = [];
  userTypeFromThisFormNo: string;
  formTradeTypeValues: any[] = [];
  formTradeFollowUpValues: any[] = [];
  alternateSide: boolean = false;
  firstContentSide: 'left' | 'right' = 'right';
  saveEcitiZenId: number;
  loggedUserNow = JSON.parse(sessionStorage.getItem('user'));
  shouldHidePayBtn: boolean = true;

  showThisUserNameByFormNo: any[] = [];
  statusToBeSent: number;
  nextUserId: number;
  hideHold: boolean = false;
  nextSaveEcitiZenId: number;
  selectedForwardTo: string = '';
  nextUserNameToBeForwared: string = '';

  constructor(
    private svprofileService: SvProfileService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // const loggedUser = JSON.parse(sessionStorage.getItem('user'));
    // this.followUpForm.patchValue({ nextFollowUp: 'Hold' }); // set default value to this field
    console.log('view: ', this.isSessionStoragView);

    console.log('isMenuPayMENT: ', this.isMenuPayment);
    console.log('selected-citizen: ', this.followUpForm.get('forwardTo').value);
    console.log('selected-user: ', this.followUpForm.get('showUserType').value);

    if (sessionStorage.getItem('menu') && this.isMenuPayment) {
      this.shouldHideForwardButton = true; // hide the forward button
      this.shouldHidePayBtn = true; // button will not be hidden when  not false (true)
    }
    if (
      sessionStorage.getItem('menu') &&
      sessionStorage.getItem('menu').trim() === 'Process'
    ) {
      this.shouldHidePayBtn = !true; // button will be hidden when false (not true)
    }

    if (
      sessionStorage.getItem('menu') &&
      sessionStorage.getItem('menu').trim() === 'View'
    ) {
      this.shouldHideForwardButton = true; // hide the forward button
      this.shouldHidePayBtn = false; //  button will be hidden when false (not true)
    }

    if (
      sessionStorage.getItem('menu') &&
      sessionStorage.getItem('menu').trim() == 'Print Fee'
    ) {
      this.shouldHideForwardButton = true;
      this.shouldHidePayBtn = false; //  button will be hidden when false (not true)
    }

    // subscribe to valuechanges on followupForm's nextFollowUp
    this.followUpForm.controls.nextFollowUp.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((response) => {
        this.selectedForwardTo = response;
        console.log('nextFollowUpSelectedForwardTo: ', response);
        // alert(response.length);
        if (
          response === 'Hold' &&
          (this.followUpForm.controls.forwardTo.value ||
            this.followUpForm.controls.showUserType.value)
        ) {
          console.log('either showUserType or citizen value are existing');
          this.followUpForm.controls.forwardTo.setValue('');
          this.followUpForm.controls.showUserType.setValue('');
        }

        // if (response === 'Hold' && this.loggedUserNow[0]['User_ID'] === 9) {
        //   this.showHold = false;
        //   this.followUpForm.patchValue({ nextFollowUp: 'Forward' });
        // }

        if (response !== 'Forward') {
          this.shouldShowForwardTo = false; // no need to show these field
          this.shouldShowUserList = false; // no need to show these field
          this.nextUserId = JSON.parse(sessionStorage.getItem('user'))[0][
            'User_ID'
          ];
          this.nextSaveEcitiZenId = this.saveEcitiZenId;
        } else {
          // else part, meaning user selected === "Forward"; now check if user type === employee/ciitzen; show forward and userlist
          if (
            this.userTypeFromThisFormNo === 'Cityzen' &&
            this.formdataByFormNo[0]['Appl_By'] === 'Cityzen'
          ) {
            // that means it should be the employee here, so then
            this.shouldShowForwardTo = true;
            this.shouldShowUserList = true;
          } else if (
            this.userTypeFromThisFormNo !== 'Cityzen' &&
            this.formdataByFormNo[0]['Appl_By'] === 'User'
          ) {
            this.shouldShowForwardTo = false;
            this.shouldShowUserList = true;
          } else {
            // that means it should be the 'Cityzen' here, so then
            // now the dropdown would be showing citizen. when selected citizen then shouldShowUSerlist would be false

            this.shouldShowForwardTo = true;
            this.shouldShowUserList = false;
          }
        }
      });

    this.followUpForm.controls.forwardTo.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((value) => {
        // now when value is greater than 0 and textContent == 'Cityzen', hide
        // console.log(
        //   'text',
        //   document
        //     .querySelector(`option[value='${this.saveEcitiZenId}']`)
        //     .textContent.trim() === 'Cityzen'
        // );

        // console.log('savedCitized: ', this.savedfileMangerImages);

        // console.log(
        //   'text-citizen',
        //   document
        //     .querySelector(`option[value='${this.saveEcitiZenId}']`)
        //     .textContent.trim()
        // );
        console.log(
          this.followUpForm.get('showUserType').value === '',
          this.userTypeFromThisFormNo
        );

        if (
          value > 0 &&
          document
            .querySelector(`option[value='${this.saveEcitiZenId}']`)
            .textContent.trim() === 'Cityzen'
        ) {
          this.shouldShowUserList = false;
          this.nextUserId = 0;
          this.statusToBeSent = 12;
          this.nextSaveEcitiZenId = this.saveEcitiZenId;
        }
      });

    this.followUpForm.controls.showUserType.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((nextFollowUpUserUID) => {
        const followUpType = this.followUpForm.controls.nextFollowUp.value;
        console.log('nextFollowUpUserUID', nextFollowUpUserUID);
        console.log('followUpType: ', followUpType);

        if (followUpType === 'Forward') {
          if (nextFollowUpUserUID) {
            this.shouldShowForwardTo = false;
            // whatever the selected option value for showUserType
            this.nextUserId = nextFollowUpUserUID;
            this.nextSaveEcitiZenId = 0;
          }
        }
      });

    // watch always on route params by subcribing on this.route.params to get the value
    this.route.params.subscribe((data: Params) => {
      // use the data to call
      this.formNo = data['formNo'];
      console.log('route-param: ', this.formNo);
    });

    // know the user name and id  by the form no.
    this.svprofileService
      .knowUserNameViaFormNo(this.formNo)
      .subscribe((userResponse: any) => {
        console.log('user: ', userResponse.body);
        this.userNameViaFormNo = userResponse.body;
        this.clonedUserNameViaFormNo = [...this.userNameViaFormNo]; // Backup
      });

    // based on logged in userid, which employee should be next forwarded?
    this.svprofileService
      .nextEmployeetoBeForwared(this.loggedUserNow[0]['User_ID'])
      .subscribe((responseForward: any) => {
        console.log('responseForward.body', responseForward.body);
        this.showThisUserNameByFormNo = responseForward.body;
        console.log('this.showThisUserName', this.showThisUserNameByFormNo);
        this.nextUserNameToBeForwared = this.showThisUserNameByFormNo[0][
          'Name'
        ];
        this.nextUserId = this.showThisUserNameByFormNo[0]['NextFollowUID'];
      });

    // form details by the form no
    this.svprofileService
      .formDetailsByFormNo(this.formNo)
      .subscribe((formResponseByNo: any) => {
        this.formdataByFormNo = formResponseByNo.body;
        this.Tl_ID = this.formdataByFormNo[0]['TL_Form_Id'];
        // whatever type of user the selected form will be, that value woul be here
        this.userTypeFromThisFormNo = this.formdataByFormNo[0][
          'Entry_Type_User'
        ];
        this.saveEcitiZenId = this.formdataByFormNo[0]['E_Cityzen_ID'];
        console.log('citizenId: ', this.saveEcitiZenId);
        console.log('formDataByFormNo: ', this.formdataByFormNo);
        console.log('userTypeHERE: ', this.userTypeFromThisFormNo);
        // alert('is called?');
        this.blockForardButtonOnTable(this.userTypeFromThisFormNo);
        // this.formdataByFormNo[0]['Appl_By']

        // only when formDetailsByFormNo gets the response then formTradeType & formTradeFollowup will get their argument

        // formTradeType required app tl id
        this.svprofileService
          .formTradeType(this.formdataByFormNo[0]['app_TL_ID'])
          .subscribe((responseTradeType: any) => {
            this.formTradeTypeValues = responseTradeType.body;
            console.log('formTradeTypesare: ', this.formTradeTypeValues);
          });

        // but formTradeFollowupdetails requires just tl_form_id
        this.svprofileService
          .formTradeFollupDetails(this.Tl_ID)
          .subscribe((responseFollowup: any) => {
            this.formTradeFollowUpValues = responseFollowup.body;
            console.log('followUp: ', this.formTradeFollowUpValues);
          });
      });

    this.svprofileService.formListDocs().subscribe((responseList: any) => {
      this.fileManager = responseList.body;
      console.log('this.fileManager: ', this.fileManager);
      // ensure that that all files here then based on their name work on the fomrImages api
      this.svprofileService
        .formImagesByFormNo(this.formNo)
        .subscribe((responseImages: any) => {
          this.fileMangerImages = responseImages.body;
          this.savedfileMangerImages = responseImages.body;
          console.log('this.FileManagerImages: ', this.fileMangerImages);
          this.shouldShowLoader = false;
          // saved the response images by form no. within an object
          // const obj = {
          //   Document_Name: '',
          //   file_Url: '',
          //   columnIndex: 0,
          // };
          // this.savedfileMangerImages.push({
          //   ...obj,
          //   Document_Name: 'RENT AGREEMENT',
          // });
          // this.savedfileMangerImages.push({
          //   ...obj,
          //   Document_Name: 'PROPERTY TAX RECIEPT',
          // });
          // this.savedfileMangerImages.push({
          //   ...obj,
          //   Document_Name: 'FIRE LICENSE',
          // });
          // this.savedfileMangerImages.push({
          //   ...obj,
          //   Document_Name: 'PARTNERSHIP DEED',
          // });
          // this.savedfileMangerImages.push({
          //   ...obj,
          //   Document_Name: 'ASSOCIATION OF MEMORUNDUM',
          // });

          // OLD WAY
          // this.fileManager.forEach((file) => {
          //   // whatever responseImages being sent map which has same file['Document_name'] & save it within savedImg
          //   this.fileMangerImages.forEach((image, index) => {
          //     // whatever value returned usually becomes the value of that property
          //     if (image['Document_Name'] === file['Document_name']) {
          //       // whether image['Document_Name'] === file['Document_name'] are same then
          //       if (file.Document_Id === 0) {
          //         // file.Document_Id === 0
          //         this.savedfileMangerImages[0] = {
          //           Document_Name: image['Document_Name'],
          //           file_Url: image['file_Url'],
          //           columnIndex: 0,
          //         };
          //       } else {
          //         // when file.Document_Id !== 0; then save the object with name, url & columnIndex & key would be file.Document_Id - 1
          //         this.savedfileMangerImages[file.Document_Id - 1] = {
          //           Document_Name: image['Document_Name'],
          //           file_Url: image['file_Url'],
          //           columnIndex: file.Document_Id - 1, // ex - 3 - 1 = 2 fasfas fasfs;
          //         };
          //       }
          //     }
          //   });
          // });
        });
    });

    // ngoninit
  }

  onShowImageModal(valueImage: string) {
    // recieve here the iterating item and from that takes keys and values which would be used to show on the modal's img and text element
    //  value exists then when button clicked the modal would show the image by using valueImage
    console.log('link clicked', valueImage); // now just take the key from here for modalTitle and value for modalImage
    this.modalTitle = valueImage['Document_Name']; // valueImage['Document_Name']
    this.modalImage = valueImage['file_Url']; // valueImage['file_Url']
    console.log(this.modalImage, this.modalTitle);
    window.open(this.modalImage);
    /*
    image.document_name === file.document.name
    whatever the matched file.document_name id may be take it and - 1; then use that value as key
    savedFileMangerImages[file.document_id - 1] = {
      name: 'matched image name against the file.document_name',
      file_url : 'now take the image',
      columnIndex: file.document_id - 1; // same as the key
    }
    now when putting the value so to when to show the button or not;
    0 : file_url exist =  yes and is it columnindex value same as the iteration key === true; then only render button
    */

    // 1. Bind/Update value
    // 2. Find modal trigger button by id then trigger click $('selector').click()
    // 3. Modal will popup :)
    // 4. To disable keyboard and escape button, use static and backdrop data props, refer to bootstrap docs.
  }
  goBackButton() {
    this.router.navigate(['members/dash']);
    // if (sessionStorage.getItem('menu')) {
    //   sessionStorage.removeItem('menu');
    // }
  }

  // debugger;
  // what do to when followup button within the modal clicked
  onFollowp() {
    console.log(
      'what is next user id now: ',
      this.nextUserId,
      'statusNow: ',
      this.statusToBeSent
    );

    // now here would need to call insert followup api with required arguments
    const loggedUser = JSON.parse(sessionStorage.getItem('user'));
    const fwStatus = this.followUpForm.get('nextFollowUp').value;
    const remarks = this.followUpForm.get('remarks').value;
    // should be returning true when whatever selected has textcontent == 'Cityzen'

    if (fwStatus === 'Hold') {
      this.nextUserId = this.loggedUserNow[0]['User_ID'];
      this.nextSaveEcitiZenId = 0;
    }

    // console.log('showName: ', this.showThisUserNameByFormNo);
    // console.log('whole Form: ', this.followUpForm.value);
    // console.log('savedCitize: ', this.saveEcitiZenId);
    // console.log(
    //   'showUserValue: ',
    //   this.followUpForm.get('showUserType').value.length
    // );
    // this.followUpForm.controls.forwardTo.v

    if (this.loggedUserNow.length > 0) {
      if (this.loggedUserNow[0]['User_ID'] === 6 && fwStatus === 'Hold') {
        this.statusToBeSent = 7;
      }

      if (
        this.loggedUserNow[0]['User_ID'] === 6 &&
        fwStatus === 'Forward' &&
        this.followUpForm.get('showUserType').value !== ''
      ) {
        this.statusToBeSent = 5;
      }
      if (
        this.loggedUserNow[0]['User_ID'] === 6 &&
        fwStatus === 'Forward' &&
        this.followUpForm.get('showUserType').value === ''
      ) {
        // meaning citizen to citizen here, no user not selected so then status should be 12 else when next employee select then it's 5
        this.statusToBeSent = 12;
      }
      if (this.loggedUserNow[0]['User_ID'] === 8 && fwStatus === 'Hold') {
        this.statusToBeSent = 8;
      }
      if (
        this.loggedUserNow[0]['User_ID'] === 8 &&
        fwStatus === 'Forward' &&
        this.followUpForm.get('showUserType').value !== ''
      ) {
        this.statusToBeSent = 9;
      }
      if (
        this.loggedUserNow[0]['User_ID'] === 8 &&
        fwStatus === 'Forward' &&
        this.followUpForm.get('showUserType').value === ''
      ) {
        this.statusToBeSent = 19;
      }
      if (
        this.loggedUserNow[0]['User_ID'] === 9 &&
        fwStatus === 'Forward' &&
        this.followUpForm.get('showUserType').value !== ''
      ) {
        this.statusToBeSent = 6;
      }
      if (
        this.loggedUserNow[0]['User_ID'] === 9 &&
        fwStatus === 'Forward' &&
        this.followUpForm.get('showUserType').value === ''
      ) {
        this.statusToBeSent = 20;
      }
    }

    // const isTypeForward =
    //   this.followUpForm.controls.nextFollowUp.value === 'Forward';

    // console.log(
    //   'when button is clicked',
    //   document
    //     .querySelector(`option[value='${this.saveEcitiZenId}']`)
    //     .textContent.trim()
    // );

    // if (
    //   isTypeForward &&
    //   document
    //     .querySelector(`option[value='${this.saveEcitiZenId}']`)
    //     .textContent.trim() !== 'Cityzen'
    // ) {
    //   this.nextUserId = this.followUpForm.controls.showUserType.value;
    // } else if (
    //   isTypeForward &&
    //   document
    //     .querySelector(`option[value='${this.saveEcitiZenId}']`)
    //     .textContent.trim() === 'Cityzen'
    // ) {
    //   this.nextUserId = 0;
    // } else {
    //   this.nextUserId = this.loggedUserNow[0].User_ID;
    // }
    console.log('this.statusTobesent: ', this.statusToBeSent);
    console.log('whatisnextuser: ', this.nextUserId);

    this.svprofileService
      .nextForward(
        fwStatus,
        this.Tl_ID,
        loggedUser[0]['User_ID'],
        remarks,
        this.saveEcitiZenId,
        loggedUser[0]['User_Name'],
        this.statusToBeSent,
        this.nextUserId,
        this.nextSaveEcitiZenId
      )
      .subscribe((responseFolloup: any) => {
        console.log('status being sent here is: ', this.statusToBeSent);
        console.log('nextUserid: ', this.nextUserId);
        console.log('citizen: ', this.saveEcitiZenId);
        console.log(responseFolloup.body, responseFolloup.status);
        // if Name === tlc, then status_id === 7 (TLc hold)
        // (tlc forward) == tlc, then status_id === 5 (document approved)
        // (tli hold) === tli1, then status_id === 8 (hold tli1)
        // (tli inspecion done) === tli1, then status_id === 9 (tli forwarded)
        // Name === vc1, then status_id === 9 (approved)
        if (
          $('#theFollowUp').on('shown.bs.modal') &&
          responseFolloup.body.length < 1
        ) {
          this.toastr.success('Followup succssful');
          $('#theFollowUp').modal('hide');
          // this.followUpForm.reset();
          this.followUpForm.controls.nextFollowUp.setValue('');
          this.followUpForm.controls.forwardTo.setValue('');
          this.followUpForm.controls.showUserType.setValue('');
          this.followUpForm.controls.remarks.setValue('');

          setTimeout(() => {
            window.history.back();
            this.toastr.clear();
          }, 1500);
        }
      });
  }
  // what to whe user hide the modal
  onModalHide() {
    console.log('modal hidden & form resetted');
    // this.followUpForm.reset();
    this.followUpForm.controls.nextFollowUp.setValue('');
    this.followUpForm.controls.forwardTo.setValue('');
    this.followUpForm.controls.showUserType.setValue('');
    this.followUpForm.controls.remarks.setValue('');
    // when modal reopens form should be resetted; same with these two properties too
    this.shouldShowForwardTo = false;
    this.shouldShowUserList = false;
  }
  onSelectChange(event) {
    console.log(event.target.value);
  }
  onFollupSubmit() {
    console.log('followup form is clicked');
  }

  verifyNextFollowUp() {
    this.onFollowp();
    // if (this.userTypeFromThisFormNo === 'Cityzen') {
    //   this.svprofileService
    //     .shouldForwardTocitizen(this.Tl_ID, Number(this.nextSaveEcitiZenId))
    //     .subscribe((data) => {
    //       const response = data['body'] as any[];
    //       if (response.length > 0) {
    //         this.toastr.error('Oops!', 'Already forwared.');
    //       } else {
    //         this.onFollowp();
    //       }
    //     });
    // } else {
    //   console.log('this.selectedForwardTo: ', this.selectedForwardTo);
    //   console.log(
    //     'nextFollowUpvalue: ',
    //     this.followUpForm.controls.nextFollowUp.value
    //   );
    //   const loggedUser = this.loggedUserNow[0]['User_ID'];
    //   console.log('userBeingSent: ', loggedUser);
    //   if (this.followUpForm.controls.nextFollowUp.value === 'Hold') {
    //     this.nextUserId = loggedUser;
    //   }
    //   this.svprofileService
    //     .shouldForwardToNextEmployee(this.Tl_ID, Number(this.nextUserId))
    //     .subscribe((data) => {
    //       console.log(`shouldForwardToNextEmployee`, data);
    //       const response = data['body'] as any[];
    //       if (response.length > 0) {
    //         this.toastr.error('Oops!', 'Already forwared.');
    //       } else {
    //         this.onFollowp();
    //       }
    //     });
    // }
  }

  onForwardHoldClick() {
    alert('hold or forward clicked');
  }

  // when user id === 9 and click the forward button on the followup table then hide the hold
  onForwardClick() {
    console.log('table forward is clicked');
    // alert(this.isVc);
    if (this.loggedUserNow[0]['User_ID'] === 9) {
      this.hideHold = true;
      this.shouldShowForwardTo = false;
      this.followUpForm.controls.nextFollowUp.setValue(''); // similar to the reset
      this.followUpForm.controls.showUserType.setValue('');
      this.followUpForm.controls.remarks.setValue('');
      console.log('value: ', this.followUpForm.controls.nextFollowUp.value);
    }
  }

  // debugger;
  blockForardButtonOnTable(user) {
    console.log('logFromBlock', this.loggedUserNow[0]['User_ID']);
    console.log('TL: ', this.Tl_ID);
    console.log(user);
    if (Number(this.loggedUserNow[0]['User_ID']) !== 7 && user === 'Cityzen') {
      // type citizen, user id exist, make the network request, if > 1 then hide
      this.svprofileService
        .shouldForwardTocitizen(
          this.Tl_ID,
          Number(this.loggedUserNow[0]['User_ID'])
        )
        .subscribe((citizenResponse: any) => {
          // alert(JSON.stringify(citizenResponse.body.length));
          // debugger;

          if (citizenResponse.body.length > 0) {
            this.shouldHideForwardButton = false; // show button
          } else {
            this.shouldHideForwardButton = true; // hide button
          }
        });
    }
    if (Number(this.loggedUserNow[0]['User_ID']) !== 7 && user === 'Employee') {
      console.log('logFromBlockUSER', this.loggedUserNow[0]['User_ID']);
      this.svprofileService
        .shouldForwardToNextEmployee(
          this.Tl_ID,
          Number(this.loggedUserNow[0]['User_ID'])
        )
        .subscribe((userResponse: any) => {
          // alert(JSON.stringify(userResponse.body.length) + ' user');
          // userResponse.body.push(2);
          // debugger;
          if (userResponse.body.length > 0) {
            this.shouldHideForwardButton = false;
          } else {
            this.shouldHideForwardButton = true;
          }
        });
    }
  }

  ngOnDestroy() {
    if ($('#theFollowUp').on('shown.bs.modal')) {
      console.log('hide the back button or leaving');
      $('#theFollowUp').modal('hide');
    }
    if (this.routeReloadWithoutRefresh) {
      this.routeReloadWithoutRefresh.unsubscribe();
    }
    // sessionStorage.removeItem('menu');
  }
}
