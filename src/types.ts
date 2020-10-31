
export type Constructor<T> = new(...args: any[]) => T;

export interface ConnectableElement extends HTMLElement {
  connectedCallback?(): void;
  disconnectedCallback?(): void;
}

export type CustomElement<T = {}> = ConnectableElement & T;

export type InputValue = string | number | boolean | string[];
export type Validator = (value: ValueMap, props: FormElementProps) => string | undefined;

export type ValueMap = { [field: string]: InputValue };
export type ErrorMap = { [field: string]: string };
export type TouchedMap = { [field: string]: boolean };
export type ValidatorMap = { [field: string]: Validator };

export type FormElementProps = {
  values: ValueMap;
  errors: ErrorMap;
  touched: TouchedMap;
  isValid: boolean;
}

export type FormElement = CustomElement<FormElementProps & {
  handleSubmit: (e?:Event) => void;
  handleChange: (nameOrEvent: string | Event) => (value: InputValue) => void | undefined;
  handleBlur: (nameOrEvent: string | Event) => void;
  handleValidate: () => void;
  handleReset: () => void;
}>;