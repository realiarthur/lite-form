import { LitElement, html } from 'lit-element'
import { withForm } from '../../src'


class WrappedInputsForm extends LitElement {
  createRenderRoot() {
    return this
  }

  render() {
    return html`
      <h4>Inputs and Form HOCs</h4>
      <form method="POST" @submit=${this.handleSubmit}>
        <custom-input name="login"></custom-input>
        <error-message name="login"></error-message>

        <custom-input name="password" type="password"></custom-input>
        <error-message name="password"></error-message>

        <button type="submit">Submit</button>
      </form>
    `
  }
}

const enhance = withForm({
  initialValues: { login: '', password: '' },
  onSubmit: values => console.log(values),
  validationSchema: {
    login: value => {
      if (!value) return 'Required'
    },
    password: value => {
      if (value.length < 5) return 'Must be more than 5 letters'
    }
  }
})

customElements.define('wrapped-inputs-form', enhance(WrappedInputsForm))
