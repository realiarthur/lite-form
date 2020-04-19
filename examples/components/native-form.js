import { withForm } from '../../src'

class LiteForm extends HTMLFormElement {
  connectedCallback() {
    this.addEventListener('submit', this.handleSubmit)
    this.addEventListener('reset', this.handleReset)
  }

  disconnectedCallback() {
    this.removeEventListener('submit', this.handleSubmit)
    this.removeEventListener('reset', this.handleReset)
  }
}

LiteForm = withForm(LiteForm)

customElements.define('native-form', LiteForm, { extends: 'form' })
