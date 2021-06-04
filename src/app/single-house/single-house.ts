import {Component, Input} from '@angular/core';
import { House } from '../models/house.model';
import { HouseListComponent } from '../house-list/house-list.component';

@Component({
  selector: 'ngbd-nav-keep',
  templateUrl: './single-house.html',
  styleUrls: ['./single-house.css']
})



export class SingleHouse {

  constructor(public HouseListComponent: HouseListComponent) {

  }

  active = 1;
  showOverlordPlaceholder = true;
  showCadetsPlaceholder = true;

  @Input() selectedHouse: House = {name: '', url: ''};
  @Input() overlord: House = {name: '', url: ''};
  @Input() cadetBranches: Array<House> = [{name: '', url: ''}];
  @Input() pageNum: number = 1;

  ngOnInit() {
  }

  ngOnChanges() {
  }

  public showTab(tabNum: number) {
    this.active = tabNum;
    switch (this.active) {
      case 2:
        this.showOverlordPlaceholder = false;
        this.showCadetsPlaceholder = true;
        break;
      case 3:
        this.showCadetsPlaceholder = false;
        this.showOverlordPlaceholder = true;
        break;
      default:
        console.log(this.active);
        this.showCadetsPlaceholder = true;
        this.showOverlordPlaceholder = true;
        break;
    }
  }
  
}
