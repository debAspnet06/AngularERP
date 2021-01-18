import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as bcrypt from 'bcryptjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SvLoginService {
  apiRoot: string = 'http://localhost:7071/api/';
  hostedURI: string =
    'https://empltest.azurewebsites.net/api/insert_mul_json?code=QLDzt7NeLwTAOVXopBQIx/Nm3Go0H2JlZqel54uPWS3/Ha5r2LPQ8A==';
  constructor(private http: HttpClient) {}

  validateUser(username: string, passs: string) {
    let promise;

    // payload to be sent with this post request
    let body = {
      flag: 'EMP_signin',
      json: [{ username: username, password: passs }],
      spname: 'USP_LOGIN',
    };

    // angular httpclient by default returns obserable so toPromise() used to convert it back to promise as needed
    // whether its from observable, or a new promise. to get value outta promise then/catch or try catch used
    promise = new Promise((resolve, reject) => {
      this.http
        .post(this.hostedURI, body, {
          observe: 'response',
          responseType: 'json',
        })
        .pipe(delay(200))
        .toPromise()
        .then(
          (res) => {
            console.log('RES from sv-login: ', res.body);
            resolve(res.body);
          },
          (msg) => {
            reject(msg);
          }
        );
    });

    return promise;
  }

  isUserLoggedIn() {
    let user = sessionStorage.getItem('username');
    // keep the result from within a BS so whenever its value change (true/false) that will emitted to all subscribers
    return !(user === null); // true
  }

  logOut() {
    sessionStorage.clear();
    // sessionStorage.removeItem('username');
    // sessionStorage.removeItem('paymentForm');
  }
}
