import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModerComponent } from './add-moder.component';

describe('AddModerComponent', () => {
  let component: AddModerComponent;
  let fixture: ComponentFixture<AddModerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddModerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddModerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
