// closest polyfill
import { IS_LITE_FORM } from './withForm'
import './utils'

// HoC which add "_formClass" prop - link to withForm super class
const getFormClass = element => {
  const form = element.closest(`[${IS_LITE_FORM}]`)
  if (form) return form

  const host = element.getRootNode().host
  if (!host) throw new Error('Lite-form not found')
  return host[IS_LITE_FORM] ? host : getFormClass(host)
}

export const withFormClass = Сomponent => {
  return class extends Сomponent {
    connectedCallback() {
      // Optimization - it don't need to looking for form if class already have it
      this._formClass = this._formClass || getFormClass(this)
      super.connectedCallback && super.connectedCallback()
    }
  }
}
