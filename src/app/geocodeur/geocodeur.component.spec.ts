import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeocodeurComponent } from './geocodeur.component';

describe('GeocodeurComponent', () => {
  let component: GeocodeurComponent;
  let fixture: ComponentFixture<GeocodeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeocodeurComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeocodeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
