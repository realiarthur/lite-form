import { InputValue } from "./types";

export const getEventTarget = (e: Event | CustomEvent): HTMLInputElement => (e as CustomEvent).detail || e.target

export const getValueFromEventTarget = (target : HTMLInputElement | HTMLSelectElement | {value: InputValue}): InputValue => {
  if (
    target instanceof HTMLInputElement ||
    target instanceof HTMLSelectElement
  ) {
    const type = target.type;

    if (/number|range/.test(type)) {
      const parsed =  parseFloat(target.value);
      return isNaN(parsed) ? '' : parsed;
    }

    if (/checkbox/.test(type)) {      
      return (target as HTMLInputElement).checked
    }

    if (!!target.multiple) {
      const values: InputValue = [];
      const options = (target as HTMLSelectElement).options;
      for (let i = 0; i < options.length; i++) {
        const option = options[i];
        if (option.selected) {
          values.push(option.value);
        }
      }
      return values;
    }
  }
  
  return target.value
}