import { Component, OnInit, OnDestroy } from '@angular/core';
import { Olympics } from '../core/models/Olympic';
import { OlympicService } from '../core/services/olympic.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChartData, ChartOptions, ChartDataset } from 'chart.js';

// Interface pour les jeux de données
interface CustomChartDataset extends ChartDataset<'pie', number[]> {
  id: number[]; // Ajoutez ici la propriété id
}

@Component({
  selector: 'app-camembert-chart',
  templateUrl: './camembert-chart.component.html',
  styleUrls: ['./camembert-chart.component.scss']
})
export class CamembertChartComponent implements OnInit, OnDestroy {
  public olympics!: Olympics[];
  public chartData!: ChartData<'pie', number[]>;
  public chartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    onClick: (event, activeElements) => {
      if (activeElements.length > 0) {
        const chartElement = activeElements[0];
        const countryId = (this.chartData.datasets[0] as CustomChartDataset).id[chartElement.index];
        this.navigateToCountryDetails(countryId);
      }
    }
  };

  // Nombre de Jeux Olympiques et nombre de pays
  public numberOfOlympics: number = 0;
  public numberOfCountries: number = 0;

  // Subscription pour gérer l'abonnement
  private subscription!: Subscription;

  constructor(private router: Router, private olympicService: OlympicService) {}

  ngOnInit(): void {
    // Récupération des données depuis le service et sauvegarde de l'abonnement
    this.subscription = this.olympicService.getOlympics().subscribe(
      (data: Olympics[]) => {
        if (data) {
          this.olympics = data;
          this.formatChartData();
        }
      },
      (error) => {
        console.error('Error loading Olympics data:', error); // en cas d'erreur
      }
    );
  }

  ngOnDestroy(): void {
    // Désabonnement au service
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // Initialise le graphique
  formatChartData(): void {
    if (this.olympics && this.olympics.length) {
      this.numberOfOlympics = this.olympics.reduce((total, olympic) => total + olympic.participations.length, 0);

      const uniqueCountries = new Set(this.olympics.map(olympic => olympic.country));
      this.numberOfCountries = uniqueCountries.size;

      this.chartData = {
        labels: this.olympics.map(olympic => olympic.country),
        datasets: [{
          id: this.olympics.map(olympic => olympic.id), // Ici vous pouvez utiliser id
          data: this.olympics.map(olympic => 
            olympic.participations.reduce((total, participation) => total + participation.medalsCount, 0)
          ),
          backgroundColor: ['#956065', '#B8CBE7', '#89A1DB', '#733C50', '#9780A1'], // reprise des couleurs sur la maquette
        } as CustomChartDataset] // Cast to CustomChartDataset here
      };
    }
  }

  // Naviguer vers les détails d'un pays
  navigateToCountryDetails(idCountry: number): void {
    this.router.navigate(['detail', idCountry]);
  }

  // Appel lors d'un clic sur un élément
  onChartClick(idCountry: number): void {
    this.navigateToCountryDetails(idCountry);
  }
}
