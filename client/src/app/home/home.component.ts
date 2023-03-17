import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { SpData } from '../models/spdata';
import { FileService } from '../service/file.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  title = 'Visualization';
  dataReturn!: SpData[];
  allDate: string[] = [];
  price: number[][] = [];
  baseUrl = environment.apiUrl;
  chartOption!: EChartsOption;

  constructor(
    private http: HttpClient,
    public fileService: FileService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fileService.currentFile$.pipe(take(1)).subscribe({
      next: (f) => {
        if (f) {
          this.dataReturn = f;
          this.formatData();
        } else {
          this.getData();
        }
      },
      error: (err) => console.log(err),
      complete: () => {
        this.buildChart();
      },
    });
  }

  getData() {
    this.http
      .get<SpData[]>(this.baseUrl + 'csv', { observe: 'response' })
      .subscribe({
        next: (response) => {
          if (response.status == 200 && response.body) {
            this.dataReturn = response.body;
            this.formatData();
          }
        },
        error: (err) => {
          if (err) {
            switch (err.status) {
              case 404:
                this.toastr.error('CSV File Not Found', err.status.toString());
                break;
              case 500:
                this.toastr.error('Interval Error', err.status.toString());
                break;
              default:
                this.toastr.error('Something unexpected happened');
                console.log(err);
                break;
            }
          }
        },
        complete: () => {
          this.buildChart();
        },
      });
  }

  formatData() {
    this.allDate = [];
    this.price = [];
    for (let i = this.dataReturn.length - 1; i >= 0; i--) {
      const time = this.dataReturn[i]['date'];
      const p = [
        this.dataReturn[i]['close'],
        this.dataReturn[i]['open'],
        this.dataReturn[i]['low'],
        this.dataReturn[i]['high'],
      ];

      this.allDate.push(time);
      this.price.push(p);
    }
  }

  calculateMA(dayCount: number, data: number[][]) {
    var result = [];
    var len = data.length;
    for (var i = 0; i < len; i++) {
      if (i < dayCount) {
        result.push('-');
        continue;
      }
      var sum = 0;
      for (var j = 0; j < dayCount; j++) {
        sum += +data[i - j][1];
      }
      result.push(sum / dayCount);
    }

    return result;
  }

  buildChart() {
    this.chartOption = {
      title: {
        left: 'center',
        text: 'S&P 500 Index',
      },
      legend: {
        data: ['S&P 500 Index', 'MA50', 'MA200'],
        inactiveColor: '#777',
        top: 30,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false,
          type: 'cross',
          lineStyle: {
            color: '#376df4',
            width: 2,
            opacity: 1,
          },
        },
      },
      xAxis: {
        type: 'category',
        data: this.allDate,
        axisLine: { lineStyle: { color: '#8392A5' } },
      },
      yAxis: {
        scale: true,
        axisLine: { lineStyle: { color: '#8392A5' } },
        splitLine: { show: false },
      },
      grid: {
        bottom: 90,
      },
      dataZoom: [
        {
          textStyle: {
            color: '#8392A5',
          },
          dataBackground: {
            areaStyle: {
              color: '#8392A5',
            },
            lineStyle: {
              opacity: 0.8,
              color: '#8392A5',
            },
          },
          brushSelect: true,
        },
        {
          type: 'inside',
        },
      ],
      series: [
        {
          type: 'candlestick',
          name: 'S&P 500 Index',
          data: this.price,
          itemStyle: {
            color: '#FD1050',
            color0: '#0CF49B',
            borderColor: '#FD1050',
            borderColor0: '#0CF49B',
          },
        },
        {
          name: 'MA50',
          type: 'line',
          data: this.calculateMA(50, this.price),
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 1,
          },
        },
        {
          name: 'MA200',
          type: 'line',
          data: this.calculateMA(200, this.price),
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 1,
          },
        },
      ],
    };
  }
}
