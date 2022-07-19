import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  ticker: string = 'Crypto';
  tickers = [
    { name: 'BTC', price: 99999.99 },
    { name: 'DOGE', price: 0.0014 },
    { name: 'WTF', price: 1.11 },
  ];
  doubleTicker: boolean = false;
  nameTickers: string[] = [];

  searchDoubleTicker(): void {
    if (this.tickers.length > 0) {
      this.tickers.forEach((e) => {
        this.nameTickers.push(e.name);
      });
    }
    this.doubleTicker = this.nameTickers.includes(this.ticker.toUpperCase());
  }

  add(): void {
    this.searchDoubleTicker();
    if (!this.nameTickers.includes(this.ticker.toUpperCase())) {
      this.tickers.push({ name: this.ticker.toUpperCase(), price: 1 });
    }
    this.ticker = '';
  }

  delete(name: string): void {
    this.tickers = this.tickers.filter((e) => e.name !== name);
  }
}
