import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {TmetricInterceptor} from './tmetric.interceptor';
import {TmetricService} from './tmetric.service';

@NgModule({
  imports: [
    HttpClientModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: TmetricInterceptor, multi: true},
    TmetricService
  ]
})
export class TmetricModule {

}
