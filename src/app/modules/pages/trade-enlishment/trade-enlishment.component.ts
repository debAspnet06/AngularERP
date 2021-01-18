import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable, of, Subscriber } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {
  NgWizardConfig,
  NgWizardService,
  StepChangedArgs,
  StepValidationArgs,
  STEP_STATE,
  THEME,
} from 'ng-wizard';
import { SvProfileService } from '../page-service/profile/sv-profile.service';
import { SvTradeRegistrationService } from '../page-service/trade-reg/sv-trade-registration.service';
import { Router } from '@angular/router';
import { Iuser } from '../../auth/models/iuser';
import {
  FormGroup,
  FormControl,
  Validators,
  AsyncValidatorFn,
  AbstractControl,
  ValidationErrors,
  FormArray,
} from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import {
  faCoffee,
  faEnvelope,
  faUser,
  faLock,
  faMobile,
  faPen,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CharecterSpace } from 'src/app/common/validators/space/charecter-space';
import * as _ from 'lodash';
import { GridButtonDelComponent } from '../common-grid-functionality/grid-button-del/grid-button-del.component';
import { NumberValidators } from 'src/app/common/validators/onlyDecimal/number-validators';
import { ITLapp } from '../models/i-tlapp';
import { ITLappform } from '../models/i-tlappform';
import { ITLapptradetype } from '../models/i-tlapptradetype';
import { ITLappowner } from '../models/i-tlappowner';
import { ITLappfollowup } from '../models/i-tlappfollowup';
import { ITLappdocs } from '../models/i-tlappdocs';
import { PvtDelButtonComponent } from '../common-grid-functionality/pvt-del-button/pvt-del-button.component';
import { ITLapppayment } from '../models/i-tlapppayment';
import { IsRegnExist } from 'src/app/common/validators/is-regn-exist';
import { ChangeDetectionStrategy } from '@angular/compiler/src/compiler_facade_interface';
declare var $;

@Component({
  selector: 'app-trade-enlishment',
  templateUrl: './trade-enlishment.component.html',
  styleUrls: ['./trade-enlishment.component.scss'],
})
export class TradeEnlishmentComponent implements OnInit {
  paymentForm = new FormGroup({
    isPaid: new FormControl(50, Validators.required),
  });

  //public def: any;
  //public userObj: Iuser[];
  //public userProfileObj: Iuser;
  // public userProfileObjSummary: Iuser;

  // this.colDefgridPvtLtd = [
  //   { headerName: 'Name of the Director', field: 'dirName', width: 100 },
  //   { headerName: 'Father/Husband Name', field: 'fHName', width: 100 },
  //   { headerName: 'Address', field: 'address', width: 500 },
  //   { headerName: 'ID Proof', field: 'idProof', width: 100 },
  //   { headerName: 'ID Proof No', field: 'idProofNo', width: 100 },
  //   { headerName: 'Action', field: 'idProofNo', width: 100, cellRendererFramework: GridButtonDelComponent }
  // ];

  public objTradeTypeCart: Array<any> = [{ tradeType: '', tradeNature: '' }];
  public isDisabled: boolean = false;
  saveBase64ImageWithId = {};
  encodeImageObject = {};
  userSelectedNew: string;
  stepIndex: number;
  recivedFormResonseForTL: any[] = [];
  selectedBusinessType: {};
  selectedBusinessResponse: any[] = [];
  fileListNames: any[] = [];
  public objPvtCart: Array<any> = [
    {
      dirName: '',
      fHName: '',
      address: '',
      idProof: '',
      idProofNo: '',
      ContactNo: '',
    },
  ];
  public objPartnerCart: Array<any> = [
    {
      parName: '',
      fHName: '',
      address: '',
      idProof: '',
      idProofNo: '',
      ContactNo: '',
    },
  ];

  public objTLApp: ITLapp;
  public objTLAppForm: ITLappform;
  public objTLAppPayment: ITLapppayment;
  public objTLAppTradeType: ITLapptradetype[];
  public objTLAppOwner: ITLappowner[];
  public objTLAppFollowup: ITLappfollowup;
  public objTLAppDocs: ITLappdocs[];
  min: Date;

  uploadedDocs = [];

  public tlDocsUpload = [];
  public docsReview = [];

  taxName;
  WardNoCouncilorName: any = [];
  selectedWardId: number;
  TypeRelationWithLand: any = [];
  tradeNatureList: any = [];
  For_Finalcial_year: any = [];
  Trade_Type: any = [];
  IDProofName: any = [];
  //Auto Complete
  tradeTypeList: Array<{ Trade_Type: string }>;
  nameField: any;
  value: string;
  priceField: any;
  valueText: Number;
  //Auto Complete

  gridTradenatureApi;
  gridTradenatureColumn;
  gridTradenatureOptions: any;
  colDefgridTradenature = [];

  gridPvtLtdApi;
  gridPvtLtdColumn;
  gridPvtLtdOptions: any;
  colDefgridPvtLtd = [];
  isShowgridPvtLtd;

  // gridPartnerApi;
  // gridPartnerColumn;
  // gridPartnerOptions: any;
  // colDefgridPartner = [];
  // isShowgridPartner;
  //emailGlobal:string= sessionStorage.getItem('username');

  public isMultiple: boolean;
  PropertyOwnerDetail;
  Trade_Details1;
  Trade_Details_Sole;
  Trade_Details_Private_Ltd;
  Trade_Details_Partnership;
  BussinessCommunication;
  Uploading_documents;
  Review_and_Submit;
  tlTaxes = [];
  docTypes = [];
  submitted;
  maxAllowedDirectorEntries = 0;
  shouldDisableAddToCardPvtBtn = false;
  shouldAttachmentViewerModalOpen: boolean;
  recieveFromTradeReg: any[];
  selectedOneorTwoTypeofBusiness: any;
  shouldShowRegnField: boolean = false;
  renewResponseByRegNo: any[] = [];
  renewResponseWithTradeValues: any[] = [];
  renewResponseForOwners;
  GLOBAL_TL_ID: any;

  //Bussiness Communication
  get Father_Husband_Name() {
    return this.BussinessCommunication.get('Father_Husband_Name');
  }
  get Address() {
    return this.BussinessCommunication.get('Address');
  }
  get ContactNo() {
    return this.BussinessCommunication.get('ContactNo');
  }
  get ID_ProofName() {
    return this.BussinessCommunication.get('ID_ProofName');
  }
  get ID_Proof_No() {
    return this.BussinessCommunication.get('ID_Proof_No');
  }

  get Assessee_Holding_No() {
    return this.PropertyOwnerDetail.get('Assessee_Holding_No');
  }
  get Owner_Name() {
    return this.PropertyOwnerDetail.get('Owner_Name');
  }
  // get Building_House_Name() {
  //   return this.PropertyOwnerDetail.get('Building_House_Name');
  // }
  get Street_Road_Name() {
    return this.PropertyOwnerDetail.get('Street_Road_Name');
  }
  get Locality_Name() {
    return this.PropertyOwnerDetail.get('Locality_Name');
  }
  get WardNo_CouncilorName() {
    return this.PropertyOwnerDetail.get('WardNo_CouncilorName');
  }
  // get Type_Of_Tax() {
  //   return this.PropertyOwnerDetail.get('Type_Of_Tax');
  // }

  get AmountPaid_PropertyTax() {
    return this.PropertyOwnerDetail.get('AmountPaid_PropertyTax');
  }
  get TypeOf_Relation_With_Land() {
    return this.PropertyOwnerDetail.get('TypeOf_Relation_With_Land');
  }
  get Property_Owner_Address() {
    return this.PropertyOwnerDetail.get('Property_Owner_Address');
  }

  // trade details

  get Type_Of_Business_Structure() {
    return this.Trade_Details1.get('Type_Of_Business_Structure');
  }
  get For_the_Finalcial_year() {
    return this.Trade_Details1.get('For_the_Finalcial_year');
  }
  get Name_Firm_Company() {
    return this.Trade_Details1.get('Name_Firm_Company');
  }
  get Date_of_Commenencement() {
    return this.Trade_Details1.get('Date_of_Commenencement');
  }
  get Nature_of_Trade() {
    return this.Trade_Details1.get('Nature_of_Trade');
  }
  get Cpmpany_GSTIN() {
    return this.Trade_Details1.get('Cpmpany_GSTIN');
  }
  get TradeType() {
    return this.Trade_Details1.get('TradeType');
  }
  get Company_PAN_Card_Number() {
    return this.Trade_Details1.get('Company_PAN_Card_Number');
  }
  get Investment_Of_Capital() {
    return this.Trade_Details1.get('Investment_Of_Capital');
  }
  get Contact_Number() {
    return this.Trade_Details1.get('Contact_Number');
  }
  get Contact_Address() {
    return this.Trade_Details1.get('Contact_Address');
  }
  get Workshop_Address() {
    return this.Trade_Details1.get('Workshop_Address');
  }
  get Godown_Address() {
    return this.Trade_Details1.get('Godown_Address');
  }

  get Name_of_the_Propritor_Sole() {
    return this.Trade_Details_Sole.get('Name_of_the_Propritor_Sole');
  }

  get TotalDirector_Partnership() {
    return this.Trade_Details_Private_Ltd.get('TotalDirector_Partnership');
  }
  get DirectorName_Partnership() {
    return this.Trade_Details_Private_Ltd.get('DirectorName_Partnership');
  }

  get TotalPartners_PvtLtd() {
    return this.Trade_Details_Partnership.get('TotalPartners_PvtLtd');
  }
  get Name_Partner_PvtLtd() {
    return this.Trade_Details_Partnership.get('Name_Partner_PvtLtd');
  }
  findIndexItem(newItem) {
    return newItem.tradeNature === this;
  }
  ondelFromCart(cart: any) {
    console.log('cart event from as output from another component: ', cart);
    //dynamically get the Keys of Object
    var keys = [];
    for (var key in cart) {
      keys.push(key);
    }

    //let updateItem = this.objTradeTypeCart.find(this.findIndexItem, cart[keys[0]]);

    let index = this.findArrayIndex(this.objTradeTypeCart, cart, 2);

    //let index = this.objTradeTypeCart.indexOf(updateItem);
    this.objTradeTypeCart.splice(index, 1);
    this.toastr.info(`Data deleted successfully`);
    this.updateCartGrid();
  }

  updateCartGrid() {
    this.gridTradenatureApi.setRowData([]);
    var newData = this.objTradeTypeCart;
    this.gridTradenatureApi.updateRowData({ add: newData });
  }

