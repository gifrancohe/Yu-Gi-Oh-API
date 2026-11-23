import { Component, OnInit } from '@angular/core';
import { Card } from 'src/app/interfaces/card.interface';
import { CardService } from 'src/app/service/card.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  constructor(private cardService: CardService) { }
  cards: Card[] = [];

  ngOnInit(): void {
    this.cardService.getCards().subscribe((data: Card[]) => {
      this.cards = data;
    });
  }

}
