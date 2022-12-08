import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TickersInterface } from '../shared/types/tickers.interface';
import { Observable, Subscription } from 'rxjs';
import { TickerStoreService } from '../shared/services/ticker-store.service';
import { PersistenceService } from '../shared/services/persistence.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-tickers-list',
  templateUrl: './tickers-list.component.html',
  styleUrls: ['./tickers-list.component.css'],
})
export class TickersListComponent
  implements OnInit, OnDestroy, AfterContentChecked
{
  tickers$: Observable<TickersInterface[]> | undefined;
  subscription?: Subscription;
  queryParamsSubscription?: Subscription;
  filter: string = '';
  tickersOnPage: number = 3;
  pages: number = 1;
  currentPage: number = 1;
  viewBtn: boolean = false;
  selectedTicker: string = '';
  baseUrl: any;
  filteredTickers: TickersInterface[] = [];
  pageNumber$: Observable<number> | undefined;

  private tickerStoreService = inject(TickerStoreService);
  private persistenceService = inject(PersistenceService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  constructor() {}

  ngOnInit(): void {
    this.loadData();
    this.tickers$ = this.tickerStoreService.tickers.value$;
    this.pageNumber$ = this.tickerStoreService.page.value$;
    this.queryParamsSubscription = this.route.queryParams.subscribe(
      (params: Params) => {
        this.currentPage = Number(params['page']);
      }
    );
    this.pages = Math.ceil(this.filteredTickers.length / this.tickersOnPage);
  }

  ngAfterContentChecked() {
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.queryParamsSubscription?.unsubscribe();
  }

  loadData(): void {
    const tickers = this.persistenceService.get('dataTickers');
    if (tickers) {
      tickers.forEach((ticker) => {
        this.tickerStoreService.getTickers(ticker.name);
      });
    }
  }

  getFilteredTickers(): TickersInterface[] {
    const start = (this.currentPage - 1) * this.tickersOnPage;
    const end = this.currentPage * this.tickersOnPage;

    this.tickerStoreService.filteredTickers(this.filter.toUpperCase());

    this.subscription = this.tickerStoreService.filtered.value$.subscribe(
      (tickers) => {
        this.filteredTickers = tickers;
      }
    );

    this.viewBtn = this.filteredTickers.length > this.tickersOnPage;
    if (this.filteredTickers)
      this.persistenceService.set('dataTickers', this.filteredTickers);
    return this.filteredTickers.slice(start, end);
  }

  select(name: string): void {
    if (this.selectedTicker === name) this.selectedTicker = '';
    else this.selectedTicker = name;
    this.tickerStoreService.updatesGraph(this.selectedTicker);
  }

  delete(name: string, event: Event): void {
    this.tickerStoreService.deleteTicker(name);
    localStorage.clear();
    event.stopPropagation();
  }

  back(): void {
    if (this.currentPage > 1)
      this.tickerStoreService.pageCount(this.currentPage - 1);
  }

  forward(): void {
    if (this.currentPage)
      this.tickerStoreService.pageCount(this.currentPage + 1);
  }

  viewFiltered(): void {
    this.tickerStoreService.pageCount(1);
  }
}
