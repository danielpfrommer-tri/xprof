import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {EmptyPageModule} from 'org_xprof/frontend/app/components/empty_page/empty_page_module';
import {MainPageModule} from 'org_xprof/frontend/app/components/main_page/main_page_module';
import {PipesModule} from 'org_xprof/frontend/app/pipes/pipes_module';
import {DataDispatcher} from 'org_xprof/frontend/app/services/data_dispatcher/data_dispatcher';
import {DataService} from 'org_xprof/frontend/app/services/data_service/data_service';
import {DATA_SERVICE_INTERFACE_TOKEN} from 'org_xprof/frontend/app/services/data_service_v2/data_service_v2_interface';
import {DataServiceV2} from 'org_xprof/frontend/app/services/data_service_v2/data_service_v2';
import {RootStoreModule} from 'org_xprof/frontend/app/store/store_module';

import {App} from './app';

/** The root component module. */
@NgModule({
  declarations: [App],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatProgressBarModule,
    EmptyPageModule,
    MainPageModule,
    BrowserAnimationsModule,
    PipesModule,
    RootStoreModule,
  ],
  providers: [
    DataDispatcher,
    DataService,
    {provide: DATA_SERVICE_INTERFACE_TOKEN, useClass: DataServiceV2},
  ],
  bootstrap: [App],
})
export class AppModule {
}
