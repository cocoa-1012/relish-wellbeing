import { FormsModule } from '@angular/forms';
import { MbscModule } from '@mobiscroll/angular';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Network } from '@ionic-native/network/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import * as Sentry from "@sentry/capacitor";
import * as SentryAngular from "@sentry/angular";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { AppVersion } from '@ionic-native/app-version/ngx';

Sentry.init(
  {
    dsn: "https://7aa6372be13348688ef0178685198892@o87168.ingest.sentry.io/5962425",

    // Set your release version, such as "getsentry@1.0.0"
    release: "relish-wellbeing-2@2.0",
    // Set your dist version, such as "1"
    dist: "5",

    environment: window.location.href != "http://localhost:8100/" ? 'production' : 'local',
  },
  // Forward the init method from @sentry/angular
  SentryAngular.init
);

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    FormsModule,
    MbscModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: ErrorHandler,
      // Attach the Sentry ErrorHandler
      useValue: SentryAngular.createErrorHandler(),
    },
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    FormBuilder,
    FileTransfer,
    Network,
    InAppBrowser,
    AppVersion
  ],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule {}
