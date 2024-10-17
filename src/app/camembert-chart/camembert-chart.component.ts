import { Component, OnInit } from '@angular/core';
import { Olympics } from '../core/models/Olympic';
import { OlympicService } from '../core/services/olympic.service';
import { Router } from '@angular/router'; // Import du Router

@Component({
  selector: 'app-camembert-chart',
  templateUrl: './camembert-chart.component.html',
  styleUrls: ['./camembert-chart.component.scss']
})
export class CamembertChartComponent implements OnInit {
  public olympics!: Olympics[];
  public chartData: any;
  public chartOptions: any = {
    responsive: true,
    type: 'pie',
    plugins: {
      legend: {
        display: false,
      },
    },
    onClick: (event: any, activeElements: any[]) => {
      if (activeElements.length > 0) {
        const chartElement = activeElements[0];
        const country = this.chartData.labels[chartElement.index];
        this.navigateToCountryDetails(country);
      }
    }
  };

  public numberOfOlympics: number = 0;
  public numberOfCountries: number = 0;

  constructor(private router: Router, private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympicService.getOlympics().subscribe(
      (data: Olympics[]) => {
        if (data) {
          this.olympics = data;
          this.formatChartData();
        }
      },
      (error) => {
        console.error('Error loading Olympics data:', error);
      }
    );
  }

  formatChartData(): void {
    if (this.olympics && this.olympics.length) {
      this.numberOfOlympics = this.olympics.reduce((total, olympic) => total + olympic.participations.length, 0);

      const uniqueCountries = new Set(this.olympics.map(olympic => olympic.country));
      this.numberOfCountries = uniqueCountries.size;

      this.chartData = {
        labels: this.olympics.map(olympic => olympic.country),
        datasets: [{
          data: this.olympics.map(olympic => 
            olympic.participations.reduce((total, participation) => total + participation.medalsCount, 0)
          ),
          backgroundColor: ['#956065', '#B8CBE7', '#89A1DB', '#733C50', '#9780A1'],
        }]
      };
    }
  }

    // Méthode pour naviguer vers les détails d'un pays
    navigateToCountryDetails(country: string): void {
      this.router.navigate(['detail', country]);
    }

    // Exemple d'appel lors d'un clic sur un élément
    onChartClick(country: string): void {
      this.navigateToCountryDetails(country);
    }
}
