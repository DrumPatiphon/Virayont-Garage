import { Component, OnInit} from '@angular/core';
import { ApiService, Sparepart } from './api.service';
import { UntypedFormBuilder, UntypedFormGroup, Validator, Validators } from '@angular/forms';
import { FormUtilService } from 'src/app/service/form-util-service';
import { faBarsStaggered,faSearch,faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-spare',
  templateUrl: './spare.component.html',
  styleUrls: ['./spare.component.css']
})
export class SpareComponent implements OnInit {
  
  deleteall = faBarsStaggered
  search = faSearch
  add = faPlus

  Spareform! : UntypedFormGroup;

  constructor ( 
    private fb : UntypedFormBuilder,
    private Spa : ApiService,
    // private util : FormUtilService
) {}

    

Sparepart: Sparepart [] = [] ;

  ngOnInit(): void {
     
    // this.Spa.getSpare().subscribe((data) =>{ 
    //   console.log(data)
    //   this.Sparepart = data;
    // })
    // console.log(this.Spareform)


    this.createForm();
    // this.Spa.getSpare().subscribe((data) =>{
    // this.Sparepart = data;
    // this.Spareform.controls['spare_id'].setValue(data[0].spare_id )
    // this.Spareform.controls['spare_name '].setValue(data[0].spare_name )
    // this.Spareform.controls['spare_price '].setValue(data[0].spare_price )
    // this.Spareform.controls['quantity '].setValue(data[0].quantity )
    // this.Spareform.controls['sparetype_id '].setValue(data[0].sparetype_id )
    
    
    // })
    
  }

  createForm() {
    this.Spareform = this.fb.group({
      spare_id: null,
      spare_name: [null, [Validators.required]], 
      spare_price: null,
      quantity: null,
      sparetype_id: null,
    });
  }

  save(){
    // const form : UntypedFormGroup = this.Spareform
    // if(this.util.isFormGroupsValid([form])){
    //   //implement Save
    // }else{
    //   // warnning message (keyword: message service)
    // }
  }

  
}
