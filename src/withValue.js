import { withFormClass } from './withFormClass'
import { EVENTS } from './withForm'
import get from 'lodash.get'

// Super need to have "name" or "id" attribute
// HoC which returns "value" from form by "name" or "id"
export const withValue = Сomponent => {
  return withFormClass(
    class extends Сomponent {
      _onFormValuesChange(e) {
        this.value = get(e.detail.values, this.name || this.id)
      }

      connectedCallback() {
        super.connectedCallback && super.connectedCallback()

        this.value = get(this._formClass.values, this.name || this.id)

        this._formClass.addEventListener(
          EVENTS.valuesChange,
          this._onFormValuesChange.bind(this)
        )
      }

      disconectedCallback() {
        super.disconectedCallback && super.disconectedCallback()

        this._formClass.removeEventListener(
          EVENTS.valuesChange,
          this._onFormValuesChange
        )
      }
    }
  )
}
