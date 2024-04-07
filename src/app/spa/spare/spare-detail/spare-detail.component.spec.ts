import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpareDetailComponent } from './spare-detail.component';

describe('SpareDetailComponent', () => {
  let component: SpareDetailComponent;
  let fixture: ComponentFixture<SpareDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpareDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpareDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
