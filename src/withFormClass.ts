import './utils'

// closest polyfill
import { ConnectableElement, Constructor, FormElement } from './types';

import { IS_LITE_FORM } from './withForm'

// HoC which add "_formClass" prop - link to withForm super class
const getFormClass = (element: Element): FormElement => {
  const form = element.closest(`[${IS_LITE_FORM}]`)
  if (form) return form as FormElement;

  const host = (element.getRootNode() as any).host
  if (!host) throw new Error('Lite-form not found')
  return host[IS_LITE_FORM] ? host : getFormClass(host)
}

export const withFormClass = <T extends Constructor<ConnectableElement>>(Component: T) => {
  return class extends Component {
    _formClass: FormElement;
    
    connectedCallback() {
      // Optimization - it don't need to looking for form if class already have it
      this._formClass = this._formClass ?? getFormClass(this)
      super.connectedCallback && super.connectedCallback()
    }
  }
}
