import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TobereadComponent } from './toberead.component';

describe('TobereadComponent', () => {
  let component: TobereadComponent;
  let fixture: ComponentFixture<TobereadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TobereadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TobereadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
