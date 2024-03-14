
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, throwError } from 'rxjs';

export interface Employee {

    employee_id: Number,
    empfirst_name: String, 
    emplast_name: string,
    department_id: Number,
    empaddress: String,
    empphone_number: String,
    salary: Boolean,
    work_status: String,
    password: String,

}

@Injectable({
    providedIn: 'root',
})
export class ApiService {
   
    private apiUrl = 'https://localhost:7072/api/';

    

    
constructor(private http: HttpClient) {}


        getEmployee():Observable<Employee[]> {
        return this.http.get<Employee[]>('https://localhost:7072/api/Employee');
    }
}

