import { LitElement, html, css } from "lit";
import Highcharts from "highcharts";
import networkgraph from "highcharts/modules/networkgraph";
import { dataset } from "./dataset.js";

networkgraph(Highcharts);

const data = dataset
  .map(({ relationshipDetails }) => {
    return relationshipDetails.map((r) => {
      return {
        id: `${r.startNodeID}-${r.endNodeID}`,
        from: String(r.startNodeID),
        to: String(r.endNodeID),
        weight: (Number(r.OwnedStake) * 100).toFixed(3),
        color: "gray",
      };
    });
  })
  .flat();

const nodesData = dataset
  .map(({ nodes }) => {
    return nodes.flat().map((n) => {
      return { value8Id: n.Valu8Id, name: n.Name, label: n.label };
    });
  })
  .flat();

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
      const nodes = {};

      if (
        this instanceof Highcharts.Series.types.networkgraph &&
        e.options.id === "ownership-tree"
      ) {
        e.options.data.forEach((link) => {
          const node = nodesData.find(
            ({ value8Id }) => Number(link.from) === value8Id
          );

          nodes[link.from] = {
            id: link.from,
            name: node.name,
            color: node.label === "Person" ? "#c3e2ff" : "#03224c",
          };
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
          id: "ownership-tree",
          animation: false,
          marker: {
            radius: 15,
            symbol: "square",
          },
          dataLabels: {
            enabled: true,
            allowOverlap: true,
            linkFormat: `{point.weight}% \u2192`,
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
