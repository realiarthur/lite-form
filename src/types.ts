
export type Constructor<T> = new(...args: any[]) => T;

export interface ConnectableElement extends HTMLElement {  
  connectedCallback?(): void;
  disconnectedCallback?(): void;
}

export type CustomElement<T = {}> = ConnectableElement & T;

export type InputValue = string | number | boolean | string[];
export type Validator = (value: InputValue, props: FormElementProps) => string | undefined;

export type ValueMap = { [field: string]: InputValue };
export type ErrorMap = { [field: string]: string | undefined };
export type TouchedMap = { [field: string]: boolean };
export type ValidatorMap = { [field: string]: Validator };

export type FormElementProps = {
  values: ValueMap;
  errors: ErrorMap;
  touched: TouchedMap;
  isValid: boolean | undefined;
}

export type FormElement = CustomElement<FormElementProps & {
  readonly _validateOnChange: boolean;
  readonly _validateOnBlur: boolean;
  handleSubmit: (e?:Event) => void;
  handleChange: (event: Event | CustomEvent) => void;
  handleBlur: (event: Event | CustomEvent) => void;
  handleValidate: () => void;
  handleReset: () => void;
  setTouched: (name: string, validate: boolean) => void;
  setValue: (name: string, value: InputValue, validate: boolean) => void;
}>;