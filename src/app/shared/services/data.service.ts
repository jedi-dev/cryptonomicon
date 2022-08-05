import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, switchMap, timer } from 'rxjs';
import { CryptoInterface } from '../types/crypto.interface';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private http = inject(HttpClient);

  constructor() {}

  getCrypto(crypto: string): Observable<CryptoInterface> {
    const fullUrl = `https://min-api.cryptocompare.com/data/price?fsym=${crypto}&tsyms=USD&api_key=7bdaeec3b0d1d55dea515759414396b92cda6e67984a8f46d59fe1d71532e4d6`;

    return timer(0, 5000).pipe(
      switchMap(() => this.http.get<CryptoInterface>(fullUrl)),
      map((response) => response)
    );
  }
}
