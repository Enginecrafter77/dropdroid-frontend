import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          "on-primary": '#FFFFFF',
          primary: '#03DAC5',
          error: '#B3261E',
          secondary: '#625B71',
          black: '#000000'
        }
      },
    },
  },
})
