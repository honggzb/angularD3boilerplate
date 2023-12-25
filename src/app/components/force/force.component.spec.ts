import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForceComponent } from './force.component';

describe('ForceComponent', () => {
  let component: ForceComponent;
  let fixture: ComponentFixture<ForceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ForceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
