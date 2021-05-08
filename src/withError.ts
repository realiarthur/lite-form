import { Constructor, CustomElement } from './types'

import { EVENTS } from './withForm'
import get from 'lodash-es/get'
import { withFormClass } from './withFormClass'

// Super need to have "name" attribute
// HoC which returns "error" and "touched" from form by "name"
export const withError = <T extends Constructor<CustomElement<{name: string}>>>(Component: T) => {
  return class extends withFormClass(Component) {
      touched?: boolean; 
      error?: string; 

      _onFormErrorsChange = (e: Event | CustomEvent): void => {
        const detail = (e as CustomEvent).detail;
        this.touched = get(detail.touched, this.name)
        this.error = get(detail.errors, this.name)
      }

      connectedCallback(): void {
        super.connectedCallback && super.connectedCallback()

        this.touched = get(this._formClass.touched, this.name)
        this.error = get(this._formClass.errors, this.name)

        this._formClass.addEventListener(
          EVENTS.errorsChange,
          this._onFormErrorsChange
        )
      }

      disconnectedCallback(): void {
        super.disconnectedCallback && super.disconnectedCallback()

        this._formClass.removeEventListener(
          EVENTS.errorsChange,
          this._onFormErrorsChange
        )
      }
    }
}
