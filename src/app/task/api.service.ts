
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, throwError } from 'rxjs';

export interface Spare4Task {

    detail_id: Number,
    task_id: Number,
    spare_id: Number,    
}

export interface Dbtask {

    task_id: Number,
    vehicle_id: Number,
    date: Date,    
    price: Number,
    employee_id: Number,    
    Detail: string,
    appointment: Date,
    Repair_Status1: Boolean,    
    Repair_Status2: Boolean,
    Repair_Status3: Boolean,
    all_complete: Boolean,
        
}

export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
  }

@Injectable({
    providedIn: 'root',
})
export class ApiService {
   
private apiUrl = 'https://localhost:7072/api/';

constructor(private http: HttpClient) {}

    getSparetask():Observable<Spare4Task[]> {
    return this.http.get<Spare4Task[]>('https://localhost:7072/api/Spare4Task');
    }

    getDbtask():Observable<Dbtask []> {
    return this.http.get<Dbtask[]>('https://localhost:7072/api/Dbtask ');
    }

    
    




}

