import './components/custom-input'
import './components/error-message'
import './components/lite-form'
import './components/native-form'
import './forms/NativeInputsForm'
import './forms/WrappedInputsForm'
import './style.css'

import BaseClass from './forms/BaseClass'
import NativeElement from './forms/NativeElement'
import { html } from 'lit-element'
import { render } from 'lit-html'

render(
  html`<not-wrapped-inputs-form></not-wrapped-inputs-form>
  <wrapped-inputs-form></wrapped-inputs-form>
    ${BaseClass} ${NativeElement}`,
  document.getElementById('root')
)
