import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import { SparePartService, Sparepart } from './spare.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UserData } from '../task/api.service';
import { CustomValidators } from 'src/app/shared/Validators/custom.validators';

@Component({
  selector: 'app-spare-detail',
  templateUrl: './spare-detail.component.html',
  styleUrls: ['./spare.component.css']
})
export class SpareDetailComponent implements OnInit {

  saveIcon = faSave
  deleteIcon = faTrash

  sparePartForm! : FormGroup;
  sparePart : Sparepart = {} as Sparepart;
  spareId: number | null = null;
  user: UserData = {} as UserData;
  masterData = {
    spareType:[] = [],
  }
  bufferSpareQty:number = 0;
  bufferSparebal:number = 0;

  constructor ( 
    private fb : UntypedFormBuilder,
    private route: ActivatedRoute,
    private router : Router,
    private se : SparePartService,
    private authService: AuthService,
    private ms: ToastrService,
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if(!this.user || this.user.userRole == 'customer'){
      this.router.navigate(['/login']);
    }
    const spareIdParam = this.route.snapshot.paramMap.get('spareId');
    this.spareId = spareIdParam ? +spareIdParam : null;
    this.se.getMasterData().subscribe({
      next: (response: any) => {
        this.masterData = response;
      },
      error: (error: any) => {
        console.error('Error:', error);
      }
    });
    this.createForm();
    this.rebuildForm();
    this.installEvent();
  }

  createForm() {
    this.sparePartForm = this.fb.group({
      spare_id: null,
      spare_str_id: [{value : "AUTO", disabled: true}],
      spare_name: [null,[Validators.required]],
      spare_price: [null,[CustomValidators.numberOnly()]],
      quantity: [null,[Validators.required, CustomValidators.numberOnly()]],
      sparetype_id: [null,[Validators.required]],
      spare_bal: [{value : null, disabled: true}],  
      active: true,  
    });
  }

  rebuildForm(): void{
    console.log("spareId :",this.spareId)
    if(this.spareId){
      const controls = this.sparePartForm.controls
      if(this.sparePart){
        this.se.findSpareByKey(this.spareId).subscribe(res => {
          this.sparePart = res
          this.sparePartForm.patchValue(this.sparePart, { emitEvent: false });
          this.sparePartForm.controls['spare_str_id'].setValue(this.sparePart.spare_id?.toString());
          this.bufferSpareQty = this.sparePartForm.controls['quantity'].value;
          this.bufferSparebal = this.sparePartForm.controls['spare_bal'].value;
        });
      }
    }else{

    }
    this.sparePartForm.markAsPristine();
  }

      
  installEvent(){
    this.sparePartForm.controls['quantity'].valueChanges.subscribe(quantity =>{
      const controls = this.sparePartForm.controls
      if(this.sparePartForm.controls['quantity'].dirty && quantity){
        const newQuantity = quantity - this.bufferSpareQty
        const newBal = this.bufferSparebal + newQuantity
        controls['spare_bal'].setValue(newBal)
      }
    });
  }

  save(action: string) { 
    if(this.isFormValid(this.sparePartForm) && this.validateSpareQty()){
      const qty = this.sparePartForm.controls['quantity'].value == "" ? null : this.sparePartForm.controls['quantity'].value
      this.sparePartForm.controls['quantity'].setValue(qty);
      this.se.save(this.sparePart,
                   this.sparePartForm.getRawValue(),
                   action,
        )
        .pipe(
        switchMap(result => this.se.findSpareByKey(result))
      ).subscribe((result: any) => {
        this.sparePart = result;
        this.spareId = result.spare_id;
        this.rebuildForm();
      });
      this.ms.success('บันทึกสำเร็จ');
    }
  }

  IsAuto():boolean{
    let disable = false;
    if(this.sparePartForm.controls['spare_str_id'].value == 'AUTO'){
      disable = true;
    }
    return disable;
  }

  delete(action: string){
    const qty = this.sparePartForm.controls['quantity'].value == "" ? null : this.sparePartForm.controls['quantity'].value
    this.sparePartForm.controls['quantity'].setValue(qty);
    this.se.save(this.sparePart,
                 this.sparePartForm.getRawValue(),  
                 action,
    ).subscribe(res => {
      if(res){
        this.ms.success('ลบข้อมูลสำเร็จ');
        this.router.navigate(['/spare']);
      }
    })
  }

  isFormValid(formGroup: FormGroup): boolean {
    let isValid = true;

    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup) {
        if (!this.isFormValid(control)) {
          isValid = false;
        }
      } else {
        control.markAsTouched();
        if (control.invalid) {
          isValid = false;
        }
      }
    });

    if(!isValid){
      this.ms.error('กรุณาตรวจสอบข้อมูลให้ถูกต้อง');
    }

    return isValid;
  }
  

  isInvalid(controlName: string){
    const control = this.sparePartForm.get(controlName);
    return control ? control.touched && control.invalid : false;
  }

  async ValidateSpare(){
    if(this.isFormValid(this.sparePartForm) && this.validateSpareQty()){
      const param = {
        spareId : this.sparePartForm.controls['spare_str_id'].value,
      }
      try {
        const res = await this.se.spareCheck(param).toPromise()
        if(res){
          this.ms.error('ไม่สามารถลบข้อมูลได้ เนื่องจากยังมีการใช้งานอะไหล่นี้อยู่ในระบบ');
        }
        else{
          this.delete('Delete');
        }
        return res;
      } catch (error) {
        this.ms.error('เกิดข้อผิดพลาดกรุณาติดต่อผู้ดูแลระบบ');  
      }
    }
  }

  validateSpareQty() :boolean{
      const controls = this.sparePartForm.controls
      const spareBal = controls['spare_bal'].value

      if (spareBal < 0){
        this.ms.warning("ไม่สามารถบันทึก เนื่องจากจำนวนคงเหลือเป็นลบ")
        return false;
      }
    return true;
  }


}

