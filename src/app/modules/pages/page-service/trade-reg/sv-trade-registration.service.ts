import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Promise } from 'es6-promise';

import { kStringMaxLength } from 'buffer';
import { ITLDocsUpload } from '../../models/i-tldocs-upload';

@Injectable({
  providedIn: 'root',
})
export class SvTradeRegistrationService {
  apiRoot: string = 'http://localhost:7071/api/';
  hostedURI: string =
    'https://empltest.azurewebsites.net/api/insert_mul_json?code=QLDzt7NeLwTAOVXopBQIx/Nm3Go0H2JlZqel54uPWS3/Ha5r2LPQ8A==';
  hostedFileURI: string =
    'https://empltest.azurewebsites.net/api/insert_mul_file?code=9aCClXD2G8RIdujl5PGjaVECoTv3t0yTp4/XqcymRMogJLX4MaPKEQ==&test=test';
  fileList: ITLDocsUpload[] = [];
  send;

  constructor(private http: HttpClient) {}

  public bufferCartData = new BehaviorSubject<any>(0);
  private pvtLtdModal$ = new BehaviorSubject<any>(0);
  private tradeEnlishment$ = new BehaviorSubject<any>({ rowNodeId: 0 });
  private isModalOpen$ = new BehaviorSubject<any>(false);
  // private printForm$ = new BehaviorSubject<Array<any>>([]); // by default it'll have an array [{}]
  // public printForm = this.printForm$.asObservable();

  // setPrintForm(value) {
  //   this.printForm$.next(value);
  // }

  getPvtLtdDeleteModalState() {
    return this.isModalOpen$.asObservable();
  }

  showModal() {
    this.isModalOpen$.next(true);
  }

  hideModal() {
    this.isModalOpen$.next(false);
  }

  getTradeEnlishmentData() {
    return this.tradeEnlishment$.asObservable();
  }

  setTradeEnlishmentData(rowNodeId) {
    this.tradeEnlishment$.next({ rowNodeId: rowNodeId });
  }

  getPvtLtdModalObservableData() {
    return this.pvtLtdModal$.asObservable();
  }

  setPvtDeleteModalData(data) {
    this.pvtLtdModal$.next(data);
  }

  getCartBuffer() {
    return this.bufferCartData.asObservable();
  }

  nextCart(dtstr: any) {
    this.bufferCartData.next(dtstr);
    console.log('Inside Service');
    console.log('FROM the next cart method: ', dtstr);
  }

  uploadTLdocs(docformdata) {
    var promise;
    promise = new Promise((resolve, reject) => {
      this.http
        .post(this.hostedFileURI, docformdata, {
          observe: 'response',
          responseType: 'json',
        })
        .toPromise()
        .then(
          (res) => {
            resolve(res.body);
          },
          (err) => {
            reject(err);
          }
        );
    });
    return promise;
  }

  getWardBind() {
    var promise;

    let body = {
      flag: 'getWard',
      spname: 'USP_TRADE_APPLICATION',
    };

    promise = new Promise((resolve, reject) => {
      this.http
        .post(this.hostedURI, body, {
          observe: 'response',
          responseType: 'json',
        })
        .toPromise()
        .then(
          (res) => {
            resolve(res.body);
          },
          (msg) => {
            reject(msg);
          }
        );
    });

    return promise;
  }

  // not used within trade_establishment
  getIDProffBind(User_Type) {
    var promise;

    let body = {
      flag: 'getIDProffBind',
      json: [{ User_Type: User_Type }],
      spname: 'USP_TRADE_APPLICATION',
    };

    promise = new Promise((resolve, reject) => {
      this.http
        .post(this.hostedURI, body, {
          observe: 'response',
          responseType: 'json',
        })
        .toPromise()
        .then(
          (res) => {
            resolve(res.body);
          },
          (msg) => {
            reject(msg);
          }
        );
    });

    return promise;
  }

  getRelationLandBind() {
    var promise;

    let body = {
      flag: 'getLandNature',
      spname: 'USP_TRADE_APPLICATION',
    };

    promise = new Promise((resolve, reject) => {
      this.http
        .post(this.hostedURI, body, {
          observe: 'response',
          responseType: 'json',
        })
        .toPromise()
        .then(
          (res) => {
            resolve(res.body);
          },
          (msg) => {
            reject(msg);
          }
        );
    });

    return promise;
  }
  getTradeType() {
    var promise;

    let body = {
      flag: 'getTradeType',
      spname: 'USP_TRADE_APPLICATION',
    };

    promise = new Promise((resolve, reject) => {
      this.http
        .post(this.hostedURI, body, {
          observe: 'response',
          responseType: 'json',
        })
        .toPromise()
        .then(
          (res) => {
            console.log('GET TRADE-TYPE MODIFIED: ', res.body);

            resolve(res.body);
          },
          (msg) => {
            reject(msg);
          }
        );
    });

    return promise;
  }
  getTradeNature() {
    var promise;

    let body = {
      flag: 'getTradeNature',
      spname: 'USP_TRADE_APPLICATION',
    };

    promise = new Promise((resolve, reject) => {
      this.http
        .post(this.hostedURI, body, {
          observe: 'response',
          responseType: 'json',
        })
        .toPromise()
        .then(
          (res) => {
            resolve(res.body);
          },
          (msg) => {
            reject(msg);
          }
        );
    });

    return promise;
  }

