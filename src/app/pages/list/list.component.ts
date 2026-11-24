import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Card } from 'src/app/interfaces/card.interface';
import { CardService } from 'src/app/service/card.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  constructor(private cardService: CardService) { }
  cards: Card[] = [];
  offset: number = 0;
  cardTextFC = new FormControl('');

  ngOnInit(): void {
    this.cardTextFC.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe((value) => {
      this.offset = 0;
      this.cards = [];
      this.searchCards(value);
    });
    this.searchCards();
   }

  onScroll() {
    this.offset += 100;
    this.searchCards();
  }

  searchCards(cardName: string | null = null) {
     this.cardService.getCards(cardName, this.offset).subscribe((data: Card[]) => {
      this.cards = [...this.cards, ...data];
    });
  }

}
