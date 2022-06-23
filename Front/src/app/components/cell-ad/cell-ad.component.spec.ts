import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellAdComponent } from './cell-ad.component';

describe('CellAdComponent', () => {
  let component: CellAdComponent;
  let fixture: ComponentFixture<CellAdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CellAdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CellAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
