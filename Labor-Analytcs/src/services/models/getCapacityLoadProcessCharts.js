import ChartDataLabels from "chartjs-plugin-datalabels";
import { ChartsColors } from "../../config";
import { Filters } from "../../lib";
import {
  createBarDataset,
  createBarScales,
  createDoughnutDataset,
  createDoughnutOptions,
  createFixedDatalabels,
  createLayoutWithDatalabels,
} from "../helpers/CommonChartConfigs";

const colors = ChartsColors.processCapacity;

function createDoughnutChartData(data, labels, color) {
  return {
    chartData: {
      type: "doughnut",
      data: {
        datasets: [createDoughnutDataset(data, labels, color)],
      },
      plugins: [
        {
          beforeDraw: function (chart) {
            var width = chart.chart.width,
              height = chart.chart.height,
              ctx = chart.chart.ctx;

            ctx.restore();
            var fontSize = (height / 100).toFixed(2);
            ctx.font = fontSize + "em neue bold";
            ctx.textBaseline = "middle";
            ctx.fillStyle = colors.labelInside;

            var text = Filters.taxMask(data[0]),
              textX = Math.round((width - ctx.measureText(text).width) / 2),
              textY = height / 2;

            ctx.fillText(text, textX, textY);
            ctx.save();
          },
        },
      ],
      options: createDoughnutOptions("", "%"),
    },
    labels,
  };
}

function createBarChartData(data, labels, color) {
  return {
    chartData: {
      type: "bar",
      data: {
        datasets: [
          createBarDataset(data, labels.planned, color, 0, color[2]),
          createBarDataset(data, labels.current, color, 1),
        ],
      },
      plugins: [ChartDataLabels],
      options: {
        maintainAspectRatio: false,
        plugins: {
          datalabels: createFixedDatalabels(
            colors.valueIndicativeBackground,
            colors.valueIndicativeBorder,
            colors.labelInside,
            (value) => Math.round(value)
          ),
        },
        labels: {
          display: false,
        },
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
        layout: createLayoutWithDatalabels(),
        scales: createBarScales(colors.lines, colors.label),
      },
    },
    labels,
  };
}

function createChartData(data, barColors, doughnutColors) {
  const labels = ["x", "y"];
  return {
    firstTurn: createBarChartData(data.firstTurn, labels, barColors),
    secondTurn: createBarChartData(data.secondTurn, labels, barColors),
    thirdTurn: createBarChartData(data.thirdTurn, labels, barColors),
    global: createDoughnutChartData(data.global, labels, doughnutColors),
  };
}

export default function getCapacityLoadProcessCharts(response) {
  return {
    ...response,
    data: createChartData(
      response,
      [colors.load.ideal, colors.load.actual, colors.load.idealBorder],
      [colors.load.doughnutPrimary, colors.load.doughnutSecundary]
    ),
  };
}
