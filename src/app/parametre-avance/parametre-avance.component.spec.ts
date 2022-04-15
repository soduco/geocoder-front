import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametreAvanceComponent } from './parametre-avance.component';

describe('ParametreAvanceComponent', () => {
  let component: ParametreAvanceComponent;
  let fixture: ComponentFixture<ParametreAvanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParametreAvanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametreAvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
