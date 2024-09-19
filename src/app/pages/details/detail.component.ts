import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';  // Import du Router pour la redirection
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ChartData, ChartOptions } from 'chart.js';
import { Olympic } from 'src/app/core/models/Olympic';
import { Location } from '@angular/common';

@Component({
  selector: 'app-country-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class CountryDetailComponent implements OnInit {
  public country: string | null = null;
  public lineChartData: ChartData<'line'> | undefined;
  public totalEntries: number = 0;
  public totalMedals: number = 0;
  public totalAthletes: number = 0;

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#59a09b',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        titleFont: {
          size: 16,
          weight: 'bold',
        },
        bodyFont: {
          size: 18,
        },
        displayColors: false,
        padding: 10,
        cornerRadius: 6,
        callbacks: {
          title: function (context) {
            const country = context[0].label;
            return country;
          },
          label: function (context) {
            const value = context.raw as number;
            return `🎖 ${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        offset: false,
        title: {
          display: true,
          text: 'Year',
        }
      },
      y: {
        beginAtZero: true,  // Commencer l'axe Y à zéro
        title: {
          display: true,
          text: 'Number of Medals',
        }
      }
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,  // Ajout du Router pour la redirection
    private olympicService: OlympicService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.country = params.get('country');
      if (this.country) {
        this.loadCountryData(this.country);
      } else {
        this.handleInvalidCountry();
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  private loadCountryData(country: string) {
    this.olympicService.getOlympics().subscribe(
      (olympics) => {
        const selectedCountry = olympics?.find(o => o.country === country);
        if (selectedCountry) {
          this.prepareLineChartData(selectedCountry);
          this.calculateStatistics(selectedCountry);
        } else {
          this.handleInvalidCountry();
        }
      },
      (error) => {
        this.router.navigate(['/404']);
      }
    );
  }

  private prepareLineChartData(countryData: Olympic) {
    const years = countryData.participations.map(p => p.year);
    const medals = countryData.participations.map(p => p.medalsCount);

    this.lineChartData = {
      labels: years,
      datasets: [
        {
          label: `${countryData.country} - Medals per Year`,
          data: medals,
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.1,
          fill: false
        }
      ]
    };
  }

  private calculateStatistics(countryData: Olympic) {
    this.totalEntries = countryData.participations.length;
    this.totalMedals = countryData.participations.reduce((acc, p) => acc + p.medalsCount, 0);
    this.totalAthletes = countryData.participations.reduce((acc, p) => acc + p.athleteCount, 0);
  }

  private handleInvalidCountry(): void {
    this.router.navigate(['/404']);
  }
}
