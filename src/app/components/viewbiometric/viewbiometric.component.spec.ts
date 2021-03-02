import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewbiometricComponent } from './viewbiometric.component';

describe('ViewbiometricComponent', () => {
  let component: ViewbiometricComponent;
  let fixture: ComponentFixture<ViewbiometricComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewbiometricComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewbiometricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
