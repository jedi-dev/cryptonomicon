import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTickerComponent } from './add-ticker.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AddTickerComponent],
  imports: [CommonModule, FormsModule, RouterModule],
  exports: [AddTickerComponent],
})
export class AddTickerModule {}
