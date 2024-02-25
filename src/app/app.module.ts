import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientProvider } from './core/services/http/http-client.provider copy';
import { HttpClientWebProvider } from './core/services/http/http-client-web.provider';
import { ApiService } from './core/services/api/api.service';
import { JwtService } from './core/services/api/strapi/jwt.service';
import { DataService } from './core/services/api/strapi/data.service';
import { StrapiDataService } from './core/services/api/strapi/strapi-data.service';
import { SharedModule } from './shared/shared.module';
import { AuthService } from './core/services/api/strapi/auth.service';
import { AuthStrapiService } from './core/services/api/strapi/auth-strapi.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader } from './core/services/custom-translate.service';
import { FirebaseService } from './core/services/firebase/firebase.service';
import { FirebaseAuthService } from './core/services/api/firebase/firebase-auth.service';
import { environment } from 'src/environments/environment';


export function httpProviderFactory(
  http: HttpClient) {
  return new HttpClientWebProvider(http);
}
/*
export function DataServiceFactory(
  backend: string,
  api: ApiService,
  firebase: FirebaseService) {
  switch (backend) {
    case 'Strapi':
      return new StrapiDataService(api);
    case 'Firebase':
      return new FirebaseAuthService(firebase);
    default:
      throw new Error("Not implemented");
  }
}
*/
export function AuthServiceFactory(
  backend: string,
  jwt: JwtService,
  api: ApiService,
  firebase: FirebaseService
) {
  switch (backend) {
    case 'Strapi':
      return new AuthStrapiService(jwt, api);
    case 'Firebase':
      return new FirebaseAuthService(firebase);
    default:
      throw new Error("Not implemented");
  }
}

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }), SharedModule],
  providers: [
    {
      provide: 'firebase-config',
      useValue: environment.firebase
    },
    {
      provide: 'backend',
      useValue: 'Firebase'
    },
    {
      provide: 'home',
      useValue: '/home'
    },
    {
      provide: 'login',
      useValue: '/login'
    },
    {
      provide: 'afterLogin',
      useValue: '/home'
    },
    {
      provide: AuthService,
      deps: ['backend', JwtService, ApiService, FirebaseService],
      useFactory: AuthServiceFactory,
    },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HttpClientProvider,
      deps: [HttpClient, Platform],
      useFactory: httpProviderFactory,
    },
    /* {
      provide: DataService,
      deps: ['backend', ApiService],
      useFactory: DataServiceFactory,
    }*/
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
