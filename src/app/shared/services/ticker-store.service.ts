import { inject, Injectable } from '@angular/core';
import { BehaviorSubjectItem } from '../models/behavior-subject.model';
import { DataService } from './data.service';
import { TickersInterface } from '../types/tickers.interface';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TickerStoreService {
  tickersName: string = ''

  readonly tickers: BehaviorSubjectItem<TickersInterface[]> =
    new BehaviorSubjectItem<TickersInterface[]>([]);

  readonly tickerNames: BehaviorSubjectItem<string[]> = new BehaviorSubjectItem<
    string[]
  >([]);

  readonly doubleTicker: BehaviorSubjectItem<boolean> =
    new BehaviorSubjectItem<boolean>(false);

  readonly filtered: BehaviorSubjectItem<TickersInterface[]> =
    new BehaviorSubjectItem<TickersInterface[]>([]);

  readonly graph: BehaviorSubjectItem<number []> =
    new BehaviorSubjectItem<number []>([]);

  readonly page: BehaviorSubjectItem<number> =
    new BehaviorSubjectItem<number>(1);

  readonly dataService = inject(DataService);

  constructor() {}

  updatesPrice(name: string): void {
    this.dataService.getCryptoPrice(name).subscribe((data) => {
      this.tickers.value.forEach((e) => {
        if (e.name === name) e.price = data.USD;
      });
      if (name === this.tickersName) this.graph.value.push(data.USD)
    });
  }

  updatesGraph(name: string): void {
    this.graph.value = [];
    this.tickersName = name
  }


  getTickers(name: string): void {
    const currentTicker = {
      name: '',
      price: 0,
    };
    if(this.tickers.value.some(e => name === e.name)) this.doubleTicker.value = true;
    else {
      currentTicker.name = name;
      this.tickers.value.push(currentTicker);
      this.updatesPrice(name);
    }
  }

  getTickerNames(symbol: string): void {
    this.dataService
      .getCryptoName()
      .pipe(
        map((e) => Object.keys(e.Data)
          .filter(name => name.includes(symbol))
          .sort((a, b) => a.length - b.length)
          .slice(0, 4))
        )
      .subscribe(
        (items) =>
          (this.tickerNames.value = items)
      )

    if (!this.tickers.value.map((e) => e.name).includes(symbol))
      this.doubleTicker.value = false;
  }

  filteredTickers(name: string): void {
    this.filtered.value = this.tickers.value.filter((ticker) =>
      ticker.name.includes(name)
    );
  }

  deleteTicker(name: string): void {
    this.tickers.value = this.tickers.value.filter(
      (ticker) => ticker.name !== name
    );
  }

  pageCount(page: number): void {
    this.page.value = page;
  }
}
