import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CusPdetailComponent } from './cus-pdetail.component';

describe('CusPdetailComponent', () => {
  let component: CusPdetailComponent;
  let fixture: ComponentFixture<CusPdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CusPdetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CusPdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
