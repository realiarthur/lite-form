import { ConnectableElement, Constructor, CustomElement, InputValue } from './types'
import { getEventTarget, getValueFromEventTarget } from './utils'

import { withValue } from './withValue'

/*
HoC which returns add "handleChange" and "handleBlur" methods for field
and setListener for "blur" and "change" events
also wrap in withValue and provide "value"
Super need to have "name" or "id" attribute

Works both native and custom event.
Your custom @change event detail need to have "value" prop

captureBlur is useful if you don't use shadowDOM in your Component or if you use it with slots.
If you use shadowDOM without slots the event will be bubbling (composed) by default and you don't need to use capture for it.

listenChange is useful if you don't use shadowDOM in your Component
or if your Component dispatch @change event (with options {bubbles: true, composed: true}) instead of use handleChange method.
It useless if you use shadowDOM in your Component and not dispatch @change event,
because js will replace event.target from your inner input to your Component 
*/

export interface FieldConfig {
  captureBlur: boolean;
  listenChange: boolean;
}

export function withField(config: FieldConfig): ReturnType<typeof withFieldExtended>;
export function withField(Component: Constructor<ConnectableElement>): ReturnType<ReturnType<typeof withFieldExtended>>;
export function withField(configOrComponent: FieldConfig | Constructor<ConnectableElement>): ReturnType<typeof withFieldExtended> | ReturnType<ReturnType<typeof withFieldExtended>> {
  if (typeof configOrComponent === 'object') {
    return withFieldExtended(configOrComponent)
  }
  return withFieldExtended()(configOrComponent)
}

const withFieldExtended = (config: FieldConfig = {captureBlur: true, listenChange: false}) => <T extends Constructor<CustomElement<{name?: string, id?:string}>>>(Component: T) =>
    class LiteField extends withValue(Component) {

      setValue = (value: InputValue, validate = false): void => {
        this._formClass.setValue(this.name || this.id, value, validate);
      }

      handleChange = (event: Event | CustomEvent): void => {
       const eventTarget = getEventTarget(event)
        if (eventTarget) {
          const value = getValueFromEventTarget(eventTarget)
          this.setValue(value, this._formClass._validateOnChange)
        }
      }

      setTouched = (validate = false): void => {
        this._formClass.setTouched(this.name || this.id, validate);
      }

      // Handle blur events.
      handleBlur = (): void => {
        this.setTouched(this._formClass._validateOnBlur)
      }

      connectedCallback(): void {
        const {captureBlur, listenChange} = config;
        
        super.connectedCallback && super.connectedCallback()
        this.addEventListener('blur', this.handleBlur, captureBlur === true)
        if (listenChange) {
          this.addEventListener('change', this.handleChange)
        }
      }

      disconnectedCallback(): void {
        const {captureBlur, listenChange} = config;
        
        super.disconnectedCallback && super.disconnectedCallback()
        this.removeEventListener('blur', this.handleBlur, captureBlur === true)
        if (listenChange) {
          this.removeEventListener('change', this.handleChange)
        }
      }
    }
  
