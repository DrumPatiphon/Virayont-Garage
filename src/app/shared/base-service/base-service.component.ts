import { Component, Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-base-service',
  templateUrl: './base-service.component.html',
  styleUrls: ['./base-service.component.css']
})

export class BaseList {
  rowState: string;
  form?: UntypedFormGroup;
  constructor() {
      this.rowState = 'Add';
  }
}

@Injectable({ providedIn: 'root' })
export class BaseService {
    public prepareSaveList(details: BaseList[], detailsDelete: BaseList[]): any[] {
        details = details.filter(item => item.rowState !== 'Normal')
            .map(({ ...prop }) => {
                try {
                    Object.assign(prop, prop.form?.getRawValue());
                    delete prop.form;
                }
                catch(err){}
                return prop;
            }).concat(detailsDelete.map(({ form, ...prop }) => {prop.rowState = 'Delete'; return prop;}));
        return details;
    }
}