  addToCart() {
    // console.log(this.Nature_of_Trade, this.nameField, this.tradeTypeList);
    //check the tradelist to verify the trade
    //isCheckTrade()

    // rather than find method now see whether this.nature.of.trade included with tradeTypelist or not
    const isNatureOrTradeExist = this.tradeTypeList.find(
      // (item) => item.Trade_Type === this.Nature_of_Trade.value
      (item) => item.Trade_Type.includes(this.Nature_of_Trade.value)
    );
    console.log('isNatureofTradeExist', isNatureOrTradeExist);

    if (!isNatureOrTradeExist) {
      this.toastr.error('Trade type is not found');
      return;
    }

    // if (
    //   this.Trade_Details1.value.TradeType !== "ACTING & PRODUCTION TRANING" ||
    //   this.Trade_Details1.value.TradeType !== "ACTING INSTITUTE"
    // ) {
    //   this.toastr.error("Trade type is not valid");
    //   return;
    // }

    if (this.Trade_Details1.value.TradeType == '') {
      this.toastr.error('Trade type can not be empty');
      return;
    }

    if (this.Trade_Details1.value.Nature_of_Trade == '') {
      this.toastr.error('Nature of Trade can not be empty');
      return;
    }

    var selectedOptionText = $('#TradeType').find(':selected').text();

    //check for duplicate entry
    if (this.objTradeTypeCart.length > 0) {
      //this is the item we need to check in the array
      var findItem = {
        tradeType: selectedOptionText,
        tradeNature: this.Trade_Details1.value.Nature_of_Trade,
      };
      //Checking function
      if (this.isExists(this.objTradeTypeCart, findItem, 2)) {
        this.toastr.warning(`Collection already contain this data`);
        return;
      }

      //   var resultArr = this.find_duplicate_in_array(this.objTradeTypeCart);
      //   if (resultArr.length == 0) {
      //     this.objTradeTypeCart.push({
      //       tradeType: selectedOptionText
      //       , tradeNature: this.Trade_Details1.value.Nature_of_Trade
      //     });
      //   }
      //   else {

      //     this.toastr.warning(`Collection already contain this data`);
      //     return;
      //   }

      // } else {
    }

    this.objTradeTypeCart.push({
      tradeType: selectedOptionText,
      tradeNature: this.Trade_Details1.value.Nature_of_Trade,
    });

    //this.toastr.success(`Data added succesfully`);

    this.gridTradenatureApi.setRowData([]);
    this.gridTradenatureApi.updateRowData({ add: this.objTradeTypeCart });

    this.Trade_Details1.controls.TradeType.patchValue('');
    this.Trade_Details1.controls.Nature_of_Trade.patchValue('');
  }

  // logic for when user click on 'add' button after selecting pvt ltd from dropdown except sole/ngo (html 764)
  addToCartPvtLtd() {
    let BusiStrucure = _.pick(this.Trade_Details1.value, [
      'Type_Of_Business_Structure',
    ]);
    console.log('selected businessId: ', BusiStrucure); // this is selected Type of business right now
    // isPanExist = objPvt.find(item => item === "FFFFF2222F" ? item : null); // just return that exact value

    if (
      String(BusiStrucure.Type_Of_Business_Structure) === '3' ||
      String(BusiStrucure.Type_Of_Business_Structure) === '6'
    ) {
      if (
        this.Trade_Details_Partnership.value.TotalPartners_PvtLtd.toString().trim()
          .length > 0 &&
        !isNaN(this.Trade_Details_Partnership.value.TotalPartners_PvtLtd)
      ) {
        //check for duplicate entry
        if (this.objPvtCart.length > 0) {
          let findItem = {
            dirName: this.Trade_Details_Partnership.value.Name_Partner_PvtLtd,
            fHName: this.BussinessCommunication.value.Father_Husband_Name,
            address: this.BussinessCommunication.value.Address,
            idProof: this.BussinessCommunication.value.ID_ProofName,
            idProofNo: this.BussinessCommunication.value.ID_Proof_No,
            ContactNo: this.BussinessCommunication.value.ContactNo,
          };

          //Checking function :: findItem is specifially just made for isExistPan method;
          if (this.isExistsPANCon(this.objPvtCart, findItem)) {
            this.toastr.warning(`Pan card already exists`);
            return;
          }
        }
        // here objPvtcart pushed data from two different formGroups but ensure that it has all the data needed for the table

        if (
          this.Trade_Details_Partnership.value.Name_Partner_PvtLtd &&
          this.BussinessCommunication.valid
        ) {
          // console.log(
          //   "show here the name: ",
          //   this.Trade_Details_Partnership.value.Name_Partner_PvtLtd
          // );

          this.objPvtCart.push({
            dirName: this.Trade_Details_Partnership.value.Name_Partner_PvtLtd,
            fHName: this.BussinessCommunication.value.Father_Husband_Name,
            address: this.BussinessCommunication.value.Address,
            idProof: this.BussinessCommunication.value.ID_ProofName,
            idProofNo: this.BussinessCommunication.value.ID_Proof_No,
            ContactNo: this.BussinessCommunication.value.ContactNo,
          });
        }

        console.log('obj pvt cart data', this.objPvtCart); // [{}]
      }
    } else if (
      String(BusiStrucure.Type_Of_Business_Structure) === '4' ||
      String(BusiStrucure.Type_Of_Business_Structure) === '5'
    ) {
      if (
        this.Trade_Details_Private_Ltd.value.TotalDirector_Partnership.toString().trim()
          .length > 0 &&
        !isNaN(this.Trade_Details_Private_Ltd.value.TotalDirector_Partnership)
      ) {
        // TotalDirector_Partnership length greater than 0 & TotalDirector_Partnership's value is not become NaN after using isNaN() then
        // check for duplicate entry
        if (this.objPvtCart.length > 0) {
          //this is the item we need to check in the array
          var findItem = {
            dirName: this.Trade_Details_Private_Ltd.value
              .DirectorName_Partnership,
            fHName: this.BussinessCommunication.value.Father_Husband_Name,
            address: this.BussinessCommunication.value.Address,
            idProof: this.BussinessCommunication.value.ID_ProofName,
            idProofNo: this.BussinessCommunication.value.ID_Proof_No,
            ContactNo: this.BussinessCommunication.value.ContactNo,
          };
          console.log('here obj: ', this.objPvtCart);
          // console.log("here find: ", findItem);

          //Checking function
          if (this.isExistsPANCon(this.objPvtCart, findItem)) {
            this.toastr.warning(`Pan card already exists`);

            return;
          }
        }

        if (
          this.Trade_Details_Private_Ltd.value.DirectorName_Partnership &&
          this.BussinessCommunication.valid
        ) {
          this.objPvtCart.push({
            dirName: this.Trade_Details_Private_Ltd.value
              .DirectorName_Partnership,
            fHName: this.BussinessCommunication.value.Father_Husband_Name,
            address: this.BussinessCommunication.value.Address,
            idProof: this.BussinessCommunication.value.ID_ProofName,
            idProofNo: this.BussinessCommunication.value.ID_Proof_No,
            ContactNo: this.BussinessCommunication.value.ContactNo,
          });
        }
      }
    }
    // }
    // else if

    //this.toastr.success(`Data added succesfully`);
    this.gridPvtLtdApi.setRowData([]);
    this.gridPvtLtdApi.updateRowData({ add: this.objPvtCart });
    console.log(
      'this.maxAllowedDirectorEntries',
      this.maxAllowedDirectorEntries
    );

    if (this.objPvtCart.length > 0) {
      this.shouldDisableAddToCardPvtBtn =
        this.objPvtCart.length >= this.maxAllowedDirectorEntries ? true : false;

      this.isShowgridPvtLtd = true;
      // Trade_Details_Partnership
      if (this.BussinessCommunication.valid) {
        this.Trade_Details_Partnership.get('Name_Partner_PvtLtd').reset();
        this.Trade_Details_Private_Ltd.get('DirectorName_Partnership').reset();

        this.BussinessCommunication.reset();
      }
      this.BussinessCommunication.controls.ID_ProofName.setValue('Pan Card');
    } else {
      this.isShowgridPvtLtd = false;
    }
    console.log('objPvtcart now has the data: ', this.objPvtCart); // objPvtcart now here every values
    this.selectedBusinessResponse = this.objPvtCart;
    console.log(
      'objPvtcart global stored data: ',
      this.selectedBusinessResponse
    );
    // }
    // addtocartPVtLtd ends below
  }

  //bind the radio button of TAX
  getTaxes() {
    return [
      { id: 1, name: 'Property Tax' },
      { id: 2, name: 'Occupier Tax' },
    ];
  }

  stepStates = {
    normal: STEP_STATE.normal,
    disabled: STEP_STATE.disabled,
    error: STEP_STATE.error,
    hidden: STEP_STATE.hidden,
  };

  config: NgWizardConfig = {
    selected: 0,
    theme: THEME.circles,
    toolbarSettings: {
      toolbarExtraButtons: [
        {
          text: 'Finish',
          class: 'btn btn-info',
          event: () => {
            if (this.stepIndex === 3) this.tradeLicenseSubmit();
            // this.toastr.warning('Must compete each step before finish');
          },
        },
      ],
    },
  };

  fileMapWithNameAndID: Record<string, any> = {};

  constructor(
    private ngWizardService: NgWizardService,
    public router: Router,
    private toastr: ToastrService,
    public proObj: SvProfileService,
    public proObj1: SvTradeRegistrationService,
    private isRegnExist: IsRegnExist,
    private cdRef: ChangeDetectorRef
  ) {
    this.isMultiple = false;
    this.gridTradenatureOptions = { context: { componentParent: this } };
    this.gridPvtLtdOptions = { context: { componentParent: this } };
    this.nameField = { text: 'Trade_Type' };
  }

  isExists(myArray, findItem, noofKey): boolean {
    var cnn = 0;
    var sts;

    for (let index = 0; index < myArray.length; index++) {
      var arrItem = myArray[index];

      for (var key in arrItem) {
        console.log('key ' + key + ' has value ' + arrItem[key]);
        if (arrItem[key] === findItem[key]) {
          cnn++;
        } else {
          break;
        }
      }

      if (cnn === noofKey) {
        sts = true;
        break;
      } else {
        sts = false;
      }
    }
    return sts;
  }

  isExistsPANCon(myArray, findItem) {
    let sts = false;

    for (let index = 0; index < myArray.length; index++) {
      var arrItem = myArray[index];
      if (arrItem['idProofNo'] == findItem['idProofNo']) {
        return true;
      }
    }
    return sts;
  }

  findArrayIndex(myArray, findItem, noofKey): number {
    var ind = -1;
    var cnn = 0;

    for (let index = 0; index < myArray.length; index++) {
      var arrItem = myArray[index];

      for (var key in arrItem) {
        //console.log("key " + key + " has value " + arrItem[key]);
        if (arrItem[key] === findItem[key]) {
          cnn++;
        } else {
          break;
        }
      }

      if (cnn === noofKey) {
        ind = index;
        break;
      } else {
        ind = -1;
      }
    }

    return ind;
  }

  find_duplicate_in_array(arra1) {
    var object = {};
    var result = [];

    arra1.forEach((item) => {
      if (!object[item]) object[item] = 0;
      object[item] += 1;
    });

    for (var prop in object) {
      if (object[prop] >= 2) {
        result.push(prop);
      }
    }

    return result;
  }

  ongridTradenatureReady(params) {
    this.gridTradenatureApi = params.api;
    this.gridTradenatureColumn = params.columnApi;
    this.load_gridTradenature(params);
  }

  ongridPvtLtdReady(params) {
    this.gridPvtLtdApi = params.api;
    this.gridPvtLtdColumn = params.columnApi;
    this.load_gridPvtLtd(params);
  }

  // ongridPartnerReady(params) {

  //   this.gridPartnerApi = params.api;
  //   this.gridPartnerColumn = params.columnApi;
  //   this.load_gridPartner(params);
  // }

  load_gridTradenature(params) {
    params.api.setRowData(this.objTradeTypeCart);
  }

  load_gridPvtLtd(params) {
    params.api.setRowData(this.objPvtCart);
  }

  // load_gridPartner(params) {
  //   params.api.setRowData(this.objPartnerCart);
  // }

