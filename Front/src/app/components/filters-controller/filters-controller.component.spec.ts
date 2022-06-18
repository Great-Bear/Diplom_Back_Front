import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersControllerComponent } from './filters-controller.component';

describe('FiltersControllerComponent', () => {
  let component: FiltersControllerComponent;
  let fixture: ComponentFixture<FiltersControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiltersControllerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
