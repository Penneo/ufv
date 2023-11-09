import { LitElement, html, css } from "lit";
import "./example-chart.js";
import "./example-chart2.js";

export class App extends LitElement {
  render() {
    return html`
      <div class="list">
        <example-chart2></example-chart2>
        <!-- Add more components here -->
      </div>
    `;
  }

  static styles = css`
    .list {
      display: flex;
      align-items: center;
      flex-direction: column;
      gap: 20px;
    }
  `;
}

window.customElements.define("wc-app", App);
