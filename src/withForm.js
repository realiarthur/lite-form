import set from 'lodash.set'
import get from 'lodash.get'
import cloneDeep from 'lodash.clonedeep'
import { shalowEqual } from './utils'

import { getEventTarget, getValueFromEventTarget, setBooleanValue } from './utils'

export const IS_LITE_FORM = 'data-isliteform'
export const EVENTS = {
  valuesChange: 'values_change',
  errorsChange: 'errors_touched_change',
}

export const withForm = configOrComponent => {
  if (typeof configOrComponent === 'object') {
    return withFormExtended(configOrComponent)
  }
  return withFormExtended()(configOrComponent)
}

const withFormExtended =
  ({ onSubmit, initialValues, validationSchema, validateOnBlur, validateOnChange } = {}) =>
  Component =>
    class LiteForm extends Component {
      connectedCallback() {
        // take params from HOC argument, or from class (if you build base class, like <lite-form>) or default
        this._onSubmit = (onSubmit || this.onSubmit || function () {}).bind(this)
        this._initialValues = initialValues || this.initialValues || {}
        if (typeof this._initialValues === 'function') {
          this._initialValues = this._initialValues(this)
        }
        this._validationSchema = validationSchema || this.validationSchema || {}
        this._validateOnBlur = setBooleanValue(validateOnBlur, this.validateOnBlur, true)
        this._validateOnChange = setBooleanValue(validateOnChange, this.validateOnChange, true)

        // isLiteForm atribute for HOCs can find their form element
        this.setAttribute(IS_LITE_FORM, 'true')

        this.handleReset()
        super.connectedCallback && super.connectedCallback()
      }

      get _values() {
        return this.values
      }

      set _values(values) {
        this.values = values

        this.dispatchEvent(
          new CustomEvent(EVENTS.valuesChange, {
            detail: { values: this.values },
          }),
        )
      }

      handleReset = e => {
        e && e.preventDefault()
        this._values = cloneDeep(this._initialValues)
        this.touched = {}
        this.errors = {}
        this.isValid = undefined
      }

      handleSubmit = e => {
        e && e.preventDefault()

        this.handleValidate()

        if (this.isValid) {
          this._onSubmit(this._values, this)
        } else {
          // Touch all fields to show validation errors
          Object.keys(this._validationSchema).forEach(fieldName => {
            if (get(this.touched, fieldName)) return

            this.touched = set(this.touched, fieldName, true)

            this.dispatchEvent(
              new CustomEvent(EVENTS.errorsChange, {
                detail: { name: fieldName, error: get(this.errors, fieldName), touched: true },
              }),
            )
          })
        }
      }

      handleBlur = nameOrEvent => {
        // if nameOrEvent is name - set touched for name and handleValidate if needed
        if (typeof nameOrEvent === 'string') {
          if (!get(this.touched, nameOrEvent)) {
            this.touched = set(this.touched, nameOrEvent, true)

            this.dispatchEvent(
              new CustomEvent(EVENTS.errorsChange, {
                detail: { name: nameOrEvent, error: get(this.errors, nameOrEvent), touched: true },
              }),
            )
          }
          if (this._validateOnBlur) {
            this.handleValidate()
          }
        }

        // if nameOrEvent is event - get name and execute this.handleBlur with it
        const eventTarget = getEventTarget(nameOrEvent)
        if (eventTarget) {
          const { name, id } = eventTarget

          this.handleBlur(name || id)
        }
      }

      setValue = (name, value) => {
        this._values = set(cloneDeep(this.values), name, value)
      }

      handleChange = nameOrEvent => {
        // if nameOrEvent is name - return function that will change value for this name
        if (typeof nameOrEvent === 'string') {
          return value => {
            this.setValue(nameOrEvent, value)
            if (this._validateOnChange) {
              this.handleValidate()
            }
          }
        }

        // if nameOrEvent is event - get name and value and execute this.HandleChange with it
        const eventTarget = getEventTarget(nameOrEvent)
        if (eventTarget) {
          const { name, id } = eventTarget
          const value = getValueFromEventTarget(eventTarget)
          this.handleChange(name || id)(value)
        }
      }

      handleValidate = () => {
        let isValid = true

        const errors = Object.keys(this._validationSchema).reduce((obj, key) => {
          const error = this._validationSchema[key].call(this, get(this.values, key), this)
          if (error !== undefined) {
            isValid = false
          }
          obj[key] = error

          if (!shalowEqual(error, get(this.errors, key))) {
            this.dispatchEvent(
              new CustomEvent(EVENTS.errorsChange, {
                detail: { name: key, error, touched: get(this.touched, key) },
              }),
            )
          }

          return obj
        }, {})

        this.isValid = isValid
        this.errors = errors
      }
    }
