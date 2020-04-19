# Lite Form
Form HOC for Web Components. It's also works for LitElement.

- [Examples](#examples)
- [API Reference](#api-reference)
- [Remarks](#remarks)


## Examples
Lite Form implements a Formik-like API, so just try using it. See [API Reference](#api-reference) for more information.
- [Native Inputs](#native-inputs)
- [Custom Inputs](#custom-inputs)
- [Form Base Class](#form-base-class)
- [Builtin Element Extends](#builtin-element-extends)

### Native Inputs


```js 
import { LitElement, html } from 'lit-element'
import { withForm } from 'lite-form'

class MyForm extends LitElement {
  static get properties() {
    return {
      values: { type: Object },
      errors: { type: Object },
      touched: { type: Object }
    }
  }

  render() {
    return html`
      <form method="POST" @submit=${this.handleSubmit}>
        <input
          id="login"
          @input=${this.handleChange}
          @change=${this.handleChange}
          @blur=${this.handleBlur}
          .value=${this.values.login}
        />
        ${this.errors.login && this.touched.login
          ? this.errors.login
          : ''}
        <input
          id="password"
          type="password"
          @input=${this.handleChange}
          @change=${this.handleChange}
          @blur=${this.handleBlur}
          .value=${this.values.password}
        />

        ${this.errors.password && this.touched.password
          ? this.errors.password
          : ''}

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

customElements.define('native-inputs-form', enhance(MyForm))

```

### Custom Inputs
It will become more concise if you create your own `<custom-input>` using `withField` and `<error-message>` using `withError`:
```js
import { LitElement, html } from 'lit-element'
import { withForm } from 'lite-form'

class MyForm extends LitElement {
  render() {
    return html`
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

customElements.define('wrapped-inputs-form', enhance(MyForm))
```

Here are the components:

```js
// custom-input
import { LitElement, html } from 'lit-element'
import { withField } from 'lite-form'

export default class ExwcInput extends LitElement {
  static get properties() {
    return {
      type: { type: String },
      name: { type: String },
      value: { type: String }
    }
  }

  constructor() {
    super()
    this.type = 'text'
    this.value = ''
  }

  render() {
    return html`
      <input
        autocomplete="off"
        type=${this.type}
        name=${this.name}
        .value=${this.value}
        @input=${this.handleChange}
      />
    `
  }
}

customElements.define('custom-input', withField(ExwcInput))
```

```js
// error-message
import { LitElement, html } from 'lit-element'
import { withError } from 'lite-form'

export default class ExwcInput extends LitElement {
  static get properties() {
    return {
      name: { type: String },
      error: { type: String },
      touched: { type: Boolean }
    }
  }

  render() {
    return html`
      ${this.error && this.touched
        ? this.error
        : ''}
    `
  }
}

customElements.define('error-message', withError(ExwcInput))
```

### Form Base Class
You can also create your own base form class. For example:
```js
// Form Base Class
import { LitElement, html } from 'lit-element'
import { withForm } from 'lite-form'

class LiteForm extends LitElement {
  render() {
    return html`<form @submit=${this.handleSubmit} method=${this.method}>
      ${this.formRender(this)}
    </form>`
  }
}

customElements.define('lite-form', withForm(LiteForm))
```

And use it in HTML:

```js
// Using Base Form Class
import { html, render } from 'lit-html'


const formRender = ({ values, handleBlur, handleChange }) =>
  html` 
    <custom-input name="login"></custom-input>
    <error-message name="login"></error-message>

    <custom-input name="password" type="password"></custom-input>
    <error-message name="password"></error-message>

    <button type="submit">Submit</button>
  `

const MyForm = html`
  <lite-form
    method="post"
    .formRender=${formRender}
    .onSubmit=${values => console.log(values)}
    .initialValues=${{
      login: '',
      password: ''
    }}
    .validationSchema=${{
      login: value => {
        if (!value) return 'Required'
      },
      password: value => {
        if (value.length < 5) return 'Must be more than 5 letters'
      }
    }}
  ></lite-form>
`

render(html`${MyForm}`, document.getElementById('root'))
```
Don't use a slot instead of providing a form template if you need from events - the form will not trigger its events on elements inside the slot.

### Builtin Element Extends
You can also extends builtin form element using Lite Form:

```js
import { withForm } from 'lite-form'

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

customElements.define('native-form', withForm(LiteForm), { extends: 'form' })
```

And use it in HTML:

```js
// Using form element
import { html } from 'lit-element'

const MyForm = html`
  <form
    is="native-form"
    .onSubmit=${values => console.log(values)}
    .initialValues=${{
      login: '',
      password: ''
    }}
    .validationSchema=${{
      login: value => {
        if (!value) return 'Required'
      },
      password: value => {
        if (value.length < 5) return 'Must be more than 5 letters'
      }
    }}
  >
    <custom-input name="login"></custom-input>
    <error-message name="login"></error-message>

    <custom-input name="password" type="password"></custom-input>
    <error-message name="password"></error-message>

    <button type="submit">Submit</button>
  </form>
`

render(html`${MyForm}`, document.getElementById('root'))
```

Customising builtin elements does not work in Safari and iOS (13) without polyfill.

## API Reference
- [withForm](#withform)
- [withField](#withfield)
- [withError](#witherror)
- [withValue](#withvalue)
- [withFormClass](#withformclass)

### withForm
##### Usage
`withForm(config)(Component)` or `withForm(ComponentWithConfig)`

Instead of using config in the HOC, you can put it in the Component class. This will allow you to create your own base form class.

##### Config
- onSubmit: `(values, props)=>{}`
- initialValues: `{ propName: value }`
- validationSchema: `{ propName: (value, props) => 'error'||{} }`
- validateOnBlur: `boolean`. Default: `true`
- validateOnChang: `boolean`. Default: `true`

##### Props
- values: `object`
- errors: `object`
- touched: `object`
- isValid: `boolean`
- handleSubmit: `function`
- handleChange: `(path || event, value) => {}`. event: `Event: {target: {name || id, value}} || CustomEvent: {detail: {name || id, value}}`
- handleBlur: `(path || event) => {}`. event: `Event: {target: {name || id}} || CustomEvent: {detail: {name || id}}`
- handleValidate: `function`
- handleReset: `function`

##### Events
- values_change: `e=>console.log(e.detail.values)`
- errors_touched_change: `e=>console.log(e.detail.errors, e.detail.touched)`


### withField
##### Usage
`withField(Component)` or `withField(config)(Component)`

Component must have `name` (means path) or `id` attribute.

##### Config (optional)
- captureBlur `boolean`. Default: `true`
- listenChange `boolean`. Default: `false`

`captureBlur` is usefull if you don't use Shadow DOM in your Component or if you use it with slots. If you use Shadow DOM without slots the event will be bubbling (composed) by default and you don't need to use capture for it.

`listenChange` is usefull if you don't using Shadow DOM in your Component or if your Component dispatch @change event (with options {bubbles: true, composed: true}) instead of using handleChange method. It is useless if you use Shadow DOM in your Component and not dispatch @change event, because js will replace `event.target` from your internal input to your Component, and it will lose `target.value`

##### Props
- value: `any`
- handleChange: `(value || event) => {}`. event: `Event: {target: {value}} || CustomEvent: {detail: {value}}`
- handleBlur: `function`

##### Listening Events
- blur: `Event or CustomEvent`. If `captureBlur==true` it will be listening on capturing phase.
- change: `Event: {target: {value}} || CustomEvent: {details: {value}}`. Listening only if `listenChange==true`


### withError
##### Usage
`withError(Component)`

Component must have `name` (means path) or `id` attribute.

##### Props
- error: `object`
- touched: `object`


### withValue
##### Usage 
`withValue(Component)`

Component must have `name` (means path) or `id` attribute.

##### Props
- value: `any`

### withFormClass
##### Usage
`withFormClass(Component)`

##### Props
- _formClass: your withForm(Component) `class`. It's usefull to build your own HOCs.


## Remarks
- Don't use slots with input elements inside `<form>` tag if you need to catch form's events from them!
- Don't use Shadow DOM if you need autofill to your form (e.g. login & password)!
- Customising builtin elements does not work in Safari and iOS (13) without polyfill.
