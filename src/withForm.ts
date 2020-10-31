import {Constructor, ErrorMap, FormElementProps, InputValue, TouchedMap, ValidatorMap, ValueMap} from './types';
import {cloneDeep, get, set} from 'lodash-es'
import {
  getEventTarget,
  getValueFromEventTarget,
} from './utils'

import { ConnectableElement } from './types';

export const IS_LITE_FORM = 'data-isliteform'

export const EVENTS = {
  valuesChange: 'values_change',
  errorsChange: 'errors_touched_change'
}

export interface FormConfig {
  onSubmit?: (values: ValueMap, props: FormElementProps) => void;
  initialValues?: ValueMap;
  validationSchema?: ValidatorMap;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
}

export function withForm(config: FormConfig): ReturnType<typeof withFormExtended>;
export function withForm(element: Constructor<ConnectableElement>): ReturnType<ReturnType<typeof withFormExtended>>;
export function withForm(configOrComponent: FormConfig | Constructor<ConnectableElement>): ReturnType<typeof withFormExtended> | ReturnType<ReturnType<typeof withFormExtended>> {
  if (typeof configOrComponent === 'object') {
    return withFormExtended(configOrComponent)
  }
  return withFormExtended()(configOrComponent)
}

const withFormExtended = <T extends Constructor<ConnectableElement & FormConfig>>(config?:FormConfig) => (Component: T) =>
  class LiteForm extends Component {
    values: ValueMap;
    errors: ErrorMap;
    touched: TouchedMap;
    isValid: boolean; 

    _onSubmit: (values: ValueMap, props: FormElementProps) => void;
    _initialValues: ValueMap;
    _validationSchema: ValidatorMap;
    _validateOnBlur: boolean;
    _validateOnChange: boolean;

    connectedCallback() {
      const {onSubmit, initialValues, validationSchema, validateOnChange} = config ?? {};
      // take params from HOC argument, or from class (if you build base class, like <lite-form>) or default
      this._onSubmit = (onSubmit || this.onSubmit || function () {}).bind(this)
      this._initialValues = initialValues || this.initialValues || {}
      this._validationSchema = validationSchema || this.validationSchema || {}
      this._validateOnBlur = 
        config.validateOnBlur ??
        this.validateOnBlur ??
        true
      this._validateOnChange = validateOnChange ??
        this.validateOnChange ??
        true

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
          detail: { values: this.values }
        })
      )
    }

    get _errors() {
      return this.errors
    }

    set _errors(errors) {
      this.errors = errors

      this.dispatchEvent(
        new CustomEvent(EVENTS.errorsChange, {
          detail: { errors: this.errors, touched: this.touched }
        })
      )
    }

    get _touched() {
      return this.touched
    }

    set _touched(touched) {
      this.touched = touched
      this.dispatchEvent(
        new CustomEvent(EVENTS.errorsChange, {
          detail: { errors: this.errors, touched: this.touched }
        })
      )
    }

    handleReset = (e?:Event) => {
      e && e.preventDefault()
      this._values = cloneDeep(this._initialValues)
      this._touched = {}
      this._errors = {}
      this.isValid = undefined
    }

    handleSubmit = (e?:Event) => {
      e && e.preventDefault()

      this.handleValidate()

      if (this.isValid) {
        this._onSubmit(this._values, this)
      } else {
        // Touch all fields to show validation errors
        this._touched = Object.keys(this._validationSchema).reduce(
          (obj: { [propName: string]: boolean; }, fieldName: string) => {
            set(obj, fieldName, true)
            return obj
          },
          {}
        )
      }
    }

    // TODO: Check remove recursion. I think === 'string' was missing a return.
    // Set touched for name and handleValidate if needed
    handleBlur = (nameOrEvent: string | Event): void => {
      let name: string;

      // Extracts the name from the event.
      if (typeof nameOrEvent !== 'string') {        
        const eventTarget = getEventTarget(nameOrEvent)
        if (eventTarget) {
          name = eventTarget.name || eventTarget.id;
        }
      } else {
        name = nameOrEvent;
      }

      this._touched = set(this._touched, name, true)
      if (this._validateOnBlur) {
        this.handleValidate()
      }
    }

    setValue = (name: string, value:InputValue): void => {
      this._values = set(cloneDeep(this.values), name, value)
    }


    handleChange = (nameOrEvent: string | Event)  => {
      // if nameOrEvent is name - return function that will change value for this name
      if (typeof nameOrEvent === 'string') {
        return (value: InputValue) => {
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

    handleValidate = (): void => {
      let isValid = true

      const errors = Object.keys(this._validationSchema).reduce((obj, key) => {
        const error = this._validationSchema[key].call(
          this,
          get(this.values, key),
          this
        )
        if (error !== undefined) {
          isValid = false
        }
        obj[key] = error

        return obj
      }, {})

      this.isValid = isValid
      this._errors = errors
    }
  }
