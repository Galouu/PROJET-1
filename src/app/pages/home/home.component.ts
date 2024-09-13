import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<any> = of(null);

  public barChartData: ChartData<'bar'> | undefined;
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
  };

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.subscribe((data) => {
      if (data) {
        this.prepareChartData(data);
      }
    });
  }

  private prepareChartData(data: any) {
    const countries = data.map((olympic: any) => olympic.country);
    const medals = data.map((olympic: any) =>
      olympic.participations.reduce((acc: number, p: any) => acc + p.medalsCount, 0)
    );

    this.barChartData = {
      labels: countries,
      datasets: [
        {
          label: 'Total Medals',
          data: medals,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  }
}