  getForFinalcial_yearBind() {
    var promise;

    let body = {
      flag: 'getFINYR',
      spname: 'USP_TRADE_APPLICATION',
    };

    promise = new Promise((resolve, reject) => {
      this.http
        .post(this.hostedURI, body, {
          observe: 'response',
          responseType: 'json',
        })
        .toPromise()
        .then(
          (res) => {
            resolve(res.body);
          },
          (msg) => {
            reject(msg);
          }
        );
    });

    return promise;
  }

  getTradeTypeBind(Trade_type) {
    var promise;

    let body = {
      flag: 'getIDProffBind',
      json: [{ User_Type: Trade_type }],
      spname: 'USP_TRADE_APPLICATION',
    };

    promise = new Promise((resolve, reject) => {
      this.http
        .post(this.hostedURI, body, {
          observe: 'response',
          responseType: 'json',
        })
        .toPromise()
        .then(
          (res) => {
            resolve(res.body);
          },
          (msg) => {
            reject(msg);
          }
        );
    });

    return promise;
  }

  // not used with trade_Esatblishment*
  getIDProof_NameBind(IDProof_Name) {
    var promise;

    let body = {
      flag: 'getIDProffBind',
      json: [{ User_Type: IDProof_Name }],
      spname: 'USP_TRADE_APPLICATION',
    };

    promise = new Promise((resolve, reject) => {
      this.http
        .post(this.hostedURI, body, {
          observe: 'response',
          responseType: 'json',
        })
        .toPromise()
        .then(
          (res) => {
            resolve(res.body);
          },
          (msg) => {
            reject(msg);
          }
        );
    });

    return promise;
  }

  getDocsTypeBind(value: string) {
    const body = {
      flag: 'getDoctypes',
      TL_Type: value,
      spname: 'USP_TRADE_APPLICATION',
    };

    return this.http.post(this.hostedURI, body, {
      observe: 'response',
      responseType: 'json',
    });
  }

  tradeInsert(
    jTLApp,
    jTLAppForm,
    jTLAppPayment,
    jTLAppFollowup,
    jTLAppTradeType,
    jTLAppOwner,
    jTlAppDocs,
    TL_ID,
    isRenew
  ) {
    var promise;
    try {
      // console.log(
      //   {
      //     jTLApp,
      //     jTLAppForm,
      //     jTLAppPayment,
      //     jTLAppFollowup,
      //     jTLAppTradeType,
      //     jTLAppOwner,
      //     jTlAppDocs,
      //     isRenew,
      //   },
      //   `service`
      // );
      // kindly ensure from arguments given at order
      // payload to be send with the post request to :: http://localhost:7071/api/insert_mul_json
      //
      let body = {
        flag: 'insertTL_Employee',
        jsonTLApp: jTLApp,
        jsonTLAppForm: jTLAppForm,
        jsonTLAppTradeType: jTLAppTradeType,
        jsonTLAppOwner: jTLAppOwner,
        jsonTLAppPaymentEmp: jTLAppPayment,
        jsonTLAppFollowupEmp: jTLAppFollowup,
        jsonTlAppDocs: jTlAppDocs,
        spname: 'USP_TRADE_APPLICATION_EMP',
        TL_ID,
      };

      if (isRenew) {
        body.flag = 'insertTL_EmployeeRenew';
        delete body.jsonTLApp;
      }

      console.log('body', body);
      promise = new Promise((resolve, reject) => {
        this.http
          .post(this.hostedURI, body, {
            observe: 'response',
            responseType: 'json',
          })
          .toPromise()
          .then(
            (res) => {
              // get response & when data comes right use getter so show those data within dashboard by subscribing
              // res.body's data will also be shown on printReports and dashboard component
              console.log('RESPONES FROM TRADE INSERT: ', res.body);
              sessionStorage.setItem('paymentForm', JSON.stringify(res.body));
              resolve(res.body);
            },
            (msg) => {
              reject(msg);
            }
          );
      });
    } catch (error) {
      //;
      console.log('Error from servoice', error);
    }

    return promise;
  }
  // recived license
  recieveLicesne(form_no) {
    const body = {
      flag: 'get_Print_Received',
      Form_No: form_no,
      spname: 'USP_TRADE_APPLICATION_EMP_PART2',
    };
    return this.http.post(this.hostedURI, body, {
      observe: 'response',
      responseType: 'json',
    });
  }
  // renew details by regn no:
  renewFormByRegnNo(regn_no) {
    const body = {
      flag: 'getTradeDetailsRenewSelect',
      regn_118: regn_no,
      spname: 'USP_TRADE_APPLICATION_EMP',
    };

    return this.http.post<any>(this.hostedURI, body, {
      observe: 'response',
      responseType: 'json',
    });
  }
  // know trade type and nature when renewing
  renewTradeTypeWithNature(regn_no) {
    const body = {
      flag: 'getTDRenewSelect_Nature_Of_Trade',
      regn_118: regn_no,
      spname: 'USP_TRADE_APPLICATION_EMP_PART2',
    };
    return this.http.post<any>(this.hostedURI, body, {
      observe: 'response',
      responseType: 'json',
    });
  }
  // renew owner detail and some extra by the same regn_no:
  renewOwenerByRegnNo(regn_no) {
    const body = {
      flag: 'getTDRenewSelect_Owner_Partner',
      regn_118: regn_no,
      spname: 'USP_TRADE_APPLICATION_EMP',
    };
    return this.http.post<any>(this.hostedURI, body, {
      observe: 'response',
      responseType: 'json',
    });
  }
  // renewSubmit() {} would be similar to tradeInsert with some modify
}
