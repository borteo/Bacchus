
'use strict';

import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'
import npm from 'rollup-plugin-npm'

export default {
  entry: 'client/src/main.js',
  format: 'umd',
  moduleName: 'bacchus',
  plugins: [
    json(),
    babel(),
    npm({
      jsnext: true,
      main: true,
      browser: true
    })
  ],
  dest: 'public/js/bundle.js'
}