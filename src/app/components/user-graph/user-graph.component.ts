import { Component, OnInit } from '@angular/core';

import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import * as Chart from 'chart.js';
import { IUser } from 'src/app/interfaces/user/usuario.interface';
import { IWeight } from 'src/app/interfaces/user/weight.interface';
import { LoginService } from 'src/app/services/login/login.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-user-graph',
  templateUrl: './user-graph.component.html',
  styleUrls: ['./user-graph.component.css'],
})
export class UserGraphComponent implements OnInit {
  user: IUser = {
    id: undefined,
    name: '',
    username: '',
    password: '',
    userRoles: [],
    surname: '',
    email: '',
    birthDate: new Date(),
    height: undefined,
    phone: '',
    authorities: [
      {
        authority: ' ',
      },
    ],
  };

  weightPerMonth: number[] = [];

  grassPerMonth: number[] = [];

  // Mostrar leyenda de la gráfica
  public barChartLegend = false;
  public linealChartLegend = false;

  // Datos para la gráfica de barras (porcentaje de grasa)
  public barChartData: ChartDataset[] = [];
  public linealChartData: ChartDataset[] = [];

  public barChartLabels: string[] = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  constructor(private loginUser: LoginService) {}

  ngOnInit(): void {
    this.user = this.loginUser.getUser();
    // this.weightPerMonth = _.isUndefined(this.user.listUserWeight)
    //   ? []
    //   : this.groupWeightsByMonth(this.user.listUserWeight);

    this.weightPerMonth = [80, 70, 75, 75, 76, 85, 90, 95, 92, 87, 89, 85];
    this.grassPerMonth = [20, 15, 18, 22, 16, 19, 15, 18, 22, 0, 19, 12];

    this.barChartData = [
      {
        data: this.weightPerMonth,
        label: 'Peso corporal',
      },
    ];

    this.linealChartData = [
      {
        data: this.grassPerMonth,
        label: '% de grasa corporal',
      },
    ];
  }

  // Etiquetas para el eje X de la gráfica (por ejemplo, meses del año)
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Meses',
        },
      },
      y: {
        title: {
          display: true,
          text: ['Peso corporal (KG)'],
        },
      },
    },
  };
  // Etiquetas para el eje X de la gráfica (por ejemplo, meses del año)
  public linealChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Meses',
        },
      },
      y: {
        title: {
          display: true,
          text: ['% de grasa corporal'],
        },
      },
    },
  };

  groupWeightsByMonth(listUserWeight: IWeight[]): number[] {
    const groupedWeights = new Array(12).fill(0);

    for (const { date, weightData } of listUserWeight) {
      if (date) {
        const month = new Date(date).getMonth();
        const currentWeight = weightData || 0;

        if (currentWeight > groupedWeights[month]) {
          groupedWeights[month] = currentWeight;
        }
      }
    }

    return groupedWeights;
  }
}
