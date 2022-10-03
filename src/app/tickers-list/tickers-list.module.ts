import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TickersListComponent } from './tickers-list.component';
import { FormatPricePipe } from '../shared/pipes/format-price.pipe';
import { FormsModule } from '@angular/forms';
import { ListRoutingModule } from './list-routing.module';
import { TickerGraphModule } from '../ticker-graph/ticker-graph.module';

@NgModule({
  declarations: [TickersListComponent, FormatPricePipe],
  imports: [CommonModule, FormsModule, ListRoutingModule, TickerGraphModule],
  exports: [TickersListComponent],
})
export class TickersListModule {}
