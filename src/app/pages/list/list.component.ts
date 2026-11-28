import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Card } from 'src/app/interfaces/card.interface';
import { CardService } from 'src/app/service/card.service';
import { debounceTime, filter } from 'rxjs/operators';
import { ListStateService } from 'src/app/service/list-state.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  constructor(
    private cardService: CardService,
    private listState: ListStateService,
    private router: Router
  ) { }
  cards: Card[] = [];
  offset: number = 0;
  cardTextFC = new FormControl('');
  private scrollY = 0;
  private navSub?: Subscription;

  ngOnInit(): void {
    this.cardTextFC.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe((value) => {
      this.offset = 0;
      this.cards = [];
      this.searchCards(value);
    });

    // El scroll se lee antes de navegar: al llegar al detalle (página corta)
    // el navegador lo reduce a 0 y ngOnDestroy ya vería un valor incorrecto.
    this.navSub = this.router.events
      .pipe(filter((e) => e instanceof NavigationStart))
      .subscribe(() => (this.scrollY = window.scrollY));

    const saved = this.listState.get();
    // si lo guardado no tiene cartas (p. ej. se salió antes de que respondiera la API), se carga de nuevo
    if (saved && saved.cards.length > 0) {
      this.cards = saved.cards;
      this.offset = saved.offset;
      // emitEvent: false evita que el debounce reinicie la lista
      this.cardTextFC.setValue(saved.search, { emitEvent: false });
      this.scrollY = saved.scrollY;
      // esperamos a que Angular pinte las cartas antes de hacer scroll
      setTimeout(() => window.scrollTo(0, saved.scrollY));
    } else {
      if (saved) {
        this.cardTextFC.setValue(saved.search, { emitEvent: false });
      }
      this.searchCards(saved?.search ?? null);
    }
  }

  ngOnDestroy(): void {
    this.navSub?.unsubscribe();
    this.listState.save({
      cards: this.cards,
      offset: this.offset,
      search: this.cardTextFC.value ?? '',
      scrollY: this.scrollY,
    });
  }

  onScroll() {
    this.offset += 100;
    this.searchCards(this.cardTextFC.value);
  }

  searchCards(cardName: string | null = null) {
     this.cardService.getCards(cardName, this.offset).subscribe((data: Card[]) => {
      this.cards = [...this.cards, ...data];
    });
  }

}
