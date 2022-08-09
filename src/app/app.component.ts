import { Component, DoCheck, inject, OnDestroy, OnInit } from '@angular/core';
import { DataService } from './shared/services/data.service';
import { TickersInterface } from './shared/types/tickers.interface';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy, DoCheck {
  ticker: string = '';
  tickers: TickersInterface[] = [];
  doubleTicker: boolean = false;
  nameTickers: string[] = [];
  sel: any;
  dataSub: Subscription | undefined;
  symbolSub: Subscription | undefined;
  graph: number[] = [];
  loading: boolean = true;
  symbol: string[] = [];
  nameSymbol: string[] = [];

  private dataService = inject(DataService);

  ngOnInit() {
    this.symbolSub = this.dataService
      .getSymbol()
      .subscribe((e) => (this.symbol = Object.keys(e.Data)));
    timer(500).subscribe(() => (this.loading = false));
  }
  ngDoCheck() {
    if (this.ticker) this.selectSymbol();
  }

  ngOnDestroy() {
    this.dataSub?.unsubscribe();
    this.symbolSub?.unsubscribe();
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
    if (this.symbol.includes(this.ticker.toUpperCase())) {
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
        this.ticker = '';
        this.tickers.push(currentTicker);
      }
      this.nameSymbol = [];
    }
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
  selectSymbol(): void {
    this.nameSymbol = [];
    if (this.ticker) {
      this.symbol.sort().forEach((s) => {
        if (s.includes(this.ticker.toUpperCase())) {
          if (this.nameSymbol.length < 4) {
            this.nameSymbol.push(s);
          }
        }
      });
    }
    console.log(this.nameSymbol);
  }
  clearDoubleTicker(): void {
    if (this.doubleTicker) this.doubleTicker = false;
    if (!this.ticker) this.nameSymbol = [];
  }
}
