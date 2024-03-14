import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CusDetailComponent } from './cus-detail.component';

describe('CusDetailComponent', () => {
  let component: CusDetailComponent;
  let fixture: ComponentFixture<CusDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CusDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CusDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
