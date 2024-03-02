import {Component, NgModule, OnDestroy, OnInit} from '@angular/core';
import axios from 'axios';
import { Router, ActivatedRoute} from "@angular/router";
import { EChartsOption } from 'echarts';


@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})

export class DataComponent implements OnInit, OnDestroy{

  symbol: string = '';
  url: string = '';
  options: any;
  updateOptions: any;
  r: any;

  private now: Date = new Date();
  private value: number = 0;
  private data: any[] = [];
  private timer: any;
  dates: any;
  splitDates: string[][] = [];
  graphClose: number[] = [];

  constructor(private route: ActivatedRoute, private _router: Router) {
    this.symbol = route.snapshot.params['symbol']
    console.log(this.symbol)
    this.url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${this.symbol}&apikey=V202SBTX2QF6WNFW`;
  }

  changeView = () => {
    this.data = [];
    this.splitDates = [];
    this.graphClose = [];

    this.url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${this.symbol}&apikey=V202SBTX2QF6WNFW`;
    this.ngOnInit().then(() => {
      this.updateOptions = {
        series: [{
          data: this.data
        }]
      };
    });
  }

  changeView2 = () => {
    this.data = [];
    this.splitDates = [];
    this.graphClose = [];

    this.url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${this.symbol}&outputsize=full&apikey=V202SBTX2QF6WNFW`;
    this.ngOnInit().then(() => {
      this.updateOptions = {
        series: [{
          data: this.data
        }]
      };
    });
  }

  async ngOnInit() {
    let graphDates: string[] = [];
    let graphCloses: number[] = [];

    await axios.get(this.url).then(res => {
        this.dates = res.data["Time Series (Daily)"]
        //console.log(res.data["Time Series (Daily)"]);
        this.r = res.data;
        console.log(this.r)
        Object.keys(this.dates).forEach((function (key: string): void {
          graphDates.push(key);
          graphCloses.push(Number.parseFloat(res.data["Time Series (Daily)"][key]["4. close"]));
        }))
      }
    ).catch(err => {
      alert("No stock found")
      this._router.navigate(['/'])
    })

    graphDates = graphDates.reverse();
    graphCloses = graphCloses.reverse();

    this.graphClose = graphCloses;

    console.log(graphDates);
    console.log(graphCloses);

    // generate some random testing data:
    for (let j = 0; j < graphDates.length; j++) {
      this.splitDates.push(graphDates[j].split("-"));
    }

    console.log(this.splitDates)

    for (let i = 0; i < this.graphClose.length; i++) {
      this.data.push(this.getData(i));
    }

    console.log(this.data)

    // initialize chart options:
    this.options = {
      title: {
        text: `${this.symbol.toUpperCase()}` // Put stock name here
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          params = params[0];
          // Displays date and value on hover
          const date = new Date(params.name);
          if (date.getMonth() === 0) {
            return (12) + '-' + date.getDate() + '-' + date.getFullYear() + ' : ' + params.value[1];
          }
          return (date.getMonth()) + '-' + date.getDate() + '-' + date.getFullYear() + ' : $' + params.value[1];
        },
        axisPointer: {
          animation: false
        }
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
          show: false
        }
      },
      series: [{
        name: 'Mocking Data',
        type: 'line',
        showSymbol: false,
        emphasis: {
          line: false,
        },
        data: this.data
      }]
    };
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  getData(i:number) {
    this.now = new Date(Number.parseInt(this.splitDates[i][0]), Number.parseInt(this.splitDates[i][1]), Number.parseInt(this.splitDates[i][2]));
    this.value = this.graphClose[i];
    return {
      name: this.now.toString(),
      value: [
        [this.now.getFullYear(), this.now.getMonth(), this.now.getDate()].join('-'),
        this.value,
      ]
    };
  }
}