  ngOnInit(): void {
    this.min = new Date('11/11/2012');

    this.loadFormDesign();

    let uu = sessionStorage.getItem('username');
    this.isProfileComplete(uu);

    this.bindWard();
    this.getRelation_LandBind();
    this.getFinalcial_yearBind();
    this.bindTradeNature();
    this.bindTradeType();

    // public objTradeTypeCart: Array<any> = [{ tradeType: '', tradeNature: '' }];

    this.colDefgridTradenature = [
      { headerName: 'Trade Size', field: 'tradeType', width: 100 },
      { headerName: 'Trade Nature', field: 'tradeNature', width: 500 },
      {
        headerName: 'Action',
        field: 'tradeNature',
        width: 100,
        cellRendererFramework: GridButtonDelComponent,
      },
    ];

    this.colDefgridPvtLtd = [
      { headerName: 'Name', field: 'dirName', width: 200 },
      { headerName: 'Contact No', field: 'ContactNo', width: 200 },
      { headerName: 'Father/Husband Name', field: 'fHName', width: 200 },
      { headerName: 'Address', field: 'address', width: 500 },
      { headerName: 'ID Proof', field: 'idProof', width: 100 },
      { headerName: 'ID Proof No', field: 'idProofNo', width: 100 },
      {
        headerName: 'Action',
        field: 'Delete',
        width: 100,
        cellRendererFramework: PvtDelButtonComponent,
      },
    ];

    // this.colDefgridPartner = [
    //   { headerName: 'Name of the Partners', field: 'parName', width: 100 },
    //   { headerName: 'Father/Husband Name', field: 'fHName', width: 100 },
    //   { headerName: 'Address', field: 'address', width: 500 },
    //   { headerName: 'ID Proof', field: 'idProof', width: 100 },
    //   { headerName: 'ID Proof No', field: 'idProofNo', width: 100 },
    //   { headerName: 'Action', field: 'idProofNo', width: 100, cellRendererFramework: GridButtonDelComponent }
    // ];

    this.objTradeTypeCart = [];
    this.objPartnerCart = [];
    this.objPvtCart = []; // local property

    this.isShowgridPvtLtd = false;

    // validatation for Trade_Details_Partnership
    this.Trade_Details_Partnership.controls.TotalPartners_PvtLtd.valueChanges
      // .pipe(distinctUntilChanged())
      .subscribe((totalPartner) => {
        console.log('totalpartner: ', totalPartner);
        // If user enters non-numeric chars then assign 0 else convert the string to number then assign.
        // whatever user given as the value on TotalPartners_PvtLtd if that after converting becomes NaN/isNaN() : true; then maxAllowed's value will be 0
        // else user given any value that's not NaN; that means isNaN() false; then convert it to Number() & that value'll be assigned to maxAllowed property
        // but if user given 0 as value then isNaN(0) would be false so then neeed to check if maxAllowed's value === 0; then shouldDisabledBtn'll be false
        this.maxAllowedDirectorEntries = isNaN(Number(totalPartner))
          ? 0
          : Number(parseInt(totalPartner));
        if (this.objPvtCart.length < this.maxAllowedDirectorEntries) {
          this.shouldDisableAddToCardPvtBtn = false;
        }
        if (this.objPvtCart.length === this.maxAllowedDirectorEntries) {
          // when user give totalpartner becomes maxAllowedDirectorEntries === objPvt.lenth then
          // as it has been already added that's why objPvtCart.length === maxAllowedDirectorEntries so disable the button
          this.shouldDisableAddToCardPvtBtn = true;
        }
        if (this.maxAllowedDirectorEntries === 0) {
          this.shouldDisableAddToCardPvtBtn = true;
          this.gridPvtLtdApi.setRowData([]); // Clears whole table
          this.objPartnerCart = [];
        }
      });

    // validation for pvt ltd
    this.Trade_Details_Private_Ltd.controls.TotalDirector_Partnership.valueChanges
      // .pipe(distinctUntilChanged())
      .subscribe((totalPartner) => {
        console.log('totalparrtner: ', totalPartner);

        // If user enters non-numeric chars then assign 0 else convert the string to number then assign.
        // whatever user given as the value on TotalPartners_PvtLtd if that after converting becomes NaN/isNaN() : true; then maxAllowed's value will be 0
        // else user given any value that's not NaN; that means isNaN() false; then convert it to Number() & that value'll be assigned to maxAllowed property
        // but if user given 0 as value then isNaN(0) would be false; so then neeed to check if maxAllowed's value === 0; then shouldDisabledBtn'll be false
        this.maxAllowedDirectorEntries = isNaN(Number(totalPartner))
          ? 0
          : Number(parseInt(totalPartner));
        if (this.objPvtCart.length < this.maxAllowedDirectorEntries) {
          this.shouldDisableAddToCardPvtBtn = false;
        }
        if (this.objPvtCart.length === this.maxAllowedDirectorEntries) {
          // when user give totaldirector which is saved within maxAllowedDirectorEntries === objPvt.lenth
          // meaning objPvtCart.length > 0 and it has the same value then disable the button
          this.shouldDisableAddToCardPvtBtn = true;
        }
        if (this.maxAllowedDirectorEntries === 0) {
          this.shouldDisableAddToCardPvtBtn = true;
          this.gridPvtLtdApi.setRowData([]); // Clears whole table
          this.objPartnerCart = [];
        }
      });

    // whenever value changes on Type of Business; reset the trade_details_pvt_ltd/trade_details_parternship name

    // validation for Type_Of_Business_Structure
    this.Trade_Details1.controls.Type_Of_Business_Structure.valueChanges.subscribe(
      (selectedResponse) => {
        console.log('selectedResponse: ', selectedResponse);

        // console.log('selectedBusinessResponse: ', this.objPvtCart);
        console.log('business: ', this.BussinessCommunication.value);
        const { ID_ProofName, ...rest } = this.BussinessCommunication;
        // if selectedBusinessResponse.length > 0 (meaing data already exist within the table as selecting)  then reset
        // selectedResponse !1/2 and length > 0 || selectedResponse !1/2 && Object.values(rest).some(item => item !== null)
        if (
          (selectedResponse && this.objPvtCart.length > 0) ||
          (selectedResponse && Object.values(rest).some((item) => item !== ''))
        ) {
          // reset the form; hide the grid table too
          this.objPvtCart = [];
          this.gridPvtLtdApi.setRowData([]); // Clears whole table
          this.Trade_Details_Sole.get('Name_of_the_Propritor_Sole').reset();
          this.Trade_Details_Partnership.get('Name_Partner_PvtLtd').reset(); // TotalPartners_PvtLtd
          this.Trade_Details_Partnership.get('TotalPartners_PvtLtd').reset();
          this.Trade_Details_Private_Ltd.get(
            'TotalDirector_Partnership'
          ).reset();
          this.Trade_Details_Private_Ltd.get(
            'DirectorName_Partnership'
          ).reset();
          this.BussinessCommunication.reset();
          this.BussinessCommunication.controls.ID_ProofName.setValue(
            'Pan Card'
          );
          this.isShowgridPvtLtd = false; // then the grid should not show; so set to false here
        }
      }
    );
    // validation for GST
    this.Trade_Details1.controls.Cpmpany_GSTIN.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((userGST) => {
        const companyPan = this.Trade_Details1.controls.Company_PAN_Card_Number;
        const gstFormControl = this.Trade_Details1.controls.Cpmpany_GSTIN;
        let gstValue = gstFormControl.value;
        // if (gstValue.length < 15) {
        //   gstValue = gstValue.padStart(15, 0);
        // }
        if (gstValue.length === 14 && Number(gstValue[0]) === NaN) {
          this.Trade_Details1.controls.Cpmpany_GSTIN.setErrors({
            ...companyPan.errors,
            // GSTNotMatchWithPan: true,
          });
          return;
        }

        if (
          gstValue.length === 15 &&
          Number(gstValue[0]) == NaN &&
          Number(gstValue[1]) == NaN
        ) {
          this.Trade_Details1.controls.Cpmpany_GSTIN.setErrors({
            ...companyPan.errors,
            // GSTNotMatchWithPan: true,
          });
          return;
        }
        console.log('gstValue: ', gstValue);
        console.log('companypan: ', companyPan);
        const sliceIdx = gstValue.length == 14 ? 1 : 2;

        if (
          companyPan.valid &&
          gstValue.slice(sliceIdx, -3) !== companyPan.value
        ) {
          this.Trade_Details1.controls.Cpmpany_GSTIN.setErrors({
            ...gstFormControl.errors,
            // GSTNotMatchWithPan: true,
          });
          console.log('userGST: ', userGST);
        }
      });

    // validation for the whole businsess communication when espeically selected self/ngo
    this.BussinessCommunication.valueChanges.subscribe(
      (responseBusiness: any) => {
        if (
          this.BussinessCommunication.valid &&
          this.objPvtCart.length < 1 &&
          this.Trade_Details_Sole.controls.Name_of_the_Propritor_Sole.length !==
            0
        ) {
          // then this should be Ngo/self
          this.selectedOneorTwoTypeofBusiness = responseBusiness;
          this.selectedBusinessResponse = {
            ...this.selectedOneorTwoTypeofBusiness,
            Name: this.Trade_Details_Sole.controls.Name_of_the_Propritor_Sole
              .value,
          };
          console.log('self: ', this.selectedOneorTwoTypeofBusiness);
        }
      }
    );

    // validation for businsess communication formgroup's pan formcontrol
    this.BussinessCommunication.controls.ID_Proof_No.valueChanges.subscribe(
      (businessId) => {
        const panValue = this.Trade_Details1.controls.Company_PAN_Card_Number;
        const panFormcontrol = this.BussinessCommunication.controls.ID_Proof_No;
        // objPvtCart = []; length < 1; then given pan card should match panValue = worked
        // objPvtCart = []; length >= 1 then ensure one of the pan card within array is sameas panValue
        // if (this.objPvtCart.length < 1 && businessId !== panValue.value) {
        //   // then setError
        //   panFormcontrol.setErrors({
        //     ...panFormcontrol.errors,
        //     shouldBeSamePan: true,
        //   });
        // } else
        if (
          this.objPvtCart.length >= 1 &&
          this.objPvtCart.some(({ idProofNo }) => businessId === idProofNo)
        ) {
          // whatever value given for pan if it is already exists within the table then it will show this error
          panFormcontrol.setErrors({
            ...panFormcontrol.errors,
            duplicatePanId: true,
          });
        }
        // else if (
        //   this.objPvtCart.length === this.maxAllowedDirectorEntries &&
        //   this.objPvtCart.some(({ idProofNo }) => idProofNo !== panValue.value)
        // ) {
        //   // this.objPvt length === maxAllowedDirectorEntries same; at least one of the idproofno !== panValue.value then
        //   panFormcontrol.setErrors({
        //     ...panFormcontrol.errors,
        //     mainPanNotGiven: true,
        //   });
        // }
      }
    );

    // date of commencement validation
    this.Trade_Details1.controls.Date_of_Commenencement.valueChanges.subscribe(
      (responseDate: any) => {
        if (!responseDate) {
          return;
        }

        const [dd, mm, yyyy] = responseDate.split('-');

        const dateOfCommencementField = this.Trade_Details1.controls
          .Date_of_Commenencement;
        console.log('selectedDate: ', responseDate);

        const curDateTime = new Date();
        const userSelectedDatetime = new Date(yyyy, mm - 1, dd);
        if (userSelectedDatetime > curDateTime) {
          dateOfCommencementField.setErrors({
            ...dateOfCommencementField.errors,
            badDate: true,
          });
        }
      }
    );

    this.PropertyOwnerDetail.controls.WardNo_CouncilorName.valueChanges.subscribe(
      (selectedWard: any) => {
        this.selectedWardId = selectedWard;
        console.log('selectedWard: ', this.selectedWardId);
      }
    );
    // validation neworRenew, especially when selected 'Renew/New' on/off formFields
    this.PropertyOwnerDetail.controls.neworRenew.valueChanges.subscribe(
      (userResponse: any) => {
        console.log('userResponse ', userResponse);
        if (userResponse === 'New') {
          this.userSelectedNew = 'N';
          // alert(this.userSelectedNew);
          this.shouldShowRegnField = false;
          this.PropertyOwnerDetail.controls.enter_regn.setValidators([]);
          // this.PropertyOwnerDetail.get('enter_regn').reset();  // this line messed when user selects new
        } else {
          this.userSelectedNew = 'R';
          // alert(this.userSelectedNew);
          this.shouldShowRegnField = true;
          this.PropertyOwnerDetail.controls.enter_regn.setValidators([
            Validators.required,
          ]);
        }
        // make network request to this and save the result which would be used later
        this.fetchFileNamesAndPopulate();
      }
    );

    // enter_regn formField validation
    this.PropertyOwnerDetail.controls.enter_regn.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((responseRegnNo: any) => {
        // make the network with the user value : http://localhost:7071/api/insert_mul_json
        console.log('here: ', responseRegnNo, typeof responseRegnNo); // string
        const regNoToBeSent = Number(responseRegnNo); // only be avaiable when user select renew
        console.log('makeRegNoNum: ', regNoToBeSent, typeof regNoToBeSent);

        // regNoToBeSent needed here for the network request

        this.proObj1
          .renewFormByRegnNo(regNoToBeSent)
          .subscribe((responseFromRegNo: any) => {
            this.renewResponseByRegNo = responseFromRegNo.body;
            console.log('response renew: ', this.renewResponseByRegNo);
            // made network request here for Trade Type with Nature
            this.proObj1
              .renewTradeTypeWithNature(regNoToBeSent)
              .subscribe((response: any) => {
                this.renewResponseWithTradeValues = response.body;
                console.log(
                  'renewTradeTypeValues: ',
                  this.renewResponseWithTradeValues
                );
                if (this.renewResponseWithTradeValues.length > 0) {
                  this.renewResponseWithTradeValues.forEach((item) => {
                    this.objTradeTypeCart.push({
                      tradeType: item['Trade_size'],
                      tradeNature: item['Trade_Type'],
                    });
                  });
                }

                console.log('obkTradeTypecart HERE: ', this.objTradeTypeCart);

                this.gridTradenatureApi.setRowData([]);
                this.gridTradenatureApi.updateRowData({
                  add: this.objTradeTypeCart,
                });

                this.Trade_Details1.controls.TradeType.patchValue('');
                this.Trade_Details1.controls.Nature_of_Trade.patchValue('');
              });

            if (this.renewResponseByRegNo.length > 0) {
              // save value to local property the bind to the form
              // Fin_Year_Sht_Name
              this.PropertyOwnerDetail.controls.enter_regn.setErrors(null);
              // now start the data binding here from this.renewResponseByRegNo
              const taxes = this.getTaxes();
              const taxTypeNameFromAPI = this.renewResponseByRegNo[0][
                'Tax_Paid_Type'
              ];
              const taxObj = taxes.find((tax) =>
                tax.name.includes(taxTypeNameFromAPI)
              );

              if (taxObj) {
                this.PropertyOwnerDetail.patchValue({
                  Type_Of_Tax: taxObj.id,
                });
              }

              this.PropertyOwnerDetail.patchValue({
                Assessee_Holding_No: this.renewResponseByRegNo[0][
                  'Assessee_Holding_No'
                ],
                Owner_Name: this.renewResponseByRegNo[0]['Property_Owner_Name'],
                Street_Road_Name: this.renewResponseByRegNo[0][
                  'Street_Address'
                ],
                AmountPaid_PropertyTax: this.renewResponseByRegNo[0][
                  'Tax_Paid_Amount'
                ],
                Locality_Name: this.renewResponseByRegNo[0]['Locality_Name'],
                WardNo_CouncilorName: this.renewResponseByRegNo[0]['Ward_No'],
                TypeOf_Relation_With_Land: this.renewResponseByRegNo[0][
                  'Land_Nature_Id'
                ],
              });
              // this.Trade_Details1.controls.For_the_Finalcial_year.value;
              this.Trade_Details1.patchValue({
                Type_Of_Business_Structure: this.renewResponseByRegNo[0][
                  'Trade_Nature_Id'
                ],
                For_the_Finalcial_year: this.renewResponseByRegNo[0][
                  'Fin_Year_Sht_Name'
                ],
                Name_Firm_Company: this.renewResponseByRegNo[0]['Name_Org'],
                Date_of_Commenencement: this.renewResponseByRegNo[0][
                  'Applied_On'
                ],
                TradeType: '',
                Nature_of_Trade: '',
                Cpmpany_GSTIN: this.renewResponseByRegNo[0]['GST_IN'],
                Company_PAN_Card_Number: this.renewResponseByRegNo[0][
                  'Company_PAN'
                ],
                Investment_Of_Capital: this.renewResponseByRegNo[0]['Capital'],
                Contact_Number: this.renewResponseByRegNo[0]['Con_No'],
                Contact_Address: this.renewResponseByRegNo[0]['Con_add'],
                Workshop_Address: this.renewResponseByRegNo[0]['Workshop'],
                Godown_Address: this.renewResponseByRegNo[0]['Godown'],
              });
              this.proObj1
                .renewOwenerByRegnNo(
                  Number(
                    String(
                      this.PropertyOwnerDetail.controls.enter_regn.value
                    ).trim()
                  )
                )
                .subscribe((response) => {
                  const propertyOwnerDetails = response['body'];
                  const Trade_Nature_Id = String(
                    this.renewResponseByRegNo[0]['Trade_Nature_Id']
                  );
                  this.GLOBAL_TL_ID = propertyOwnerDetails[0]['TL_ID'];

                  console.log('Trade_Nature_Id', Trade_Nature_Id);
                  if (Trade_Nature_Id == '1' || Trade_Nature_Id == '2') {
                    // NGO/SELF
                    this.isShowgridPvtLtd = false;
                    this.changeBusinessStructureType();

                    this.Trade_Details_Sole.get(
                      'Name_of_the_Propritor_Sole'
                    ).setValue(propertyOwnerDetails[0].Owner_Name);

                    this.BussinessCommunication.patchValue({
                      Father_Husband_Name: propertyOwnerDetails[0].So_Do_Wo,
                      Address: propertyOwnerDetails[0].Address,
                      ContactNo: propertyOwnerDetails[0].Contact_Mob,
                      ID_ProofName: 'Pan Card',
                      ID_Proof_No: propertyOwnerDetails[0].Pan,
                    });
                    this.objPvtCart = [];
                    this.objPvtCart.push({
                      dirName: propertyOwnerDetails[0].Owner_Name,
                      fHName: propertyOwnerDetails[0].So_Do_Wo,
                      address: propertyOwnerDetails[0].Address,
                      idProof: 'Pan Card',
                      idProofNo: propertyOwnerDetails[0].Pan,
                      ContactNo: propertyOwnerDetails[0].Contact_Mob,
                    });
                  } else {
                    if (propertyOwnerDetails.length > 0) {
                      this.objPvtCart = [];
                      this.isShowgridPvtLtd = true;
                      this.changeBusinessStructureType();

                      if (Trade_Nature_Id == '3' || Trade_Nature_Id == '6') {
                        this.Trade_Details_Partnership.get(
                          'TotalPartners_PvtLtd'
                        ).setValue(propertyOwnerDetails.length);
                      }

                      if (Trade_Nature_Id == '4' || Trade_Nature_Id == '5') {
                        this.Trade_Details_Private_Ltd.get(
                          'TotalDirector_Partnership'
                        ).setValue(propertyOwnerDetails.length);
                      }

                      propertyOwnerDetails.forEach((renewOwnerDetails) => {
                        this.objPvtCart.push({
                          dirName: renewOwnerDetails.Owner_Name,
                          fHName: renewOwnerDetails.So_Do_Wo,
                          address: renewOwnerDetails.Address,
                          idProof: 'Pan Card',
                          idProofNo: renewOwnerDetails.Pan,
                          ContactNo: renewOwnerDetails.Contact_Mob,
                        });
                      });
                      // this.isMultiple = true;

                      this.shouldDisableAddToCardPvtBtn =
                        this.objPvtCart.length >= this.maxAllowedDirectorEntries
                          ? true
                          : false;

                      // Render rows
                      this.gridPvtLtdApi.setRowData([]);
                      this.gridPvtLtdApi.updateRowData({
                        add: [...this.objPvtCart],
                      });
                    }
                  }
                });
            } else {
              // set error
              // this.PropertyOwnerDetail.controls.enter_regn.setErrors({
              //   ...this.PropertyOwnerDetail.controls.enter_regn.errors,
              //   noSuchRegnNoRegistered: true,
              // });

              // STEP 1 FORM CLEAR
              this.PropertyOwnerDetail.patchValue({
                Assessee_Holding_No: '',
                Owner_Name: '',
                Street_Road_Name: '',
                AmountPaid_PropertyTax: '',
                Type_Of_Tax: '',
                Locality_Name: '',
                WardNo_CouncilorName: '',
                TypeOf_Relation_With_Land: '',
              });
              // STEP 2 FORM CLEAR
              this.Trade_Details1.patchValue({
                Type_Of_Business_Structure: '',
                For_the_Finalcial_year: '',
                Name_Firm_Company: '',
                Date_of_Commenencement: '',
                TradeType: '',
                Nature_of_Trade: '',
                Cpmpany_GSTIN: '',
                Company_PAN_Card_Number: '',
                Investment_Of_Capital: '',
                Contact_Number: '',
                Contact_Address: '',
                Workshop_Address: '',
                Godown_Address: '',
              });

              this.Trade_Details_Sole.get(
                'Name_of_the_Propritor_Sole'
              ).setValue('');

              this.BussinessCommunication.patchValue({
                Father_Husband_Name: '',
                Address: '',
                ContactNo: '',
                ID_ProofName: 'Pan Card',
                ID_Proof_No: '',
              });
              this.objPvtCart = [];

              this.Trade_Details_Partnership.get(
                'TotalPartners_PvtLtd'
              ).setValue('');

              this.Trade_Details_Private_Ltd.get(
                'TotalDirector_Partnership'
              ).setValue('');

              this.shouldDisableAddToCardPvtBtn = false;

              // Render rows
              this.gridPvtLtdApi.setRowData([]);
              this.gridPvtLtdApi.updateRowData({
                add: [],
              });
              this.changeBusinessStructureType();
              this.isMultiple = false;
              this.isShowgridPvtLtd = false;
              this.Trade_Details_Private_Ltd.get(
                'TotalDirector_Partnership'
              ).disable();
              this.Trade_Details_Private_Ltd.get(
                'DirectorName_Partnership'
              ).disable();

              this.Trade_Details_Partnership.get(
                'TotalPartners_PvtLtd'
              ).disable();
              this.Trade_Details_Partnership.get(
                'Name_Partner_PvtLtd'
              ).disable();
              this.BussinessCommunication.controls.Father_Husband_Name.disable();
            }
          });
      });

    // ngif ends below

    this.listenModalDataChange();
  }

