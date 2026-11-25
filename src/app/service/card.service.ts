import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Card } from '../interfaces/card.interface';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  API_URL = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';
  constructor(private http: HttpClient) { }

  getCards(name: string | null = '', offset: number = 0) {
    const params: { [key: string]: string } = {
      num: '100',
      offset: offset.toString(),
    };
    if (name) {
      params['fname'] = name;
    }
    return this.http.get<Card[]>(this.API_URL, { params }).pipe(
      map((response: any) => response.data)
    );
  }

  getCardById(id: number | string) {
    return this.http.get<Card[]>(this.API_URL, { params: { id: String(id) } }).pipe(
      map((response: any) => response.data[0] as Card)
    );
  }
}
