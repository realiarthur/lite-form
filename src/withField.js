import { withValue } from './withValue'
import { getEventTarget, getValueFromEventTarget } from './utils'

/*
HoC which returns add "handleChange" and "handleBlur" methods for field
and setListener for "blur" and "change" events
also wrap in withValue and provide "value"
Super need to have "name" or "id" attribute

Works both native and custom event.
Your custom @change event detail need to have "value" prop

captureBlur is usefull if you don't use shadowDOM in your Component or if you use it with slots.
If you use shadowDOM without slots the event will be bubbling (composed) by default and you don't need to use capture for it.

listenChange is usefull if you don't use shadowDOM in your Component
or if your Component dispatch @change event (with options {bubbles: true, composed: true}) instead of use handleChange method.
It useless if you use shadowDOM in your Component and not dispatch @change event,
because js will replace event.target from your inner input to your Component 
*/

export const withField = configOrComponent => {
  if (typeof configOrComponent === 'object') {
    return withFieldExtended(configOrComponent)
  }
  return withFieldExtended()(configOrComponent)
}

const withFieldExtended = ({
  captureBlur = true,
  listenChange = false
}={}) => Compoment =>
  withValue(
    class LiteField extends Compoment {
      handleChange = eventOrValue => {
        const changeExecutor = this._formClass.handleChange(
          this.name || this.id
        )

        // if event
        const eventTarget = getEventTarget(eventOrValue)
        if (eventTarget) {
          const value = getValueFromEventTarget(eventTarget)
          changeExecutor(value)
          return
        }

        // if value
        changeExecutor(eventOrValue)
      }

      handleBlur = () => {
        this._formClass.handleBlur(this.name || this.id)
      }

      connectedCallback() {
        super.connectedCallback && super.connectedCallback()
        this.addEventListener('blur', this.handleBlur, captureBlur)
        if (listenChange) {
          this.addEventListener('change', this.handleChange)
        }
      }

      disconnectedCallback() {
        super.disconnectedCallback && super.disconnectedCallback()
        this.removeEventListener('blur', this.handleBlur, captureBlur)
        if (listenChange) {
          this.removeEventListener('change', this.handleChange)
        }
      }
    }
  )
