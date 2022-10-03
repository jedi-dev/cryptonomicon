import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, switchMap, timer } from 'rxjs';
import { CryptoInterface } from '../types/crypto.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private http = inject(HttpClient);

  constructor() {}

  getCryptoPrice(crypto: string): Observable<CryptoInterface> {
    const fullUrl = `${environment.apiUrl}/data/price?fsym=${crypto}&tsyms=USD&api_key=${environment.apiKey}`;

    return timer(500, 5000).pipe(
      switchMap(() => this.http.get<CryptoInterface>(fullUrl)),
      map((response) => response)
    );
  }

  getCryptoName(): Observable<any> {
    const url = `${environment.apiUrl}/data/all/coinlist?summary=true`;

    return this.http.get(url).pipe(map((response) => response));
  }
}
