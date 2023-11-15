import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientProvider } from './core/services/http-client.provider';
import { HttpClientWebProvider } from './core/services/http-client-web.provider';
import { ApiService } from './core/services/api.service';
import { JwtService } from './core/services/jwt.service';

export function httpProviderFactory(
  http:HttpClient) {
  return new HttpClientWebProvider(http);
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
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
