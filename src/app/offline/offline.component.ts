import { Component } from '@angular/core';

@Component({
  selector: 'app-offline',
  templateUrl: './offline.component.html',
  styleUrls: ['./offline.component.scss']
})
export class OfflineComponent {
  // Méthode pour tenter de se reconnecter
  retryConnection(): void {
    // Vous pouvez ajouter une logique pour vérifier la connexion ici
    window.location.reload(); // Recharge la page pour tenter de se reconnecter
  }
}
