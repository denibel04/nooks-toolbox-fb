import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientProvider } from './core/services/http/http-client.provider';
import { HttpClientWebProvider } from './core/services/http/http-client-web.provider';
import { ApiService } from './core/services/api/api.service';
import { JwtService } from './core/services/jwt.service';
import { DataService } from './core/services/api/strapi/data.service';
import { StrapiDataService } from './core/services/api/strapi/strapi-data.service';

export function httpProviderFactory(
  http:HttpClient) {
  return new HttpClientWebProvider(http);
}
export function DataServiceFactory(
  api:ApiService){
    return new StrapiDataService(api);
} 

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HttpClientProvider,
      deps: [HttpClient, Platform],
      useFactory: httpProviderFactory,  
    },
    {
      provide: DataService,
      deps: [ApiService],
      useFactory: DataServiceFactory,  
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
