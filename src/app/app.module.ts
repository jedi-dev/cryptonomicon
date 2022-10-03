import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SpinDirective } from './shared/directives/spin.directive';
import { RouterModule, Routes } from '@angular/router';
import { SpinnerModule } from './shared/modules/spinner/spinner.module';
import { AddTickerModule } from './add-ticker/add-ticker.module';
import { AppRoutingModule } from './app-routing.module';

const routes: Routes = [];

@NgModule({
  declarations: [AppComponent, SpinDirective],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    SpinnerModule,
    AddTickerModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
