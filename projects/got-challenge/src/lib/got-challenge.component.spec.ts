import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GotChallengeComponent } from './got-challenge.component';

describe('GotChallengeComponent', () => {
  let component: GotChallengeComponent;
  let fixture: ComponentFixture<GotChallengeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GotChallengeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GotChallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
