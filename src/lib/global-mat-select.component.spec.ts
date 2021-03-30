import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalMatSelectComponent } from './global-mat-select.component';

describe('GlobalMatSearchComponent', () => {
  let component: GlobalMatSelectComponent;
  let fixture: ComponentFixture<GlobalMatSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalMatSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalMatSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
