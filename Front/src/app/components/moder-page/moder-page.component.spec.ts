import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModerPageComponent } from './moder-page.component';

describe('ModerPageComponent', () => {
  let component: ModerPageComponent;
  let fixture: ComponentFixture<ModerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModerPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
