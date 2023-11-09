import { LitElement, html, css } from "lit";
import * as d3 from "d3";

class ExampleChart extends LitElement {
  static styles = css`
    #chart {
      background: gray;
    }
  `;

  renderChart() {
    const data = [10, 25, 30, 45, 20];

    const svg = d3
      .select(this.shadowRoot.querySelector("#chart"))
      .append("svg")
      .attr("width", 400)
      .attr("height", 200);

    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * 80)
      .attr("y", (d) => 200 - d * 4)
      .attr("width", 40)
      .attr("height", (d) => d * 4)
      .attr("fill", "blue");
  }

  firstUpdated() {
    this.renderChart();
  }

  render() {
    return html` <div id="chart"></div> `;
  }
}

customElements.define("example-chart", ExampleChart);
