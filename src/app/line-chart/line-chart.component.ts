import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OlympicService } from '../core/services/olympic.service';
import { Olympics } from '../core/models/Olympic';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {
  public olympics!: Olympics[];
  public country!: string;
  public chartData: any;
  public chartOptions: any = {
    type: 'line',
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  constructor(private route: ActivatedRoute, private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.country = this.route.snapshot.paramMap.get('country')!; // Récupération du paramètre 'country'
    
    // Récupération des données olympiques une seule fois
    this.olympicService.getOlympics().subscribe({
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

  loadCountryMedalsData(): void {
    const countryData = this.olympics.find((olympic: Olympics) => olympic.country === this.country);
    if (countryData) {
      this.formatLineChartData(countryData);
    } else {
      console.error(`No data found for country: ${this.country}`);
    }
  }

  public totalParticipations: number = 0; // Nombre total de participations
  public totalMedals: number = 0; // Nombre total de médailles
  public totalAthletes: number = 0; // Nombre total d'athlètes

  formatLineChartData(countryData: Olympics): void {
    // Calcule le nombre total de participations et de médailles
    this.totalParticipations = countryData.participations.length;
    this.totalMedals = countryData.participations.reduce((total, p) => total + p.medalsCount, 0);
    this.totalAthletes = countryData.participations.reduce((total, p) => total + p.athleteCount, 0); // Assurez-vous que 'athletesCount' existe dans votre modèle
  
    this.chartData = {
      labels: countryData.participations.map(p => p.year), // Années des participations
      datasets: [{
        label: `Médailles de ${this.country}`,
        data: countryData.participations.map(p => p.medalsCount),
        borderColor: '#42A5F5',
        fill: false
      }]
    };
  }
}
