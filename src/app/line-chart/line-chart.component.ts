import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OlympicService } from '../core/services/olympic.service';
import { Olympics } from '../core/models/Olympic';
import { Subscription } from 'rxjs';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit, OnDestroy {
  public olympics!: Olympics[];
  public idCountry!: number;
  public countryName!: string; // Nom du pays
  public chartData!: ChartData<'line'>; // Typé comme ChartData pour un graphique en ligne
  public chartOptions: ChartOptions = { // Typé pour éviter les erreurs
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  private subscription!: Subscription;

  constructor(private route: ActivatedRoute, private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.idCountry = +this.route.snapshot.paramMap.get('idCountry')!;

    // Récupération des données olympiques
    this.subscription = this.olympicService.getOlympics().subscribe({
      next: (data: Olympics[]) => {
        if (data) {
          this.olympics = data; // Stocker les données
          this.loadCountryMedalsData(); // Charger les données pour le pays
        }
      },
      error: (error) => {
        console.error('Error loading Olympics data:', error);
      },
    });
  }

  ngOnDestroy(): void {
    // Désabonnement
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadCountryMedalsData(): void {
    const countryData = this.olympics.find((olympic: Olympics) => olympic.id === this.idCountry);
    if (countryData) {
      this.countryName = countryData.country; // Récupérer le nom du pays
      this.formatLineChartData(countryData);
    } else {
      console.error(`No data found for country: ${this.idCountry}`);
    }
  }

  public totalParticipations: number = 0; // Nombre total de participations
  public totalMedals: number = 0; // Nombre total de médailles
  public totalAthletes: number = 0; // Nombre total d'athlètes

  // Initialise le graphique
  formatLineChartData(countryData: Olympics): void {
    // Calcule le nombre total de participations et de médailles
    this.totalParticipations = countryData.participations.length;
    this.totalMedals = countryData.participations.reduce((total, p) => total + p.medalsCount, 0);
    this.totalAthletes = countryData.participations.reduce((total, p) => total + p.athleteCount, 0);
  
    this.chartData = {
      labels: countryData.participations.map(p => p.year), // Années des participations
      datasets: [{
        label: `Médailles de ${this.countryName}`, // Afficher le nom du pays ici
        data: countryData.participations.map(p => p.medalsCount),
        borderColor: '#42A5F5',
        fill: false
      }]
    };
  }
}
