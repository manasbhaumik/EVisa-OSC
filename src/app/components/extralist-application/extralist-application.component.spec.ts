import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtralistApplicationComponent } from './extralist-application.component';

describe('ExtralistApplicationComponent', () => {
  let component: ExtralistApplicationComponent;
  let fixture: ComponentFixture<ExtralistApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtralistApplicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtralistApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
