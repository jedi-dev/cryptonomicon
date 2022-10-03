import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TickerGraphComponent } from './ticker-graph.component';

@NgModule({
  declarations: [TickerGraphComponent],
  imports: [CommonModule, ],
  exports: [TickerGraphComponent],
})
export class TickerGraphModule {}
