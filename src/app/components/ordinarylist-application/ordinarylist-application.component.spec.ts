import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdinarylistApplicationComponent } from './ordinarylist-application.component';

describe('OrdinarylistApplicationComponent', () => {
  let component: OrdinarylistApplicationComponent;
  let fixture: ComponentFixture<OrdinarylistApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdinarylistApplicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdinarylistApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
