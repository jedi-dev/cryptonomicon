import { Injectable } from '@angular/core';
import { TickersInterface } from '../types/tickers.interface';

@Injectable({
  providedIn: 'root',
})
export class PersistenceService {
  set(key: string, data: TickersInterface[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  get(key: string): TickersInterface[] {
    try {
      // @ts-ignore
      return JSON.parse(localStorage.getItem(key));
    } catch (e) {
      console.error('Error getting data from localStorage', e);
      return [];
    }
  }
}
