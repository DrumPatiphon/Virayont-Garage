// import { Injectable } from "@angular/core";
// import { HttpClient } from "@angular/common/http";
// import { Observable } from "rxjs";


// export interface Customer {
    
// }



// @Injectable({
//     providedIn: 'root',
// })

// export class ApiService {
//     private apiUrl = 'https://localhost:7072/api/ ';

//     constructor(private http: HttpClient) {}

//     getCustomer(){
//         return this.http.get<any>('https://localhost:7072/api/Customer')
//     }










// }
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, throwError } from 'rxjs';

export interface Customer {

    address: string;
    company_name: string;
    customer_id: number;
    first_name: string;
    last_name: string;
    phone_number: string;

}

@Injectable({
    providedIn: 'root',
})
export class ApiService {
   
    private apiUrl = 'https://localhost:7072/api/';

    

    
constructor(private http: HttpClient) {}

    

        getCustomer():Observable<Customer[]> {
        return this.http.get<Customer[]>('https://localhost:7072/api/Customer');
    }
}

