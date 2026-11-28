import { Injectable } from '@angular/core';
import { Card } from '../interfaces/card.interface';

export interface ListState {
  cards: Card[];
  offset: number;
  search: string;
  scrollY: number;
}

@Injectable({
  providedIn: 'root'
})
export class ListStateService {
  private state: ListState | null = null;

  save(state: ListState): void {
    this.state = state;
  }

  get(): ListState | null {
    return this.state;
  }

  clear(): void {
    this.state = null;
  }
}
