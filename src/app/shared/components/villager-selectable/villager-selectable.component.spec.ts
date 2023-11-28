import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VillagerSelectableComponent } from './villager-selectable.component';

describe('VillagerSelectableComponent', () => {
  let component: VillagerSelectableComponent;
  let fixture: ComponentFixture<VillagerSelectableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VillagerSelectableComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VillagerSelectableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
