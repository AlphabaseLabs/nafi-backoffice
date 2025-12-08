import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'

import App from './App.vue'
import router from './router'
import { vueQueryOptions } from './plugins/vue-query'

// Import Tailwind CSS
import '../assets/index.css'

const app = createApp(App)
const pinia = createPinia()

// Install plugins
app.use(pinia)
app.use(router)
app.use(VueQueryPlugin, vueQueryOptions)

// Mount app
app.mount('#app')