  listenModalDataChange() {
    this.proObj1.getTradeEnlishmentData().subscribe({
      next: ({ rowNodeId }) => {
        if (rowNodeId && rowNodeId !== 0) {
          this.deletePvtLtdRow(rowNodeId);
          if (this.objPvtCart.length === 0) {
            this.gridPvtLtdApi.setRowData([]); // Clears whole table
            this.objPvtCart = [];
          }

          if (this.objPvtCart.length < this.maxAllowedDirectorEntries) {
            this.shouldDisableAddToCardPvtBtn = false;
          }
        }
      },
      error: (error) => {},
    });
  }

  onBtnHandler(event) {
    console.log('button: ', event);
  }

  loadFormDesign() {
    this.submitted = false;

    this.PropertyOwnerDetail = new FormGroup({
      neworRenew: new FormControl('', Validators.required),
      enter_regn: new FormControl(''),
      Assessee_Holding_No: new FormControl('', Validators.required),
      Owner_Name: new FormControl('', Validators.required),
      //Building_House_Name: new FormControl('', Validators.required),
      Street_Road_Name: new FormControl('', Validators.required),
      Locality_Name: new FormControl('', Validators.required),
      WardNo_CouncilorName: new FormControl('', Validators.required),
      Type_Of_Tax: new FormControl('', Validators.required),
      AmountPaid_PropertyTax: new FormControl('', [
        Validators.required,
        NumberValidators.isNumberCheck,
      ]),
      TypeOf_Relation_With_Land: new FormControl('', Validators.required),
      //Property_Owner_Address: new FormControl('', Validators.required),
    });

    this.Trade_Details1 = new FormGroup({
      Type_Of_Business_Structure: new FormControl('', Validators.required),
      For_the_Finalcial_year: new FormControl('', Validators.required),
      Name_Firm_Company: new FormControl('', Validators.required),
      Date_of_Commenencement: new FormControl('', Validators.required),
      Nature_of_Trade: new FormControl(''),
      Cpmpany_GSTIN: new FormControl('', [
        Validators.pattern(
          /^[0-9]{1,2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$/
        ),
      ]),
      Company_PAN_Card_Number: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/),
      ]),
      Investment_Of_Capital: new FormControl('', [
        Validators.required,

        NumberValidators.isNumberCheck,
      ]),
      //Contact_Number: new FormControl('', Validators.required),
      Contact_Number: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        NumberValidators.isNumberCheck,
      ]),
      Contact_Address: new FormControl('', Validators.required),
      Workshop_Address: new FormControl('', Validators.required),
      TradeType: new FormControl(''),
      Godown_Address: new FormControl(''),
    });

    this.Trade_Details_Sole = new FormGroup({
      Name_of_the_Propritor_Sole: new FormControl(
        { value: '', disabled: true },
        Validators.required
      ),
    });

    this.Trade_Details_Private_Ltd = new FormGroup({
      TotalDirector_Partnership: new FormControl(
        { value: '', disabled: true },
        [Validators.required, NumberValidators.isNumberCheck]
      ),
      DirectorName_Partnership: new FormControl(
        { value: '', disabled: true },
        Validators.required
      ),
    });

    this.Trade_Details_Partnership = new FormGroup({
      TotalPartners_PvtLtd: new FormControl({ value: '', disabled: true }, [
        Validators.required,
        NumberValidators.isNumberCheck,
      ]),
      Name_Partner_PvtLtd: new FormControl(
        { value: '', disabled: true },
        Validators.required
      ),
    });

    this.BussinessCommunication = new FormGroup({
      Father_Husband_Name: new FormControl(
        { value: '', disabled: true },
        Validators.required
      ),
      Address: new FormControl(
        { value: '', disabled: true },
        Validators.required
      ),
      ContactNo: new FormControl({ value: '', disabled: true }, [
        Validators.required,
        Validators.maxLength(10),
        Validators.minLength(10),
        NumberValidators.isNumberCheck,
      ]),
      ID_ProofName: new FormControl(
        { value: 'Pan Card', disabled: true },
        Validators.required
      ),
      ID_Proof_No: new FormControl({ value: '', disabled: true }, [
        Validators.required,
        Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/),
      ]),
    });

    this.Uploading_documents = new FormGroup({
      docs: new FormArray([]),
    });

    this.Review_and_Submit = new FormGroup({
      Assessee_Holding_No: new FormControl({ value: '', disabled: true }),
      Owner_Name: new FormControl({ value: '', disabled: true }),
      Street_Road_Name: new FormControl({ value: '', disabled: true }),
      Locality_Name: new FormControl({ value: '', disabled: true }),
      WardNo_CouncilorName: new FormControl({ value: '', disabled: true }),
      Type_Of_Tax: new FormControl({ value: '', disabled: true }),
      AmountPaid_PropertyTax: new FormControl({ value: '', disabled: true }),
      TypeOf_Relation_With_Land: new FormControl({ value: '', disabled: true }),

      Type_Of_Business_Structure: new FormControl({
        value: '',
        disabled: true,
      }),
      For_the_Finalcial_year: new FormControl({ value: '', disabled: true }),
      Name_Firm_Company: new FormControl({ value: '', disabled: true }),
      Date_of_Commenencement: new FormControl({ value: '', disabled: true }),
      Investment_Of_Capital: new FormControl({ value: '', disabled: true }),
      Cpmpany_GSTIN: new FormControl({ value: '', disabled: true }),
      Company_PAN_Card_Number: new FormControl({ value: '', disabled: true }),

      Contact_Number: new FormControl({ value: '', disabled: true }),
      Contact_Address: new FormControl({ value: '', disabled: true }),
      Workshop_Address: new FormControl({ value: '', disabled: true }),
      Godown_Address: new FormControl({ value: '', disabled: true }),
    });
    // end solanki

    of(this.getTaxes()).subscribe((taxes) => {
      this.tlTaxes = taxes;
    });

    //Service Call for what types of doc needs to upload
    // this.bindDocs();
    this.fetchFileNamesAndPopulate();
  }

  async isProfileComplete(User_Type) {
    let result = await this.proObj.getUserProfile(User_Type);

    if (result[0].IS_Active === 'N') {
      this.toastr.error('You need to complete your profile', 'Employee Portal');
      this.router.navigate(['/members/profile']);
    }
  }

  showPreviousStep(event?: Event) {
    this.ngWizardService.previous();
  }

  showNextStep(event?: Event) {
    this.ngWizardService.next();
  }

  resetWizard(event?: Event) {
    this.ngWizardService.reset();
  }

  setTheme(theme: THEME) {
    this.ngWizardService.theme(theme);
  }

  stepChanged(args: StepChangedArgs) {
    console.log(args.step);
    console.log('from steps: ', args.step.index);
    this.stepIndex = args.step.index;
  }

  isValidTypeBoolean: boolean = true;

  isValidFunctionPropertyDetail(args: StepValidationArgs) {
    // user can exit this step only when !this.PropertyOwnerDetail.invalid then return true
    console.log('exitStep1: ', args);

    if (!this.PropertyOwnerDetail.invalid) {
      //this.isValidTypeBoolean2 = true; :: when this form is not invalid then only allowed to go to next step
      return true;
    } else {
      //this.isValidTypeBoolean2 = false; :: then not allowed to go next step
      return false;
    }
    //return true;
  }

  isValidFunctionTradeDetails(args: StepValidationArgs) {
    // this.objPvtCart = [];
    if (args.direction == 'backward' && args.toStep.index === 0) {
      return true;
    }

    let BusiStrucure = _.pick(this.Trade_Details1.value, [
      'Type_Of_Business_Structure',
    ]);

    // For Renew Case:
    if (this.GLOBAL_TL_ID > 0) {
      // Binding OK
      this.Trade_Details1.get('Type_Of_Business_Structure').setErrors(null);
      this.Trade_Details1.get('Name_Firm_Company').setErrors(null);
      this.Trade_Details1.get('Date_of_Commenencement').setErrors(null);
      this.Trade_Details1.get('Cpmpany_GSTIN').setErrors(null);
      this.Trade_Details1.get('Company_PAN_Card_Number').setErrors(null);
      this.Trade_Details1.get('Investment_Of_Capital').setErrors(null);
      this.Trade_Details1.get('Contact_Number').setErrors(null);
      this.Trade_Details1.get('Contact_Address').setErrors(null);
      this.Trade_Details1.get('Workshop_Address').setErrors(null);
      this.Trade_Details1.get('Godown_Address').setErrors(null);

      // HAVE  TO DO MANUALLY
      // this.Trade_Details1.get('Nature_of_Trade').setErrors(null);
      // this.Trade_Details1.get('For_the_Finalcial_year').setErrors(null);
      // this.Trade_Details1.get('TradeType').setErrors(null);
    }

    // For Renew Case:
    const requiredError = { required: true };
    if (
      this.GLOBAL_TL_ID > 0 &&
      (String(BusiStrucure.Type_Of_Business_Structure) === '4' ||
        String(BusiStrucure.Type_Of_Business_Structure) === '5')
    ) {
      // this.Trade_Details_Private_Ltd.get('TotalDirector_Partnership').setValue(
      //   this.objPvtCart.length
      // );
      if (
        Number(
          this.Trade_Details_Private_Ltd.get('TotalDirector_Partnership')
        ) === this.objPvtCart.length
      ) {
        this.Trade_Details_Private_Ltd.get(
          'TotalDirector_Partnership'
        ).setErrors(null);
        this.Trade_Details_Private_Ltd.get(
          'DirectorName_Partnership'
        ).setErrors(null);

        this.BussinessCommunication.setErrors(null);
      } else {
        // this.Trade_Details_Private_Ltd.get(
        //   'DirectorName_Partnership'
        // ).setErrors({ required: true });
        // this.BussinessCommunication.controls.Father_Husband_Name.setErrors(
        //   requiredError
        // );
        // this.BussinessCommunication.controls.Address.setErrors(requiredError);
        // this.BussinessCommunication.controls.ContactNo.setErrors(requiredError);
        // this.BussinessCommunication.controls.ContactNo.setValidators([
        //   Validators.required,
        //   Validators.maxLength(10),
        //   Validators.minLength(10),
        //   NumberValidators.isNumberCheck,
        // ]);
        // this.BussinessCommunication.controls.ID_Proof_No.setErrors(
        //   requiredError
        // );
        // this.BussinessCommunication.controls.ID_Proof_No.setValidators([
        //   Validators.required,
        //   Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/),
        // ]);
      }
    }

    // For Renew Case:
    if (
      this.GLOBAL_TL_ID > 0 &&
      (String(BusiStrucure.Type_Of_Business_Structure) === '3' ||
        String(BusiStrucure.Type_Of_Business_Structure) === '6')
    ) {
      // this.Trade_Details_Partnership.get('TotalPartners_PvtLtd').setValue(
      //   this.objPvtCart.length
      // );

      if (
        Number(this.Trade_Details_Partnership.get('TotalPartners_PvtLtd')) ===
        this.objPvtCart.length
      ) {
        this.Trade_Details_Partnership.get('TotalPartners_PvtLtd').setErrors(
          null
        );
        this.Trade_Details_Partnership.get('Name_Partner_PvtLtd').setErrors(
          null
        );

        this.BussinessCommunication.setErrors(null);
      } else {
        // this.Trade_Details_Partnership.get('Name_Partner_PvtLtd').setErrors(
        //   requiredError
        // );
        // this.BussinessCommunication.controls.Father_Husband_Name.setErrors(
        //   requiredError
        // );
        // this.BussinessCommunication.controls.Address.setErrors(requiredError);
        // this.BussinessCommunication.controls.ContactNo.setErrors(requiredError);
        // this.BussinessCommunication.controls.ContactNo.setValidators([
        //   Validators.required,
        //   Validators.maxLength(10),
        //   Validators.minLength(10),
        //   NumberValidators.isNumberCheck,
        // ]);
        // this.BussinessCommunication.controls.ID_Proof_No.setErrors(
        //   requiredError
        // );
        // this.BussinessCommunication.controls.ID_Proof_No.setValidators([
        //   Validators.required,
        //   Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/),
        // ]);
      }
    }

    try {
      if (!this.Trade_Details1.invalid && this.objTradeTypeCart.length > 0) {
        if (
          (String(BusiStrucure.Type_Of_Business_Structure) === '4' ||
            String(BusiStrucure.Type_Of_Business_Structure) === '5') &&
          this.Trade_Details_Private_Ltd.value.TotalDirector_Partnership != ''
        ) {
          let noPer = this.Trade_Details_Private_Ltd.value
            .TotalDirector_Partnership;

          if (parseInt(noPer) == this.objPvtCart.length) return true;
          else {
            this.toastr.error(
              'Total number of Directors is not matching with the collection'
            );
            return false;
          }
        } else if (
          (String(BusiStrucure.Type_Of_Business_Structure) === '3' ||
            String(BusiStrucure.Type_Of_Business_Structure) === '6') &&
          this.Trade_Details_Private_Ltd.value.TotalPartners_PvtLtd != ''
        ) {
          let noPer = this.Trade_Details_Partnership.value.TotalPartners_PvtLtd;

          if (parseInt(noPer) == this.objPvtCart.length) return true;
          else {
            this.toastr.error(
              'Total number of Partners is not matching with the collection'
            );
            return false;
          }
        } else if (
          String(BusiStrucure.Type_Of_Business_Structure) === '1' ||
          String(BusiStrucure.Type_Of_Business_Structure) === '2'
        ) {
          if (
            this.Trade_Details_Sole.value.Name_of_the_Propritor_Sole != '' &&
            this.BussinessCommunication.valid
          ) {
            this.objPvtCart.push({
              dirName: this.Trade_Details_Sole.value.Name_of_the_Propritor_Sole,
              fHName: this.BussinessCommunication.value.Father_Husband_Name,
              address: this.BussinessCommunication.value.Address,
              idProof: this.BussinessCommunication.value.ID_ProofName,
              idProofNo: this.BussinessCommunication.value.ID_Proof_No,
              ContactNo: this.BussinessCommunication.value.ContactNo,
            });
            return true;
          } else {
            this.toastr.error(
              'Name of the proprietor or Id proof can not be empty'
            );
            return false;
          }
        }
      } else {
        this.toastr.error(
          'Either form is invalid or you did not provide your business type'
        );
        return false;
      }

      // if (BusiStrucure.Type_Of_Business_Structure === "1" && !this.Trade_Details_Sole.invalid && !this.Trade_Details1.invalid) {
      //   sts = true;
      // }
      // else if (BusiStrucure.Type_Of_Business_Structure === "3" && !this.Trade_Details_Partnership.invalid && !this.Trade_Details1.invalid) {
      //   sts = true;
      // }
      // else if (BusiStrucure.Type_Of_Business_Structure === "4" && !this.Trade_Details_Private_Ltd.invalid && !this.Trade_Details1.invalid) {
      //   sts = true;
      // }
      // else if (BusiStrucure.Type_Of_Business_Structure === "2" || BusiStrucure.Type_Of_Business_Structure === "5" || BusiStrucure.Type_Of_Business_Structure === "6") {
      //   if (!this.Trade_Details1.invalid)
      //     sts = true;
      // }

      // if (!this.Trade_Details1.invalid) {
      //   //this.isValidTypeBoolean2 = true;
      //   return true;
      // } else {
      //   //this.isValidTypeBoolean2 = false;
      //   return false;
      // }
    } catch (error) {}

    //return sts
  }

  isValidFunctionReturnsObservable(args: StepValidationArgs) {
    return of(true);
  }

  isValidFunctionReview(args: StepValidationArgs) {
    if (args.direction == 'backward' && args.toStep.index === 1) {
      return true;
    }
    // logic for whether user can move to next/previous step or not;
    return this.populateSummary();
  }

  createTLdocFiles() {
    try {
      let controls = <FormArray>this.Uploading_documents.controls.docs;
      console.log('controlsFrom_createdocFiles: ', controls.value);
      console.log('controls.length', controls.length);

      for (let index = 0; index < controls.length; index++) {
        console.log('show here: ', controls[index]);

        const selectedfiles = (<HTMLInputElement>(
          document.getElementById('file_' + index)
        )).files;

        if (selectedfiles.length === 0) {
          continue;
        }

        const filename = (<HTMLInputElement>(
          document.getElementById('filename_' + index)
        )).value;

        const filepath = (<HTMLInputElement>(
          document.getElementById('docpath_' + index)
        )).value;

        // const file = selectedfiles.item(0);
        console.log('T1: ', filename, filepath);

        this.tlDocsUpload.push({
          Document_name: filename,
          Doc_path: filepath,
          Document_Id: index + 1,
        });
      }
      console.log(`this.tlDocsUpload`, this.tlDocsUpload);
    } catch (error) {
      console.log('error in file array', error);
    }
  }

  async saveDocumentFiles() {
    try {
      //This block to save multiple file
      console.log('[saveDocumentFiles]', this.tlDocsUpload);

      let controls = <FormArray>this.Uploading_documents.controls.docs;
      const formData = new FormData();
      for (let index = 0; index < controls.length; index++) {
        const selectedfiles = (<HTMLInputElement>(
          document.getElementById('file_' + index)
        )).files;
        if (selectedfiles.length === 0) {
          continue;
        }
        const file = selectedfiles.item(0);
        formData.append('files', file);
      }
      var array = [];
      let serviceCalled = await this.proObj1.uploadTLdocs(formData);
      this.uploadedDocs = serviceCalled;
      // This block to save multiple file
      console.log(`saveDocumentFiles::this.uploadedDocs`, this.uploadedDocs);
      console.log(`saveDocumentFiles::this.tlDocsUpload`, this.tlDocsUpload);
      for (let index = 0; index < this.uploadedDocs.length; index++) {
        this.tlDocsUpload[index].Doc_path = this.uploadedDocs[index].filepath;
      }

      // Remap properties
      this.tlDocsUpload = this.tlDocsUpload.map((doc) => {
        return {
          Doc_path: doc.Doc_path,
          Document_Id: doc.Document_Id,
        };
      });

      console.log('success file uploaded to azure', this.tlDocsUpload); // t1docs are being sent to tradeinsert
    } catch (error) {
      console.log('error infila save', error);
    }
  }

  async bindDocs() {
    let result = this.fileListNames;
    console.log('Docs', result); // return an array of object with document id and document name

    this.docTypes = result; // [{}, {}, {}, {}, {}]

    for (let index = 0; index < this.docTypes.length; index++) {
      const tlDocGroup = new FormGroup({
        docname: new FormControl(this.docTypes[index].Document_name),
        docfile: new FormControl(''),
        docpath: new FormControl(''),
        docId: new FormControl(this.docTypes[index].Document_Id),
      });

      //  initially t1DocGroup is just made from docTypes values; so now it has docName while docFile & docPath is empty
      // console.log("[tlDocGroup]", tlDocGroup);

      // now t1docgroup has beeen pushed as value Uploading_documents.controls.docs field since this field is FormArray

      <FormArray>this.Uploading_documents.controls.docs.push(tlDocGroup); // this field is a type of Formarray
      // controls.push(tlDocGroup); // pushed whatever value t1doc formGroup has within controls
      // console.log("t1: ", controls); // [{}, {}, {}, {}, {}] :: docname
    }
    // so whatever t1DocGrp formGroup has now avaiable within uploading_documents.controls.docs formArray field
    console.log(
      'this.Uploading_documents.controls.docs',
      this.Uploading_documents.controls.docs.value
    );
    let ind = 0;
  }

  async bindWard() {
    let result = await this.proObj1.getWardBind();
    this.WardNoCouncilorName = result;
    console.log('Ward Lists', this.WardNoCouncilorName);
  }

  async bindTradeType() {
    let result = await this.proObj1.getTradeType();
    this.tradeTypeList = result;
    console.log('TradeType list', this.tradeTypeList);
  }

  async getRelation_LandBind() {
    let result = await this.proObj1.getRelationLandBind();
    this.TypeRelationWithLand = result;
  }

  async getFinalcial_yearBind() {
    let result = await this.proObj1.getForFinalcial_yearBind();
    this.For_Finalcial_year = result;
    console.log('result_year: ', result);

    // get the for the year's value from api then setValue to for_the_financial year field
    this.Trade_Details1.patchValue({
      For_the_Finalcial_year: result[0]['Fin_Year_ID'],
    });
  }

  async getIDProofNameBind(IDProof_Name) {
    let result = await this.proObj1.getIDProof_NameBind(IDProof_Name);
    this.IDProofName = result;
    console.log('RESULTEE: ', this.IDProofName);
  }
  async bindTradeNature() {
    let result = await this.proObj1.getTradeNature();
    this.tradeNatureList = result;
  }

  changeBusinessStructureType() {
    try {
      // retrieved the Type_Of_Business_Structure field from Trade_details1
      let BusiStrucure = _.pick(this.Trade_Details1.value, [
        'Type_Of_Business_Structure',
      ]);

      this.selectedBusinessType = this.Trade_Details1.get(
        'Type_Of_Business_Structure'
      ).value;

      //Sole
      if (
        String(BusiStrucure.Type_Of_Business_Structure) === '1' ||
        String(BusiStrucure.Type_Of_Business_Structure) === '2'
      ) {
        this.isMultiple = false;

        this.Trade_Details_Sole.get('Name_of_the_Propritor_Sole').enable();

        this.Trade_Details_Private_Ltd.get(
          'TotalDirector_Partnership'
        ).disable();
        this.Trade_Details_Private_Ltd.get(
          'DirectorName_Partnership'
        ).disable();

        this.Trade_Details_Partnership.get('TotalPartners_PvtLtd').disable();
        this.Trade_Details_Partnership.get('Name_Partner_PvtLtd').disable();

        this.BussinessCommunication.get('Father_Husband_Name').enable();
        this.BussinessCommunication.get('Address').enable();
        this.BussinessCommunication.get('ContactNo').enable();
        this.BussinessCommunication.get('ID_ProofName').enable();
        this.BussinessCommunication.get('ID_Proof_No').enable();
      }
      //Partnership
      else if (
        String(BusiStrucure.Type_Of_Business_Structure) === '3' ||
        String(BusiStrucure.Type_Of_Business_Structure) === '6'
      ) {
        this.isMultiple = true;
        this.Trade_Details_Private_Ltd.get(
          'TotalDirector_Partnership'
        ).disable();
        this.Trade_Details_Private_Ltd.get(
          'DirectorName_Partnership'
        ).disable();

        this.Trade_Details_Sole.get('Name_of_the_Propritor_Sole').disable();

        this.Trade_Details_Partnership.get('TotalPartners_PvtLtd').enable();
        this.Trade_Details_Partnership.get('Name_Partner_PvtLtd').enable();

        this.BussinessCommunication.get('Father_Husband_Name').enable();
        this.BussinessCommunication.get('Address').enable();
        this.BussinessCommunication.get('ContactNo').enable();
        this.BussinessCommunication.get('ID_ProofName').enable();
        this.BussinessCommunication.get('ID_Proof_No').enable();
      }
      //pvtltd
      else if (
        String(BusiStrucure.Type_Of_Business_Structure) === '4' ||
        String(BusiStrucure.Type_Of_Business_Structure) === '5'
      ) {
        this.isMultiple = true;
        this.Trade_Details_Partnership.get('TotalPartners_PvtLtd').disable();
        this.Trade_Details_Partnership.get('Name_Partner_PvtLtd').disable();

        this.Trade_Details_Sole.get('Name_of_the_Propritor_Sole').disable();

        this.Trade_Details_Private_Ltd.get(
          'TotalDirector_Partnership'
        ).enable();
        this.Trade_Details_Private_Ltd.get('DirectorName_Partnership').enable();

        this.BussinessCommunication.get('Father_Husband_Name').enable();
        this.BussinessCommunication.get('Address').enable();
        this.BussinessCommunication.get('ContactNo').enable();
        this.BussinessCommunication.get('ID_ProofName').enable();
        this.BussinessCommunication.get('ID_Proof_No').enable();
      }
    } catch (error) {
      console.log('Error at pvt ltd', error);
    }
  }

  dateYYMMDD(dateStr) {
    var dd = dateStr.split('-')[0];
    var mm = dateStr.split('-')[1];
    var yy = dateStr.split('-')[2];

    return yy + '-' + mm + '-' + dd;
  }

  searchArray(nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].id === nameKey) {
        return myArray[i];
      }
    }
  }

  // this is where when finish button clicked this method will work
  async tradeLicenseSubmit() {
    try {
      if (!this.PropertyOwnerDetail.invalid && !this.Trade_Details1.invalid) {
        await this.createTLdocFiles();
        await this.saveDocumentFiles();

        var resultObject = this.searchArray(
          this.PropertyOwnerDetail.value.Type_Of_Tax,
          this.tlTaxes
        );
        console.log('resultObject', resultObject);

        let username = sessionStorage.getItem('username');

        let isRenew = false;

        this.objTLApp = {
          TL_ID: 1,
          Assessee_Holding_No: this.PropertyOwnerDetail.value
            .Assessee_Holding_No,
          Property_Owner_Name: this.PropertyOwnerDetail.value.Owner_Name,
          Ward: this.selectedWardId,
          Street_Address: this.PropertyOwnerDetail.value.Street_Road_Name,
          Locality_Name: this.PropertyOwnerDetail.value.Locality_Name,
          Tax_Paid_Type: resultObject['name'], //Sending the tax name
          Tax_Paid_Amount: this.PropertyOwnerDetail.value
            .AmountPaid_PropertyTax,
          Land_Nature_Id: Number(
            this.PropertyOwnerDetail.value.TypeOf_Relation_With_Land
          ),
          Trade_Nature_Id: Number(
            this.Trade_Details1.value.Type_Of_Business_Structure
          ),
          Name_Org: this.Trade_Details1.value.Name_Firm_Company,
          GST_IN: this.Trade_Details1.value.Cpmpany_GSTIN,
          Company_PAN: this.Trade_Details1.value.Company_PAN_Card_Number,
          Capital: this.Trade_Details1.value.Investment_Of_Capital,
          Con_add: this.Trade_Details1.value.Contact_Address,
          Con_No: Number(this.Trade_Details1.value.Contact_Number),
          Workshop: this.Trade_Details1.value.Workshop_Address,
          Godown: this.Trade_Details1.value.Godown_Address,
          Regnx: null,
          Ptax_no: null,
          Remarks: null,
          E_Cityzen_ID: null,
          User_ID: username,
          Appl_By: username,
          regn_118: null,
          regn_201: null,
        };

        // wardId value should the matched value from ward api response
        this.objTLAppForm = {
          TL_Form_Id: 1,
          TL_ID: 1,
          Form_No: null,
          Fin_Year_ID: Number(this.Trade_Details1.value.For_the_Finalcial_year),
          TL_Type: 'N',
          Ward_ID: this.selectedWardId,
          // Ward_ID: this.PropertyOwnerDetail.value.WardNo_CouncilorName,
          Street: this.PropertyOwnerDetail.value.Street_Road_Name,
          Holding_No: this.PropertyOwnerDetail.value.Assessee_Holding_No,
          Tax_Status: null,
          Land_Nature_Id: this.PropertyOwnerDetail.value
            .TypeOf_Relation_With_Land,
          Applied_On: this.Trade_Details1.value.Date_of_Commenencement,
          // Status: '3',
          Status: 2,
        };

        if (this.GLOBAL_TL_ID) {
          this.objTLAppForm.TL_ID = Number(this.GLOBAL_TL_ID);
          isRenew = true;
        }

        // now some of the data for this.objTLAppPayment are being hard-coded; later those value'll from api *like amount
        //if(some api value is > 0)
        this.objTLAppPayment = {
          Payment_Id: 1,
          TL_Form_Id: 1,
          Payment_Date: this.Trade_Details1.value.Date_of_Commenencement,
          Payment_Receipt_No: null,
          TL_Fin_Year_ID: this.Trade_Details1.value.For_the_Finalcial_year,
          Posting_Fin_Year_ID: this.Trade_Details1.value.For_the_Finalcial_year,
          Fee_Trade_id: 0,
          Description:
            '1401004 - REGISTRATION OF PREOFESSIONAL/ENLISTMENT FEES',
          Amount: 50, //Copy this from an api when the api becomes ready to use
        };

        //Create a flowup array like payment :: now followup should've an interface so fill as interface

        this.objTLAppFollowup = {
          Followup_Id: 1,
          TL_Form_Id: 2000277,
          Form_Status: 'applied',
          Followup_Date: this.Trade_Details1.value.Date_of_Commenencement,
          Sent_To_Date: null,
          Remarks: 'send from the helpdesk',
          Followup_By_E_Cityzen_ID: 0,
          Followup_By_User_ID: sessionStorage.getItem('username'),
          Followup_By_User_Type: 'Employee',
          Next_Followup_E_Cityzen_ID: 0,
          Next_Followup_User_ID: null,
          Next_Followup_User_Type: 'Employee',
          Is_Used: 'N',
        };

        this.objTLAppTradeType = [];
        this.objTLAppOwner = [];

        console.log(
          'followup_date_from_trade:  ',
          this.objTLAppFollowup.Followup_Date
        );

        for (let index = 0; index < this.objTradeTypeCart.length; index++) {
          this.objTLAppTradeType.push({
            Txn_Id: 1,
            TL_ID: 1,
            Trade_id: this.objTradeTypeCart[index].tradeNature,
            Trade_Size: this.objTradeTypeCart[index].tradeType,
          });
        }

        for (let index = 0; index < this.objPvtCart.length; index++) {
          this.objTLAppOwner.push({
            Owner_Partner_Id: 1,
            TL_ID: 1,
            Owner_Name: this.objPvtCart[index].dirName,
            Pan: this.objPvtCart[index].idProofNo,
            Contact_Mob: this.objPvtCart[index].ContactNo,
            So_Do_Wo: this.objPvtCart[index].fHName,
            Address: this.objPvtCart[index].address,
          });
        }

        console.log({
          objTLApp: this.objTLApp,
          objTLAppForm: this.objTLAppForm,
          objTLAppPayment: this.objTLAppPayment,
          objTLAppFollowup: this.objTLAppFollowup,
          objTLAppTradeType: this.objTLAppTradeType,
          objTLAppOwner: this.objTLAppOwner,
          tlDocsUploadthis: this.tlDocsUpload,
        });

        if (isRenew) {
          this.objTLAppOwner.forEach((appOwner) => {
            appOwner.TL_ID = this.GLOBAL_TL_ID;
          });
          this.objTLAppTradeType.forEach((appTradeType) => {
            appTradeType.TL_ID = this.GLOBAL_TL_ID;
          });
        }

        // now give tradeinsert the neccessary arguments required; argument has to be provided with parameters's order
        let dbStatus = await this.proObj1.tradeInsert(
          this.objTLApp,
          this.objTLAppForm,
          this.objTLAppPayment,
          this.objTLAppFollowup,
          this.objTLAppTradeType,
          this.objTLAppOwner,
          this.tlDocsUpload,
          this.GLOBAL_TL_ID,
          isRenew
        );
        // tradeinsert has user image/images via this.t1docsupload which is an array of object
        console.log(
          'HAS THE image being sent when tradeinsert: ',
          this.tlDocsUpload
        );
        console.log('TRADE-TYPE: ', this.objTLAppTradeType);
        console.log(`this.objPvtCart`, this.objPvtCart);

        if (dbStatus[0].CODE === 1) {
          // this.saveDocumentFiles(); dbStatus[0].code === 1; that means it has the resonse needed so
          // show/open a modal here with the data from dbstatus rather than toastr
          this.recivedFormResonseForTL = dbStatus;
          console.log('recivedFormRespoonse: ', this.recivedFormResonseForTL);

          // this.toastr.success(
          //   `Data SAVED successfully and your Form Number is ${dbStatus[0].FormNumber}  please noted down`
          // );
          // rather than a button, manually open the modal whenever needed
          if (this.recivedFormResonseForTL.length > 0) {
            $('#staticBackdrop').modal('show');
          }
          // when modal hidden by user then go to members/dashboard
          $('#staticBackdrop').on('hidden.bs.modal', () => {
            console.log('modal closed');
            // router within constructor should be public & use arrow to solve this here
            // this.router.navigate(['/members/dash']);
            window.location.reload();
            sessionStorage.removeItem('paymentForm');
          });
        } else {
          this.toastr.error('Something went wrong');
        }

        // reset the  Form (& was redirecting to members/dash before)
        // this.resetForms();
        console.log('From Server after insert', dbStatus);
      }
    } catch (error) {
      console.log('Error Occured', error);
    }
  }

  onModalHide() {
    // $('#staticBackdrop').modal('hide');
    $('#staticBackdrop').modal('dispose');
  }

  resetForms() {
    try {
      this.objTLAppTradeType = [];
      this.objTLAppOwner = [];

      this.PropertyOwnerDetail.reset();
      this.Trade_Details1.reset();
      this.Trade_Details_Sole.reset();
      this.Trade_Details_Partnership.reset();
      this.Trade_Details_Private_Ltd.reset();
      this.BussinessCommunication.reset();
      this.Uploading_documents.reset();

      this.gridTradenatureApi.setRowData([]);
      this.gridPvtLtdApi.setRowData([]);

      // this.router.navigate(['/members/dash']);

      //reset Grid
    } catch (error) {}
  }

  populateSummary() {
    try {
      var resultObject = this.searchArray(
        this.PropertyOwnerDetail.value.Type_Of_Tax,
        this.tlTaxes
      );

      //var filename = (<HTMLInputElement>document.getElementById('filename_' + index)).value;
      var Business_Structure = $('#Type_Of_Business_Structure')
        .find(':selected')
        .text();
      var finyr = $('#For_the_Finalcial_year').find(':selected').text();
      var LandType = $('#TypeOf_Relation_With_Land').find(':selected').text();

      let username = sessionStorage.getItem('username');

      this.objTLApp = {
        TL_ID: 1,
        Assessee_Holding_No: this.PropertyOwnerDetail.value.Assessee_Holding_No,
        Property_Owner_Name: this.PropertyOwnerDetail.value.Owner_Name,
        Ward: this.PropertyOwnerDetail.value.WardNo_CouncilorName,
        Street_Address: this.PropertyOwnerDetail.value.Street_Road_Name,
        Locality_Name: this.PropertyOwnerDetail.value.Locality_Name,
        Tax_Paid_Type: resultObject['name'], //Sending the tax name
        Tax_Paid_Amount: this.PropertyOwnerDetail.value.AmountPaid_PropertyTax,
        Land_Nature_Id: this.PropertyOwnerDetail.value
          .TypeOf_Relation_With_Land,
        Trade_Nature_Id: this.Trade_Details1.value.Type_Of_Business_Structure,
        Name_Org: this.Trade_Details1.value.Name_Firm_Company,
        GST_IN: this.Trade_Details1.value.Cpmpany_GSTIN,
        Company_PAN: this.Trade_Details1.value.Company_PAN_Card_Number,
        Capital: this.Trade_Details1.value.Investment_Of_Capital,
        Con_add: this.Trade_Details1.value.Contact_Address,
        Con_No: this.Trade_Details1.value.Contact_Number,
        Workshop: this.Trade_Details1.value.Workshop_Address,
        Godown: this.Trade_Details1.value.Godown_Address,
        Regnx: null,
        Ptax_no: null,
        Remarks: null,
        E_Cityzen_ID: username,
        User_ID: null,
        Appl_By: username,
        regn_118: null,
        regn_201: null,
      };

      this.objTLAppForm = {
        TL_Form_Id: 1,
        TL_ID: 1,
        Form_No: null,
        Fin_Year_ID: this.Trade_Details1.value.For_the_Finalcial_year,
        TL_Type: 'N',
        Ward_ID: this.PropertyOwnerDetail.value.WardNo_CouncilorName,
        Street: this.PropertyOwnerDetail.value.Street_Road_Name,
        Holding_No: this.PropertyOwnerDetail.value.Assessee_Holding_No,
        Tax_Status: null,
        Land_Nature_Id: this.PropertyOwnerDetail.value
          .TypeOf_Relation_With_Land,
        Applied_On: this.Trade_Details1.value.Date_of_Commenencement,
        Status: 2,
      };

      this.objTLAppTradeType = [];
      this.objTLAppOwner = [];

      for (let index = 0; index < this.objTradeTypeCart.length; index++) {
        this.objTLAppTradeType.push({
          Txn_Id: 1,
          TL_ID: 1,
          Trade_id: this.objTradeTypeCart[index].tradeNature,
          Trade_Size: this.objTradeTypeCart[index].tradeType,
        });
      }

      for (let index = 0; index < this.objPvtCart.length; index++) {
        this.objTLAppOwner.push({
          Owner_Partner_Id: 1,
          TL_ID: 1,
          Owner_Name: this.objPvtCart[index].dirName,
          Pan: this.objPvtCart[index].idProofNo,
          Contact_Mob: this.objPvtCart[index].ContactNo,
          So_Do_Wo: this.objPvtCart[index].fHName,
          Address: this.objPvtCart[index].address,
        });
      }

      this.taxName = this.objTLApp.Tax_Paid_Type;

      this.Review_and_Submit.patchValue({
        Assessee_Holding_No: this.objTLApp.Assessee_Holding_No,
        Owner_Name: this.objTLApp.Property_Owner_Name,
        Street_Road_Name: this.objTLApp.Street_Address,
        Locality_Name: this.objTLApp.Locality_Name,
        WardNo_CouncilorName: this.objTLApp.Ward,
        Type_Of_Tax: this.objTLApp.Tax_Paid_Type,
        AmountPaid_PropertyTax: this.objTLApp.Tax_Paid_Amount,
        TypeOf_Relation_With_Land: LandType,
        Type_Of_Business_Structure: Business_Structure,
        Name_Firm_Company: this.objTLApp.Name_Org,
        Cpmpany_GSTIN: this.objTLApp.GST_IN,
        Company_PAN_Card_Number: this.objTLApp.Company_PAN,
        Investment_Of_Capital: this.objTLApp.Capital,
        Contact_Number: this.objTLApp.Con_No,
        Contact_Address: this.objTLApp.Con_add,
        Workshop_Address: this.objTLApp.Workshop,
        Godown_Address: this.objTLApp.Godown,
      });

      this.Review_and_Submit.patchValue({
        For_the_Finalcial_year: finyr,
        Date_of_Commenencement: this.objTLAppForm.Applied_On,
      });

      this.docsReview = [];
      let docFormGroupControls = <FormArray>(
        this.Uploading_documents.controls.docs
      ); // uploaded file should be here like [{}, {}]

      //Review Files
      let shouldProceedToNextStep = docFormGroupControls.controls.some(
        (control, index) => {
          return (
            (<HTMLInputElement>document.getElementById('file_' + index)).files
              .length > 0
          );
        }
      );

      // for (let index = 0; index < docFormGroupControls.length; index++) {
      //   // loop on all files from controls and assign to selectedfiles variable with each iteration
      //   const selectedfiles = (<HTMLInputElement>(
      //     document.getElementById('file_' + index)
      //   )).files;
      //   shouldProceedToNextStep = false;
      //   break;
      //   // if no files avaiable within control that means user hasn't uploaded a single file so then return false
      //   if (selectedfiles.length === 0) {
      //     // continue;
      //     // this.toastr.error('You must upload at least a single image');
      //     return false;
      //   }
      //   // name of the first file uploaded
      //   var uploadedFileName = selectedfiles.item(0).name;

      //   const filename = (<HTMLInputElement>(
      //     document.getElementById('filename_' + index)
      //   )).value;

      //   const filepath = (<HTMLInputElement>(
      //     document.getElementById('docpath_' + index)
      //   )).value;

      //   this.docsReview.push({
      //     Document_name: filename,
      //     Doc_path: uploadedFileName,
      //   });
      // }

      // If none of the images exists then exit early..!!
      if (!shouldProceedToNextStep) {
        this.toastr.error('You should upload at least a single image');
        return false;
      }

      docFormGroupControls.controls.forEach((control, index) => {
        console.log('uploaded_ctrl: ', control.value); // selected values
        // console.log('uploadedId: ', index); // selected file names' id

        const selectedfiles = (<HTMLInputElement>(
          document.getElementById('file_' + index)
        )).files;

        if (selectedfiles.length) {
          console.log('selectedfiles', selectedfiles);
          var uploadedFileName = selectedfiles[0].name;

          const filename = (<HTMLInputElement>(
            document.getElementById('filename_' + index)
          )).value;

          const filepath = (<HTMLInputElement>(
            document.getElementById('docpath_' + index)
          )).value;

          this.docsReview.push({
            Document_name: control.value['docname'],
            Doc_path: uploadedFileName,
          });

          console.log('review-uploadedimages: ', this.docsReview);
        }
      });

      shouldProceedToNextStep = true;
      console.log('shouldProceedToNextStep', shouldProceedToNextStep);
      console.log('before filter: ', this.objPvtCart);

      const uniqueItems = this.objPvtCart.filter((item: any) => item.idProofNo);
      this.objPvtCart = uniqueItems;
      this.objPvtCart = _.uniqBy([...this.objPvtCart], 'idProofNo');
      console.log('unique-items: ', uniqueItems);
      console.log('unique: ', this.objPvtCart);

      return shouldProceedToNextStep;
    } catch (error) {
      console.log('Error Occured', error);
    }
  }

  onDocFileChange(event, docName, docId) {
    console.log('docName', docName);
    // console.log(event, docName);

    // get the file and make it base64 format and save it to local propery along with the id and then simply send
    // it to the modal component where it'll use this id to find it from within uploading_documents.get('docs')
    // {docFile, id}
    this.makeBase64Image(event.target.files[0], docName, docId);
  }

  makeBase64Image(file: File, index, docId) {
    // making a new obserable means that it'll be using observer/subscriber patter to emit out a value and then
    // when needed just subscribe to it
    const obserable = new Observable((subscriber: Subscriber<any>) => {
      // the argument makeBase64Image recived is given to readFile method along with subscriber
      this.readFile(file, subscriber, index);
    });

    obserable.subscribe((fileResponseAsBase64FromObs) => {
      console.log(fileResponseAsBase64FromObs);
      // whatever is here from fileResponseAsBase64FromObs, take everything from that and put within an object
      // this.saveBase64ImageWithId = { ...fileResponseAsBase64FromObs };
      this.saveBase64ImageWithId[fileResponseAsBase64FromObs.name] =
        fileResponseAsBase64FromObs.file;
      this.fileMapWithNameAndID[fileResponseAsBase64FromObs.name] = docId;
      console.log('fileMapWithNameAndID', this.fileMapWithNameAndID);
      this.encodeImageObject = fileResponseAsBase64FromObs;
    });
  }

  readFile(file: File, subscriber: Subscriber<any>, index) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file); // { formcontronindex: event.target.file is now base64}
    // using its 2nd argument which is a subscriber called next()
    fileReader.onload = () => {
      subscriber.next({ name: index, file: fileReader.result }); // { fileindex: base64 file }
      // whatever the result maybe after using next(); just if it has the result then
      subscriber.complete();
    };
    fileReader.onabort = (error) => {
      subscriber.error(error);
      // whatever the result maybe just if it has the result then
      subscriber.complete();
    };
  }

  deletePvtLtdRow(rowNodeId) {
    this.gridPvtLtdApi.setRowData([]); // Clears whole table
    this.objPvtCart.splice(rowNodeId, 1); // Delete the object from the array
    this.gridPvtLtdApi.updateRowData({ add: [...this.objPvtCart] }); // Spread the objects within an array as a value of add.
  }

  showModal(docName) {
    console.log('FILE_INDEX_NOW_NAME: ', docName);
    console.log('FROM SHOWMODAL', this.saveBase64ImageWithId);
    // use the docName parameter's value which given from templte to find tha same value within saveBase64ImageWithId

    // saveBase64ImageWithId used docname as key wholse value is the file; so if the showModal's docName is same as
    // saveBase64ImageWithId's key, by using find that key is retrieved and assigned to name & value goes to file
    this.encodeImageObject = {
      name: Object.keys(this.saveBase64ImageWithId).find(
        (doc) => doc === docName
      ),
      file: this.saveBase64ImageWithId[docName],
    };

    this.shouldAttachmentViewerModalOpen = true;
  }

  closeModal(event) {
    this.shouldAttachmentViewerModalOpen = event;
  }
  fetchFileNamesAndPopulate() {
    this.proObj1
      .getDocsTypeBind(this.userSelectedNew)
      .subscribe((fileName: any) => {
        this.fileListNames = fileName.body;
        console.log('this.fileListNames: ', this.fileListNames);
        this.bindDocs();
      });
  }
}

//Test case of isExists function
// var myarr = [{ id: "1", Name: "D", Age: "20" }, { id: "2", Name: "B", Age: "21" }, { id: "3", Name: "C", Age: "32" }];
// var findItem = { id: "2", Name: "B1", Age: "21" };
// var ss = this.isExists(myarr, findItem, 3);
// console.log('is array same ?', ss);
