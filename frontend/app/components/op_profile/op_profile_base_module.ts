import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';

import {OpProfileBase} from './op_profile_base';
import {OpTableModule} from './op_table/op_table_module';

/** An op profile module. */
@NgModule({
  declarations: [OpProfileBase],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    OpTableModule,
    MatIconModule,
    MatTooltipModule,
    MatSidenavModule,
    CommonModule,
  ],
  exports: [OpProfileBase]
})
export class OpProfileBaseModule {
}
