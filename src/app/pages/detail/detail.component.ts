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

  // Efecto 3D: inclinación máxima en grados
  private readonly MAX_TILT = 14;
  hovering = false;
  transform = 'rotateX(0deg) rotateY(0deg)';
  glare = 'transparent';
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

  onMove(event: MouseEvent): void {
    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    // posición del cursor dentro de la carta, de 0 a 1
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    const rotateY = (x - 0.5) * 2 * this.MAX_TILT;
    const rotateX = (0.5 - y) * 2 * this.MAX_TILT;

    this.hovering = true;
    this.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.04)`;
    this.glare = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.45), transparent 55%)`;
  }

  onLeave(): void {
    this.hovering = false;
    this.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    this.glare = 'transparent';
  }
}
