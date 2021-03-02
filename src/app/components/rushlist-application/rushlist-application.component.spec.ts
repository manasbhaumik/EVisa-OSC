import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RushlistApplicationComponent } from './rushlist-application.component';

describe('RushlistApplicationComponent', () => {
  let component: RushlistApplicationComponent;
  let fixture: ComponentFixture<RushlistApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RushlistApplicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RushlistApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
