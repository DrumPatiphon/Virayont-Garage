import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpPdetailComponent } from './emp-pdetail.component';

describe('EmpPdetailComponent', () => {
  let component: EmpPdetailComponent;
  let fixture: ComponentFixture<EmpPdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpPdetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpPdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
