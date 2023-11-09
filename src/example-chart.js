import { LitElement, html, css } from "lit";
import Highcharts from "highcharts";
import treemap from 'highcharts/modules/treemap';
import { dataset } from "./dataset.js";



treemap(Highcharts);

class ExampleChart extends LitElement {
  static styles = css`
    .highcharts-figure,
    .highcharts-data-table table {
      min-width: 320px;
      max-width: 600px;
      margin: 1em auto;
    }

    .highcharts-data-table table {
      font-family: Verdana, sans-serif;
      border-collapse: collapse;
      border: 1px solid #ebebeb;
      margin: 10px auto;
      text-align: center;
      width: 100%;
      max-width: 500px;
    }

    .highcharts-data-table caption {
      padding: 1em 0;
      font-size: 1.2em;
      color: #555;
    }

    .highcharts-data-table th {
      font-weight: 600;
      padding: 0.5em;
    }

    .highcharts-data-table td,
    .highcharts-data-table th,
    .highcharts-data-table caption {
      padding: 0.5em;
    }

    .highcharts-data-table thead tr,
    .highcharts-data-table tr:nth-child(even) {
      background: #f8f8f8;
    }

    .highcharts-data-table tr:hover {
      background: #f1f7ff;
    }
  `;

  renderChart() {
    const container = this.shadowRoot.querySelector('#container');

    Highcharts.chart(container, {
      series: [
        {
          name: "Legal owners",
          type: "treemap",
          layoutAlgorithm: "squarified",
          alternateStartingDirection: true,
          allowDrillToNode: true,
          borderColor: "#fff",
          borderRadius: 6,
          borderWidth: 2,
          dataLabels: {
            style: {
              textOutline: "none",
            },
          },
          levels: [
            {
              level: 1,
              //layoutAlgorithm: "sliceAndDice",
              dataLabels: {
                enabled: true,
                align: "left",
                verticalAlign: "top",
                style: {
                  fontSize: "15px",
                  fontWeight: "bold",
                },
              },
            },
          ],
          data: [
            {
              id: "A",
              name: "Thor Spandown",
              color: "#03224C",
            },
            {
              id: "B",
              name: "Jan Spandown",
              color: "#826C7F",
            },
            {
              id: "AA",
              name: "Level 2A",
              parent: "A",
              value: 10,
            },
            {
              id:"AAA",
              name: "Level 3A",
              parent: "AA",
              value: 15,
            },
            {
              id:"BB",
              name: "Level 2B",
              parent: "B",
              value: 26,
            },
            {
              id:"BB2",
              name: "Level 2B",
              parent: "B",
              value: 10,
            },
          ],
        },
      ],
      title: {
        text: "Ownership by individual",
        align: "left",
      },
      subtitle: {
        text: 'Source: <a href="https://snl.no/Norge" target="_blank">Penneo</a>',
        align: "left",
      },
      tooltip: {
        useHTML: true,
        pointFormat:
          "The ownership of <b>{point.name}</b> is <b>{point.value} %</b>",
      },
    });
  }

  firstUpdated() {
    this.renderChart();
  }

  render() {
    return html`
      <div>
        <div id="container"></div>
        <figure class="highcharts-figure"></figure>
      </div>
    `;
  }
}

customElements.define("example-chart", ExampleChart);
