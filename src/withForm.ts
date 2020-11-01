import {Constructor, ErrorMap, FormElementProps, InputValue, TouchedMap, ValidatorMap, ValueMap} from './types';
import {
  getEventTarget,
  getValueFromEventTarget,
} from './utils'

import { ConnectableElement } from './types';
import cloneDeep from 'lodash-es/cloneDeep'
import get from 'lodash-es/get'
import set from 'lodash-es/set'

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

const withFormExtended = (config?:FormConfig) => <T extends Constructor<ConnectableElement & FormConfig>>(Component: T) =>
  class LiteForm extends Component {
    values!: ValueMap;
    errors!: ErrorMap;
    touched!: TouchedMap;
    isValid!: boolean | undefined; 

    _onSubmit!: (values: ValueMap, props: FormElementProps) => void;
    _initialValues!: ValueMap;
    _validationSchema!: ValidatorMap;
    _validateOnBlur!: boolean;
    _validateOnChange!: boolean;

    connectedCallback(): void {
      const {onSubmit, initialValues, validationSchema, validateOnChange, validateOnBlur} = config ?? {};
      // take params from HOC argument, or from class (if you build base class, like <lite-form>) or default
      this._onSubmit = (onSubmit || this.onSubmit || function () {}).bind(this)
      this._initialValues = initialValues || this.initialValues || {}
      this._validationSchema = validationSchema || this.validationSchema || {}
      this._validateOnBlur = 
        validateOnBlur ??
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

    get _values(): ValueMap {
      return this.values
    }

    set _values(values: ValueMap) {
      this.values = values

      this.dispatchEvent(
        new CustomEvent(EVENTS.valuesChange, {
          detail: { values: this.values }
        })
      )
    }

    get _errors(): ErrorMap {
      return this.errors
    }

    set _errors(errors: ErrorMap) {
      this.errors = errors

      this.dispatchEvent(
        new CustomEvent(EVENTS.errorsChange, {
          detail: { errors: this.errors, touched: this.touched }
        })
      )
    }

    get _touched(): TouchedMap {
      return this.touched
    }

    set _touched(touched: TouchedMap) {
      this.touched = touched
      this.dispatchEvent(
        new CustomEvent(EVENTS.errorsChange, {
          detail: { errors: this.errors, touched: this.touched }
        })
      )
    }

    handleReset = (e?:Event): void => {
      e && e.preventDefault()
      this._values = cloneDeep(this._initialValues)
      this._touched = {}
      this._errors = {}
      this.isValid = undefined
    }

    handleSubmit = (e?:Event): void => {
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

    // Set touched for name and handleValidate if needed
    handleBlur = (event: Event | CustomEvent, name?: string): void => {
        const eventTarget = getEventTarget(event)
        if (eventTarget) {
          const actualName = name || eventTarget.name || eventTarget.id;
          this._touched = set(this._touched, actualName, true)
          if (this._validateOnBlur) {
            this.handleValidate()
          }            
        }
    }

    setValue = (name: string, value:InputValue): void => {
      this._values = set(cloneDeep(this.values), name, value)
    }

    handleChange = (event: Event | CustomEvent, name?: string): void  => {
      const eventTarget = getEventTarget(event)
      if (eventTarget) {
        const actualName = name || eventTarget.name || eventTarget.id;
        const value = getValueFromEventTarget(eventTarget)
        this.setValue(actualName, value)
        if (this._validateOnChange) {
          this.handleValidate()
        }  
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
      }, {} as ErrorMap)

      this.isValid = isValid
      this._errors = errors
    }
  }
