import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import { SparePartService, Sparepart } from './spare.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

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
  masterData = {
    spareType:[] = [],
  }

  constructor ( 
    private fb : UntypedFormBuilder,
    private route: ActivatedRoute,
    private router : Router,
    private se : SparePartService,
  ) {}

  ngOnInit(): void {
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
      spare_str_id: "AUTO",
      spare_name: null,
      spare_price: null,
      quantity: null,
      sparetype_id: null,
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
        });
      }
    }else{

    }
    this.sparePartForm.markAsPristine();
  }

      
  installEvent(){

  }

  save(action: string) { 
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
      if(this.spareId){
        this.rebuildForm();
      }else{
        this.router.navigate(['/spare']);
      }
    });
  }

  delete(action: string){
    const qty = this.sparePartForm.controls['quantity'].value == "" ? null : this.sparePartForm.controls['quantity'].value
    this.sparePartForm.controls['quantity'].setValue(qty);
    this.se.save(this.sparePart,
                 this.sparePartForm.getRawValue(),
                 action,
    ).subscribe(res => {
      if(res){
        this.router.navigate(['/spare']);
      }
    })

  }


}

