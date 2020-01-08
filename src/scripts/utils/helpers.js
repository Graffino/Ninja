const wrap = (el, wrapper) => {
  el.parentNode.insertBefore(wrapper, el)
  wrapper.appendChild(el)
}

const getIndex = el => {
  return parseInt(el.dataset.index)
}

const toSnakeCase = string => {
  let str = string.replace(/[^\w\s]/g, '')
  str = string.replace(/\s+/g, ' ')
  return str.toLowerCase().split(' ').join('_')
}

const getInitialTransformValue = (element, property) => {
  const transform = document.querySelector(element).getAttribute('transform')

  const translate = /translate\(\s*([^\s,)]+)[ ,]([^\s,)]+)/.exec(transform)
  const rotate = /rotate\(\s*([^\s,)]+)\)/.exec(transform)
  const scale = /scale\(\s*([^\s,)]+)\)/.exec(transform)

  switch (property) {
    case 'X':
      return translate[1]
    case 'Y':
      return translate[2]
    case 'rotate':
      return rotate
    case 'scale':
      return scale[1]
    default:
      return ''
  }
}

const isTrue = value => {
  return (value === 'true')
}

const hasPassiveSupport = () => {
  let passiveSupported = false

  try {
    const options = Object.defineProperty({}, 'passive', {
      get: function () { passiveSupported = !0 }
    })

    window.addEventListener('test', null, options)
  } catch (err) { }

  return passiveSupported
}

const isTouchDevice = () => {
  return !!('ontouchstart' in window)
}

const loadScript = (url, callback) => {
  const script = document.createElement('script')
  script.type = 'text/javascript'

  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState === 'loaded' ||
        script.readyState === 'complete') {
        script.onreadystatechange = null
        callback()
      }
    }
  } else {
    script.onload = function () {
      callback()
    }
  }

  script.src = url
  document.getElementsByTagName('head')[0].appendChild(script)
}

export {
  wrap,
  getIndex,
  toSnakeCase,
  getInitialTransformValue,
  isTrue,
  hasPassiveSupport,
  isTouchDevice,
  loadScript
}