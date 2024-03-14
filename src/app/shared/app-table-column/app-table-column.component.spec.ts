import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTableColumnComponent } from './app-table-column.component';

describe('AppTableColumnComponent', () => {
  let component: AppTableColumnComponent;
  let fixture: ComponentFixture<AppTableColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppTableColumnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppTableColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
