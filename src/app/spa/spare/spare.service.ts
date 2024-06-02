

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, throwError } from 'rxjs';
import { BaseService } from "src/app/shared/base-service/base-service.component"; 
import { Constants } from "src/app/shared/constants/constants";
import { UntypedFormGroup } from "@angular/forms";

export interface Sparepart {

    spare_id?: Number,
    spare_name?: String,
    spare_price?: Number,
    quantity?: Number,
    sparetype_id?: Number,
    spareBal?: number,
    active?: number,
}

@Injectable({
    providedIn: 'root',
})
export class SparePartService {
   
    private apiUrl = Constants.ApiRoute.Route;
    constructor(
        private http: HttpClient,
        private baseService: BaseService,
    ) {}

    getMasterData(){
        return this.http.get<any>(this.apiUrl + 'spare/SpareMaster');
    }

    findSearchList(search : any){
        const filter: { [key: string]: any } = {};
        for (const key in search) {
          if (search.hasOwnProperty(key) && search[key] !== null) {
            filter[key] = search[key];
          }
        }
        return this.http.get<any[]>(this.apiUrl + 'spare/SpareList', { params: filter });
    }

    findSpareByKey(spareId : number) {
        return this.http.get<any>(`${this.apiUrl}spare/SpareDetail/${spareId}`);
    } 

    spareCheck(search : any){
        const filter: { [key: string]: any } = {};
        for (const key in search) {
          if (search.hasOwnProperty(key) && search[key] !== null) {
            filter[key] = search[key];
          }
        }
        return this.http.get<any>(this.apiUrl + 'spare/ValidateSpare', { params: filter });
    }

    save(sparePart: Sparepart, 
        sparePartForm: UntypedFormGroup
        ,action: string
        ) {
           const actionObj = {'action' : action};
           const dbTaskFormDTO = Object.assign({}, sparePart, sparePartForm, actionObj);
       if (dbTaskFormDTO.spare_id) {
           return this.http.put<any>(this.apiUrl + 'spare/EditSparePart', dbTaskFormDTO);
       } else {
           return this.http.post<any>(this.apiUrl + 'spare/CreateSparePart', dbTaskFormDTO);
       }
   }
}

