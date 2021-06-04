import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SingleHouse } from './single-house';

@NgModule({
  imports: [BrowserModule, NgbModule],
  declarations: [SingleHouse],
  exports: [SingleHouse],
  bootstrap: [SingleHouse]
})
export class SingleHouseModule {
}
