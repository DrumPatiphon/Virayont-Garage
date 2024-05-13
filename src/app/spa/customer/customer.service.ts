
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, throwError } from 'rxjs';
import { BaseService } from "src/app/shared/base-service/base-service.component"; 
import { Constants } from "src/app/shared/constants/constants";
import { UntypedFormGroup } from "@angular/forms";

export interface Customer {

    address?: string;
    company_name?: string;
    customer_id?: number;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    active?: string;
}

@Injectable({
    providedIn: 'root',
})
export class CustomerService {
   
    private apiUrl = Constants.ApiRoute.Route;
    constructor(
        private http: HttpClient,
        private baseService: BaseService,
    ) {}

    getMasterData(){
        return this.http.get<any>(this.apiUrl + 'cus/CustomerMaster');
    }

    findSearchList(search : any){
        const filter: { [key: string]: any } = {};
        for (const key in search) {
          if (search.hasOwnProperty(key) && search[key] !== null) {
            filter[key] = search[key];
          }
        }
        return this.http.get<any[]>(this.apiUrl + 'cus/CustomerList', { params: filter });
    }

    findCusByKey(customerId : number) {
        return this.http.get<any>(`${this.apiUrl}cus/CustomerDetail/${customerId}`);
    } 

    save(customer: Customer, 
        customerForm: UntypedFormGroup
        ,action: string
        ) {
           const actionObj = {'action' : action};
           const dbTaskFormDTO = Object.assign({}, customer, customerForm, actionObj);
       if (dbTaskFormDTO.customer_id) {
           return this.http.put<any>(this.apiUrl + 'cus/EditCustomer', dbTaskFormDTO);
       } else {
           return this.http.post<any>(this.apiUrl + 'cus/CreateCustomer', dbTaskFormDTO);
       }
   }
}

