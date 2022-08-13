import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { DataService } from './shared/services/data.service';
import { TickersInterface } from './shared/types/tickers.interface';
import { Subscription, timer } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy, AfterContentChecked {
  ticker: string = '';
  tickers: TickersInterface[] = [];
  doubleTicker: boolean = false;
  nameTickers: string[] = [];
  sel?: TickersInterface;
  dataSub: Subscription | undefined;
  symbolSub: Subscription | undefined;
  graph: number[] = [];
  loading: boolean = true;
  symbol: string[] = [];
  filter: string = '';
  tickersOnPage: number = 3;
  page: number = 1;
  viewBtn: boolean = false;

  private dataService = inject(DataService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  ngOnInit() {
    this.symbolSub = this.dataService
      .getSymbol()
      .subscribe((e) => (this.symbol = Object.keys(e.Data)));
    timer(500).subscribe(() => (this.loading = false));
    this.loadData();
    console.log(this.router.url);
  }
  ngAfterContentChecked() {
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.dataSub?.unsubscribe();
    this.symbolSub?.unsubscribe();
  }

  loadData(): void {
    const tickersLocalStorage = localStorage.getItem('dataTickers');
    const filterLocalStorage = localStorage.getItem('dataFilter');
    if (tickersLocalStorage) {
      this.tickers = JSON.parse(tickersLocalStorage);
      this.tickers.forEach((ticker) => this.subscribeToUpdates(ticker.name));
    }
    if (filterLocalStorage) this.filter = JSON.parse(filterLocalStorage);
  }

  addUrl(): void {
    window.history.pushState(
      null,
      document.title,
      `${window.location.pathname}?filter=${this.filter}&page=${this.page}`
    );
  }

  searchDoubleTicker(): void {
    if (this.tickers.length > 0) {
      this.tickers.forEach((e) => {
        this.nameTickers.push(e.name);
      });
    }
    this.doubleTicker = this.nameTickers.includes(this.ticker.toUpperCase());
  }

  subscribeToUpdates(name: string): void {
    this.dataSub = this.dataService.getCrypto(name).subscribe((e) => {
      this.tickers.forEach((ticker) => {
        if (ticker.name === name)
          ticker.price = e.USD > 1 ? e.USD.toFixed(2) : e.USD.toPrecision(2);
      });
      if (this.sel?.name === name) {
        this.graph.push(e.USD);
      }
    });
  }

  add(): void {
    const currentTicker = {
      name: '',
      price: '_',
    };
    if (this.symbol.includes(this.ticker.toUpperCase())) {
      this.searchDoubleTicker();
      if (!this.nameTickers.includes(this.ticker.toUpperCase())) {
        currentTicker.name = this.ticker.toUpperCase();
        this.subscribeToUpdates(currentTicker.name);
        this.ticker = '';
        this.filter = '';
        this.tickers.push(currentTicker);

        localStorage.setItem('dataTickers', JSON.stringify(this.tickers));
      }
    }
  }

  select(ticker: TickersInterface): void {
    this.sel = ticker;
    this.graph = [];
  }

  delete(name: string, event: Event): void {
    this.tickers = this.tickers.filter((e) => e.name !== name);
    localStorage.removeItem('dataTickers');
    if (this.tickers.length > 0)
      localStorage.setItem('dataTickers', JSON.stringify(this.tickers));
    event.stopPropagation();
  }

  normalizeGraph(): string[] {
    const maxValue = Math.max(...this.graph);
    const minValue = Math.min(...this.graph);
    return this.graph.map(
      (price) => `${5 + ((price - minValue) * 95) / (maxValue - minValue)}%`
    );
  }
  selectSymbol(): string[] {
    return this.symbol
      .filter((s) => s.includes(this.ticker.toUpperCase()))
      .sort((a, b) => a.length - b.length)
      .slice(0, 4);
  }

  clearDoubleTicker() {
    if (this.doubleTicker) this.doubleTicker = false;
  }

  filteredTickers(): TickersInterface[] {
    const start = (this.page - 1) * this.tickersOnPage;
    const end = this.page * this.tickersOnPage;
    const filteredTickers = this.tickers.filter((ticker) =>
      ticker.name.includes(this.filter.toUpperCase())
    );
    this.viewBtn = filteredTickers.length > this.tickersOnPage;
    localStorage.setItem('dataFilter', JSON.stringify(this.filter));
    return filteredTickers.slice(start, end);
  }

  back(): void {
    if (this.page > 1) {
      this.page--;
      this.addUrl();
    }
  }

  forward(): void {
    const pageAll = Math.ceil(this.tickers.length / this.tickersOnPage);
    if (this.page < pageAll) {
      this.page++;
      this.addUrl();
    }
  }

  viewFiltered(): void {
    this.page = 1;
    this.addUrl();
  }
}
