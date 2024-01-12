import { RawDataResponse } from "../models/http-generic-response.model";

export function datasetToChartSeries(
  data: RawDataResponse,
  series: { key: string; description }[]
) {
  let result = series.map((item) => {
    return {
      data: data[item.key],
      name: item.description,
    };
  });
  return result;
}

export class Chart  {
  colors = ['#4154f1', '#F9CE1D', '#4154f1'];
  series = [];
  chart =
   {
    height: 400,
    type: "line",
    animations: {
      enabled: true,
      dynamicAnimation: {
        speed: 1000
      }
    },

    events: {
      animationEnd: function (chartCtx) {
        let series = chartCtx.w.config.series;
        let daly = 10;
      }
    },
  
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false
    }

  };

  annotations= {
    yaxis: [{
      y: -50,
      y2: 0,
      borderColor: '#000',
      fillColor: '#9bd2ff',
      opacity: 0.1,

    },{
      y: 28,
      y2: 38,
      borderColor: '#000',
      fillColor: '#fff5ba',
      opacity: 0.1,

    },{
      y: 38,
      y2: 70,
      borderColor: '#000',
      fillColor: '#ffc3bf',
      opacity: 0.1,

    }],
  };
  dataLabels= {
    enabled: false
  };
  legend = {
    tooltipHoverFormatter: (val: any, opts: any) => {
      return (
        val + " - <strong>" + parseFloat(opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex]).toFixed(2) + "</strong>"
      );
    }
  };
  
  xaxis = {
    labels: {
      trim: true,
      hideOverlappingLabels: true,
      style: {
        fontSize: '12px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 400,
        cssClass: 'apexcharts-xaxis-label',
      }
    },
    categories: []
  };
  yaxis = {
    labels: {
      trim: true,
      hideOverlappingLabels: true,
      formatter: (value: any) => {
        let arredondado = Math.round(Math.abs(value)); // Arredonda o número para o inteiro mais próximo
        arredondado *= Math.sign(value);
        return arredondado;
      }
    }
  };
  stroke= {
    width: 2.5
  };
  grid= {
    borderColor: "#f1f1f1"
  }
}