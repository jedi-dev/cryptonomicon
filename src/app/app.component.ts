import { Component, inject, OnDestroy } from '@angular/core';
import { DataService } from './shared/services/data.service';
import { TickersInterface } from './shared/types/tickers.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {
  ticker: string = '';
  tickers: TickersInterface[] = [];
  doubleTicker: boolean = false;
  nameTickers: string[] = [];
  sel: any;
  dataSub: Subscription | undefined;
  graph: number[] = [];

  private dataService = inject(DataService);

  ngOnDestroy() {
    this.dataSub?.unsubscribe();
  }

  searchDoubleTicker(): void {
    if (this.tickers.length > 0) {
      this.tickers.forEach((e) => {
        this.nameTickers.push(e.name);
      });
    }
    this.doubleTicker = this.nameTickers.includes(this.ticker.toUpperCase());
  }

  add(): void {
    const currentTicker = {
      name: this.ticker.toUpperCase(),
      price: '_',
    };
    this.searchDoubleTicker();
    if (!this.nameTickers.includes(this.ticker.toUpperCase())) {
      this.dataSub = this.dataService
        .getCrypto(this.ticker.toUpperCase())
        .subscribe((e) => {
          currentTicker.price =
            e.USD > 1 ? e.USD.toFixed(2) : e.USD.toPrecision(2);
          if (this.sel?.name === currentTicker.name) {
            this.graph.push(e.USD);
          }
        });
    }
    this.tickers.push(currentTicker);
    this.ticker = '';
  }

  select(ticker: any): void {
    this.sel = ticker;
    this.graph = [];
  }

  delete(name: string, event: Event): void {
    this.tickers = this.tickers.filter((e) => e.name !== name);
    event.stopPropagation();
  }

  normalizeGraph(): string[] {
    const maxValue = Math.max(...this.graph);
    const minValue = Math.min(...this.graph);
    return this.graph.map(
      (price) => `${5 + ((price - minValue) * 95) / (maxValue - minValue)}%`
    );
  }
}
