import './utils/polyfills'
import './vendor'
import '@babel/polyfill'
import smoothscroll from 'smoothscroll-polyfill'

import requireAll from './utils/require-all'
import autoInitComponents from './utils/auto-init-components'

requireAll(require.context('../icons/', true, /\.svg$/))
requireAll(require.context('../images/', true, /\.(png|svg|jpe?g|gif)$/))
require('../styles/app.scss')

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.remove('no-js')
  smoothscroll.polyfill()
  autoInitComponents()
})
