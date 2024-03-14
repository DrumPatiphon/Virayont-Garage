import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CusComponent } from './cus.component';

describe('CusComponent', () => {
  let component: CusComponent;
  let fixture: ComponentFixture<CusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
