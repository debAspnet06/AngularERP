import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AsyncValidator, FormControl } from '@angular/forms';

@Injectable({ providedIn: 'root' })

// since httpclient service it has to use dependecnly injection, for that @injectable needed here
// to inject the instance of this within another component or to make avaibale to any component within this module, providein: 'root'
export class IsRegnExist implements AsyncValidator {
  rootUrl =
    'https://empltest.azurewebsites.net/api/insert_mul_json?code=QLDzt7NeLwTAOVXopBQIx/Nm3Go0H2JlZqel54uPWS3/Ha5r2LPQ8A==';

  constructor(private http: HttpClient) {}

  validate = (control: FormControl) => {
    const { value } = control;
    console.log('logged from the validator: ', value);
    // const body = {
    //   flag: 'getTradeDetailsRenewSelect',
    //   regn_118: value,
    //   spname: 'USP_TRADE_APPLICATION_EMP',
    // };

    // return this.http.post<any>(this.rootUrl, body, {
    //   observe: 'response',
    //   responseType: 'json',
    // });
    return null;
  };
}
