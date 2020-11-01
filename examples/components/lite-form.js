import { LitElement, html } from 'lit-element'

import { withForm } from '../../dist/index.js'

class LiteForm extends LitElement {
  static get properties() {
    return {
      method: { type: String },
    }
  }

  createRenderRoot() {
    return this
  }

  constructor() {
    super()
    this.method = 'POST'
  }

  render() {
    return html`<form @submit=${this.handleSubmit} method=${this.method}>
      ${this.formRender(this)}
    </form>`
  }
}

LiteForm = withForm(LiteForm)

customElements.define('lite-form', LiteForm)
