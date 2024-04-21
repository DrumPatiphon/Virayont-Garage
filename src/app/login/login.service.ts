
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, throwError } from 'rxjs';
import { BaseService } from "src/app/shared/base-service/base-service.component"; 
import { Constants } from "src/app/shared/constants/constants";
import { UntypedFormGroup } from "@angular/forms";

export interface User {
    userId : number;
    userRole : string;
    phoneNumber: string;
    taskPhone : string;
}

@Injectable({
    providedIn: 'root',
})
export class LoninService {
   
    private apiUrl = Constants.ApiRoute.Route;
    constructor(
        private http: HttpClient,
        private baseService: BaseService,
    ) {}

    login(search : any){
        const filter: { [key: string]: any } = {};
        for (const key in search) {
          if (search.hasOwnProperty(key) && search[key] !== null) {
            filter[key] = search[key];
          }
        }
        return this.http.get<any[]>(this.apiUrl + 'Login', { params: filter });
    }
}

