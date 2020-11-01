import { LitElement, html } from 'lit-element'

import { withForm } from '../../dist/index.js'

class NotWrappedInputsForm extends LitElement {
  createRenderRoot() {
    return this
  }

  static get properties() {
    return {
      values: { type: Object },
      errors: { type: Object },
      touched: { type: Object }
    }
  }

  render() {
    return html`
      <h4>Native inputs</h4>

      <form method="POST" @submit=${this.handleSubmit}>
        <input
          id="login"
          @input=${this.handleChange}
          @change=${this.handleChange}
          @blur=${this.handleBlur}
          .value=${this.values.login}
        />
        ${this.errors.login && this.touched.login
          ? html`<p class="error-message">${this.errors.login}</p>`
          : null}
        <input
          id="password"
          type="password"
          @input=${this.handleChange}
          @change=${this.handleChange}
          @blur=${this.handleBlur}
          .value=${this.values.password}
        />

        ${this.errors.password && this.touched.password
          ? html`<p class="error-message">${this.errors.password}</p>`
          : null}

        <label>
          <input
            @change=${this.handleChange}
            ?checked=${this.values.radio == 1}
            name="radio"
            type="radio"
            value="1"
          />
          1
        </label>
        <label
          ><input
            @change=${this.handleChange}
            ?checked=${this.values.radio == 2}
            name="radio"
            type="radio"
            value="2"
          />
          2
        </label>
        <label>
          <input
            @change=${this.handleChange}
            ?checked=${this.values.radio == 3}
            name="radio"
            type="radio"
            value="3"
          />
          3
        </label>

        <textarea name="textarea" cols="20" @change=${this.handleChange}>
        </textarea>

        <select name="select" @change=${this.handleChange}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>

        <select
          name="multiple"
          size="5"
          ?multiple=${true}
          @change=${this.handleChange}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>

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

customElements.define('not-wrapped-inputs-form', enhance(NotWrappedInputsForm))
