export const shalowEqual = (a, b) => {
  if (typeof a !== 'object' || typeof b !== 'object') return a === b

  for (const key in a) {
    if (a[key] !== b[key]) return false
  }

  return true
}

export const getEventTarget = e => e.detail || e.target

export const getValueFromEventTarget = target => {
  if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement) {
    const { value, type, checked, options, multiple } = target

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

export const setBooleanValue = (value1, value2, defaultValue) => {
  return typeof value1 === 'boolean' ? value1 : typeof value2 === 'boolean' ? value2 : defaultValue
}

//closest polyfill
;(function (ELEMENT) {
  ELEMENT.matches =
    ELEMENT.matches ||
    ELEMENT.mozMatchesSelector ||
    ELEMENT.msMatchesSelector ||
    ELEMENT.oMatchesSelector ||
    ELEMENT.webkitMatchesSelector
  ELEMENT.closest =
    ELEMENT.closest ||
    function closest(selector) {
      if (!this) return null
      if (this.matches(selector)) return this
      if (!this.parentElement) {
        return null
      } else return this.parentElement.closest(selector)
    }
})(Element.prototype)
