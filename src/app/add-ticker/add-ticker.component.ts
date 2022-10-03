import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { TickerStoreService } from '../shared/services/ticker-store.service';

@Component({
  selector: 'app-add-ticker',
  templateUrl: './add-ticker.component.html',
  styleUrls: ['./add-ticker.component.css'],
})
export class AddTickerComponent implements OnInit, OnDestroy {
  ticker: string = '';
  doubleTicker: boolean | undefined;
  nameTickers$: Observable<string[]> | undefined;
  subscription?: Subscription;
  pageNumber$: Observable<number> | undefined;

  private tickerStoreService = inject(TickerStoreService);

  ngOnInit(): void {
    this.subscription = this.tickerStoreService.doubleTicker.value$.subscribe(
      (item) => (this.doubleTicker = item)
    );
    this.pageNumber$ = this.tickerStoreService.page.value$
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  tickersSelection(): void {
    this.tickerStoreService.getTickerNames(this.ticker.toUpperCase());
    this.nameTickers$ = this.tickerStoreService.tickerNames.value$;
  }

  addTicker(): void {
    if(this.ticker)
    this.tickerStoreService.getTickers(this.ticker.toUpperCase());
    if (!this.doubleTicker) this.ticker = '';
  }
}
