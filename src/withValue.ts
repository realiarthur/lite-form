import { Constructor, CustomElement, InputValue } from './types'

import { EVENTS } from './withForm'
import get from 'lodash-es/get'
import { withFormClass } from './withFormClass'

// Super need to have "name" or "id" attribute
// HoC which returns "value" from form by "name" or "id"
export const withValue = <T extends Constructor<CustomElement<{name?: string, id?: string}>>>(Component: T) => {
  return class extends withFormClass(Component) {
      value!: InputValue;

      _onFormValuesChange(e: Event): void {
        const detail = (e as CustomEvent).detail;
        this.value = get(detail.values, this.name || this.id)
      }

      connectedCallback(): void {
        super.connectedCallback && super.connectedCallback()

        this.value = get(this._formClass.values, this.name || this.id)

        this._formClass.addEventListener(
          EVENTS.valuesChange,
          this._onFormValuesChange.bind(this)
        )
      }

      disconnectedCallback(): void {
        super.disconnectedCallback && super.disconnectedCallback()

        this._formClass.removeEventListener(
          EVENTS.valuesChange,
          this._onFormValuesChange
        )
      }
    }
}
