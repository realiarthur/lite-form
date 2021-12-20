import { withFormClass } from './withFormClass'
import { EVENTS } from './withForm'
import get from 'lodash.get'

// Super need to have "name" attribute
// HoC which returns "error" and "touched" from form by "name"
export const withError = Сomponent => {
  return withFormClass(
    class extends Сomponent {
      _onFormErrorsChange = e => {
        if (!e) return
        
        const { name, touched, error } = e.detail
        if (name === this.name) {
          this.touched = touched
          this.error = error
        }
      }

      connectedCallback() {
        super.connectedCallback && super.connectedCallback()

        this.touched = get(this._formClass.touched, this.name)
        this.error = get(this._formClass.errors, this.name)

        this._formClass.addEventListener(EVENTS.errorsChange, this._onFormErrorsChange)
      }

      disconnectedCallback() {
        super.disconnectedCallback && super.disconnectedCallback()

        this._formClass.removeEventListener(EVENTS.errorsChange, this._onFormErrorsChange)
      }
    },
  )
}
