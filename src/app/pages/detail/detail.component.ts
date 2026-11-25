import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Card } from 'src/app/interfaces/card.interface';
import { CardService } from 'src/app/service/card.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  card: Card | null = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private cardService: CardService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loading = false;
      this.error = true;
      return;
    }
    this.cardService.getCardById(id).subscribe({
      next: (card) => {
        this.card = card;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  get isMonster(): boolean {
    return !!this.card && this.card.type.toLowerCase().includes('monster');
  }

  get isLink(): boolean {
    return !!this.card && this.card.type.toLowerCase().includes('link');
  }
}
