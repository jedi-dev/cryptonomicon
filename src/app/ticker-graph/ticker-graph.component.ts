import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TickerStoreService } from '../shared/services/ticker-store.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ticker-graph',
  templateUrl: './ticker-graph.component.html',
  styleUrls: ['./ticker-graph.component.css'],
})
export class TickerGraphComponent implements OnInit, OnDestroy {
  graph: number[] = [];
  subscription?: Subscription;

  @Input() selectedTicker?: string;
  @Output() select = new EventEmitter<string>();

  private tickerStoreService = inject(TickerStoreService);

  constructor() {}

  ngOnInit(): void {
    this.subscription = this.tickerStoreService.graph.value$.subscribe(e => this.graph = e)
  }
  ngOnDestroy() {
    this.subscription?.unsubscribe()
  }

  normalizeGraph(): string[] {
    const maxValue = Math.max(...this.graph);
    const minValue = Math.min(...this.graph);

    return this.graph.map(
      (price) => `${5 + ((price - minValue) * 95) / (maxValue - minValue)}%`
    ).slice(-37);

  }

  onSelect(name: string) {
    this.select.emit(name);
  }
}
