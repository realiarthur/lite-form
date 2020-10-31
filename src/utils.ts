import { InputValue } from "./types";

// Note: the `any` type overrides `Event | CustomEvent`.
// However `Event | CustomEvent` indicates the primarily use of this function.
export const getEventTarget = (e: Event | CustomEvent | any) => e.detail || e.target

export const getValueFromEventTarget = (target : HTMLInputElement | HTMLSelectElement | {value: InputValue}): InputValue => {
  if (
    target instanceof HTMLInputElement ||
    target instanceof HTMLSelectElement
  ) {
    const { value, type, checked, options, multiple } = target  as (HTMLInputElement & {options?: HTMLOptionsCollection});

    let parsed: number;

    const val = /number|range/.test(type)
      ? ((parsed = parseFloat(value)), isNaN(parsed) ? '' : parsed)
      : /checkbox/.test(type) // checkboxes
      ? checked
      : !!multiple // <select multiple>
      ? Array.from(options)
          .filter(el => el.selected)
          .map(el => el.value)
      : value
    return val
  } else {
    return target.value
  }
}

// TODO: remove ? see https://github.com/realiarthur/lite-form/issues/6.
//closest polyfill
;(function (elementProto: Element) {
  const elementProtoExt = elementProto as any;
  elementProto.matches =
    elementProto.matches ||
    elementProtoExt.mozMatchesSelector ||
    elementProtoExt.msMatchesSelector ||
    elementProtoExt.oMatchesSelector ||
    elementProto.webkitMatchesSelector
    
  elementProto.closest =
    elementProto.closest ||
    function closest(selector: string) {
      if (!this) return null
      if (this.matches(selector)) return this
      if (!this.parentElement) {
        return null
      } else return this.parentElement.closest(selector)
    }
})(Element.prototype)
