import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { OlympicService } from './core/services/olympic.service';
import { ConnectionService } from './core/services/connection.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isOnline: boolean = true; // Déclarez la variable pour l'état de connexion

  constructor(private olympicService: OlympicService, private connectionService: ConnectionService) {
    // Souscrire à l'état de connexion
    this.connectionService.onlineStatus$.subscribe(status => {
      this.isOnline = status;
    });
  }

  ngOnInit(): void {
    // Charger les données initiales
    this.olympicService.loadInitialData().pipe(take(1)).subscribe();
  }
}
