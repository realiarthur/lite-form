
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
  handleSubmit: (e?:Event) => void;
  handleChange: (event: Event | CustomEvent, name?: string) => void;
  handleBlur: (event: Event | CustomEvent, name?: string) => void;
  handleValidate: () => void;
  handleReset: () => void;
}>;