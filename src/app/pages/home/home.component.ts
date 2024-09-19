import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ChartData, ChartOptions } from 'chart.js';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<any> = of(null);
  public totalJO: number = 0;
  public totalCountries: number = 0;

  public barChartData: ChartData<'bar'> | undefined;
  public barChartOptions: ChartOptions<'bar'> = {
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
        grid: {
          color: '#59a09b',
          borderDash: [5, 5],
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
      y: {
        grid: {
          color: '#59a09b',
          borderDash: [5, 5],
        },
      },
    },
  };

    constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.subscribe((data) => {
      if (data) {
        this.totalCountries = data.length;
        this.totalJO = data.reduce((acc: number, olympic: any) => acc + olympic.participations.length, 0);
        this.prepareChartData(data);
      }
    });
  }

  private prepareChartData(data: any) {
    const countries = data.map((olympic: any) => olympic.country);
    const medals = data.map((olympic: any) =>
      olympic.participations.reduce((acc: number, p: any) => acc + p.medalsCount, 0)
    );

    const colors = ['#8d6265', '#714052', '#bccae4', '#c5dfef', '#94819f', '#8ea0d6'];

    this.barChartData = {
      labels: countries,
      datasets: [
        {
          label: 'Total Medals',
          data: medals,
          backgroundColor: colors,
          borderColor: colors.map((color) => color),
          borderWidth: 1,
        },
      ],
    };
  }
  onChartClick(event: any): void {
    const activePoints = event.active;
    if (activePoints.length > 0) {
      const index = activePoints[0].index;
      const country = this.barChartData?.labels?.[index];
      if (country) {
        this.router.navigate([`/details/${country}`]);
      }
    }
  }
}
