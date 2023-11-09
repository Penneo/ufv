import { LitElement, html, css } from "lit";
import Highcharts from "highcharts";
import networkgraph from "highcharts/modules/networkgraph";
import "./label";
import { dataset } from "./dataset.js";

networkgraph(Highcharts);

const data = dataset
  .map((item) => {
    return item.relationshipDetails.map((r) => {
      return {
        from: String(r.startNodeID),
        to: String(r.endNodeID),
        weight: Number(r.OwnedStake),
        color: "gray",
        name: "hello",
      };
    });
  })
  .flat();

console.log(data);

class ExampleChart3 extends LitElement {
  static styles = css`
    #container {
      min-width: 600px;
      max-width: 800px;
      margin: 0 auto;
      height: 500px;
    }
  `;

  renderChart() {
    const container = this.shadowRoot.querySelector("#container");
    Highcharts.addEvent(Highcharts.Series, "afterSetOptions", function (e) {
      const colors = Highcharts.getOptions().colors;
      const nodes = {};
      let i = 0;

      if (
        this instanceof Highcharts.Series.types.networkgraph &&
        e.options.id === "language-tree"
      ) {
        e.options.data.forEach(function (link) {
          if (link[0] === "Proto Indo-European") {
            nodes["Proto Indo-European"] = {
              id: "Proto Indo-European",
              marker: {
                radius: 28,
              },
            };
            nodes[link[1]] = {
              id: link[1],
              marker: {
                radius: 18,
              },
              color: colors[i++],
            };
          } else if (nodes[link[0]] && nodes[link[0]].color) {
            nodes[link[1]] = {
              id: link[1],
              color: nodes[link[0]].color,
            };
          }
        });

        e.options.nodes = Object.keys(nodes).map(function (id) {
          return nodes[id];
        });
      }
    });

    Highcharts.chart(container, {
      chart: {
        type: "networkgraph",
        marginTop: 80,
      },
      title: {
        text: "Ownership",
      },
      subtitle: {
        text: "A Force-Directed Network Graph in Highcharts",
      },
      plotOptions: {
        networkgraph: {
          keys: ["from", "to"],
          draggable: false,
          layoutAlgorithm: {
            enableSimulation: false,
            integration: "verlet",
            approximation: "barnes-hut",
          },
        },
      },
      series: [
        {
          animation: false,
          id: "language-tree",
          marker: {
            radius: 13,
            symbol: "square",
          },
          dataLabels: {
            enabled: true,
            align: "center",
            allowOverlap: false,
          },

          data: data,
        },
      ],
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

customElements.define("example-chart3", ExampleChart3);
