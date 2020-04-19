import { LitElement, html } from 'lit-element'
import { ifDefined } from 'lit-html/directives/if-defined'
import { withField } from '../../src/withField'

export default class ExwcInput extends LitElement {
  static get properties() {
    return {
      type: { type: String },
      name: { type: String },

      // from withField
      value: { type: String, reflect: true }
    }
  }

  constructor() {
    super()
    this.type = 'text'
    this.value = ''
  }

  createRenderRoot() {
    return this
  }

  // If you use shadowDOM, there is 2 variats:
  // 1. dispatch custom event
  //   onChange = e => {
  //     e.preventDefault();
  //     this.dispatchEvent(
  //       new CustomEvent("change", {
  //         bubbles: true,
  //         composed: true,
  //         detail: {value: e.target.value},
  //       })
  //     );
  //   };
  // @input=${this.onChange}

  // 2. Or use handleChange, which comes from withField
  // @input=${this.handleChange}

  render() {
    return html`
      <input
        autocomplete="off"
        type=${this.type}
        name=${ifDefined(this.name)}
        .value=${ifDefined(this.value)}
        @input=${this.handleChange}
      />
    `
  }
}

customElements.define('custom-input', withField({captureBlur: true, listenChange: true})(ExwcInput))
