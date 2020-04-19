import { LitElement, html } from 'lit-element'
import { withError } from '../../src/withError'

export default class ExwcInput extends LitElement {
  createRenderRoot() {
    return this
  }

  static get properties() {
    return {
      name: { type: String },

      // from withError
      error: { type: String },
      touched: { type: Boolean }
    }
  }

  render() {
    return html`
      ${this.error && this.touched
        ? html`<span class="error-message">${this.error}</span>`
        : null}
    `
  }
}

customElements.define('error-message', withError(ExwcInput))
