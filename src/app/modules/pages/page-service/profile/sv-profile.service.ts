import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Iuser } from 'src/app/modules/auth/models/iuser';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SvProfileService {
  apiRoot: string = 'http://localhost:7071/api/';
  hostedURI: string =
    'https://empltest.azurewebsites.net/api/insert_mul_json?code=QLDzt7NeLwTAOVXopBQIx/Nm3Go0H2JlZqel54uPWS3/Ha5r2LPQ8A==';
  constructor(private http: HttpClient) {}

  // not used
  getIDProffBind(User_Type) {
    var promise;

    let body = {
      flag: 'getIDProffBind',
      json: [{ User_Type: User_Type }],
      spname: 'USP_LOGIN',
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
  // not so neccessary here
  getUserProfile(userEmail) {
    var promise;

    let body = {
      flag: 'getProfile',
      json: [{ email: userEmail }],
      spname: 'USP_LOGIN',
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

  updateProfile(userObj: Iuser) {
    var promise;

    let body = {
      flag: 'updateProfile',
      json: [
        {
          dob: userObj.DOB,
          Gender: userObj.Gender,
          Road_Name: userObj.Road_Name,
          Locality_Name: userObj.Locality_Name,
          District: userObj.District,
          State: userObj.State,
          Pin_Code: userObj.Pin_Code,
          IDProof_Name: userObj.IDProof_Name,
          IDProof_Number: userObj.IDProof_Number,
          IDProofFile_Path: userObj.IDProofFile_Path,
          email: userObj.EmailId,
        },
      ],
      spname: 'USP_LOGIN',
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

  // before nextForward whether or not request to empoyee
  shouldForwardToNextEmployee(tl_id, next_user) {
    const body = {
      flag: 'getForward_Employee',
      TL_Form_Id: tl_id,
      User_Id: next_user,
      spname: 'USP_TRADE_APPLICATION_EMP',
    };
    return this.http.post(this.hostedURI, body, {
      observe: 'response',
      responseType: 'json',
    });
  }
  // before nextForward whether or not request to empoyee
  shouldForwardTocitizen(tl_id: number, userId) {
    const body = {
      flag: 'getForward_Cityzen',
      TL_Form_Id: tl_id,
      User_Id: userId,
      spname: 'USP_TRADE_APPLICATION_EMP',
    };
    return this.http.post(this.hostedURI, body, {
      observe: 'response',
      responseType: 'json',
    });
  }
  // based on forward status, uid, tl_form_id, userId, remarks,
  nextForward(
    fwStatus,
    tl_id,
    uid,
    remarks,
    ecitizen = 0,
    userMail,
    statusToBeSent,
    nextUserId,
    nextEcitizenId
  ) {
    const body = {
      flag: 'Insert_Update_Followup',
      Forward_Status: fwStatus,
      TL_Form_Id: tl_id,
      User_ID: uid,
      Remarks: remarks,
      E_Cityzen_ID: ecitizen,
      Followup_Date: '2021-01-27',
      User_Name: userMail,
      Status_Id: statusToBeSent,
      Next_User_Id: nextUserId,
      Next_E_Cityzen_ID: nextEcitizenId,
      spname: 'USP_TRADE_APPLICATION_EMP',
    };
    return this.http.post(this.hostedURI, body, {
      observe: 'response',
      responseType: 'json',
    });
  }
  // based on loggedIn user's email it would sent list of forms
  formDetailsActivityByUser(userIdOrUserEmail: string) {
    const body = {
      flag: 'getActivity',
      User_Name: userIdOrUserEmail,
      spname: 'USP_TRADE_APPLICATION_EMP',
    };
    // to be subscribed elsewhere it should be return  observable
    return this.http.post(this.hostedURI, body, {
      observe: 'response',
      responseType: 'json',
    });
  }

  formDetailsPaymentPendingByUser(userIdOrUserEmail: string) {
    const body = {
      flag: 'PAYMENT_PENDING',
      User_Name: userIdOrUserEmail,
      spname: 'USP_TRADE_APPLICATION_EMP_PART2',
    };
    // to be subscribed elsewhere it should be return  observable
    return this.http.post(this.hostedURI, body, {
      observe: 'response',
      responseType: 'json',
    });
  }


  // formdetilsacitivty  same as getactivity
  fomDetailsActivityWithJustView(userIdOrUserEmail: string) {
    const body = {
      flag: 'My_Team_Activity',
      User_Name: userIdOrUserEmail,
      spname: 'USP_TRADE_APPLICATION_EMP_PART2',
    };
    return this.http.post(this.hostedURI, body, {
      observe: 'response',
      responseType: 'json',
    });
  }

  // just need the formNo to get that form's details
  formDetailsByFormNo(formNo: string) {
    const body = {
      flag: 'getTradeDetails',
      Form_No: formNo,
      spname: 'USP_TRADE_APPLICATION_EMP',
    };
    // to be subscribed elsewhere it should return an observable
    return this.http.post(this.hostedURI, body, {
      observe: 'response',
      responseType: 'json',
    });
  }

  // list of documant names with their id
  formListDocs() {
    const body = {
      flag: 'getDoctypes',
      spname: 'USP_TRADE_APPLICATION',
    };
    return this.http.post(this.hostedURI, body, {
      observe: 'response',
      responseType: 'json',
    });
  }

  // based on formNo get the list of images
  formImagesByFormNo(formNo) {
    const body = {
      flag: 'getDocumentDetials',
      Form_No: formNo,
      spname: 'USP_TRADE_APPLICATION_EMP',
    };

    return this.http.post(this.hostedURI, body, {
      observe: 'response',
      responseType: 'json',
    });
  }
  // know type of use filled the form by form no
  knowUserNameViaFormNo(formNo) {
    const body = {
      flag: 'GET_TL_Empl',
      Form_No: formNo,
      spname: 'USP_TRADE_APPLICATION_EMP',
    };

    return this.http.post(this.hostedURI, body, {
      observe: 'response',
      responseType: 'json',
    });
  }
  // next employee to be forwared (with userid it may need tl_id later)
  nextEmployeetoBeForwared(userId: number) {
    const body = {
      flag: 'get_application_followupForward',
      User_ID: userId,
      spname: 'USP_TRADE_APPLICATION_EMP',
    };
    return this.http.post(this.hostedURI, body, {
      observe: 'response',
      responseType: 'json',
    });
  }

  formTradeType(formTl) {
    const body = {
      flag: 'get_TradetypeDetails',
      app_TL_ID: formTl,
      spname: 'USP_TRADE_APPLICATION_EMP',
    };
    console.log('from service: ', formTl);

    return this.http.post(this.hostedURI, body, {
      observe: 'response',
      responseType: 'json',
    });
  }

  formTradeFollupDetails(formTl) {
    const body = {
      flag: 'get_application_followup',
      TL_Form_Id: formTl,
      spname: 'USP_TRADE_APPLICATION_EMP',
    };

    console.log('service followup: ', formTl);

    return this.http.post(this.hostedURI, body, {
      observe: 'response',
      responseType: 'json',
    });
  }
}
