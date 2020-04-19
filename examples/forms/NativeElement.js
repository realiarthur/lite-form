import { html } from 'lit-element'

// const formRender = () =>
//   html` <custom-input name="login"></custom-input>
//     <error-message name="login"></error-message>

//     <custom-input name="password" type="password"></custom-input>
//     <error-message name="password"></error-message>

//     <button type="submit">Submit</button>`

const MyForm = html`
  <h4>Builtin form element</h4>

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
export default MyForm
