import { LitElement, html, css } from "lit";
import "./example-chart.js";

export class App extends LitElement {
  render() {
    return html`
      <div class="list">
        <example-chart></example-chart>
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
