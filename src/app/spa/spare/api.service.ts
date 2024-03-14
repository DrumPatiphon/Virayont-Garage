

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, throwError } from 'rxjs';

export interface Sparepart {

    spare_id: Number,
    spare_name: String,
    spare_price: Number,
    quantity: Number,
    sparetype_id: Number
}

@Injectable({
    providedIn: 'root',
})
export class ApiService {
   
    private apiUrl = 'https://localhost:7072/api/';

    

    
constructor(private http: HttpClient) {}


        getSpare():Observable<Sparepart[]> {
        return this.http.get<Sparepart[]>('https://localhost:7072/api/Spare_part');
    }
}

