import { html } from 'lit-element'

const formRender = ({ values, handleBlur, handleChange }) =>
  html` 
    <custom-input name="login"></custom-input>
    <error-message name="login"></error-message>

    <custom-input name="password" type="password"></custom-input>
    <error-message name="password"></error-message>

    <button type="submit">Submit</button>`

const MyForm = html` <h4>lite-form element</h4>
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
  ></lite-form>`

export default MyForm
