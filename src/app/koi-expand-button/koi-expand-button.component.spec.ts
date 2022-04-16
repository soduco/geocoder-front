import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KoiExpandButtonComponent } from './koi-expand-button.component';

describe('KoiExpandButtonComponent', () => {
  let component: KoiExpandButtonComponent;
  let fixture: ComponentFixture<KoiExpandButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KoiExpandButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KoiExpandButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
