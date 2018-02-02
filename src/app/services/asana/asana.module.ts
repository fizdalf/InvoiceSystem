import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AsanaService} from './asana.service';
import {AsanaInterceptor} from './asana.interceptor';

@NgModule({
  imports: [
    HttpClientModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AsanaInterceptor, multi: true},
    AsanaService
  ]
})
export class AsanaModule {

}
