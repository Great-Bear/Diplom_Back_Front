import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModersComponent } from './moders.component';

describe('ModersComponent', () => {
  let component: ModersComponent;
  let fixture: ComponentFixture<ModersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
