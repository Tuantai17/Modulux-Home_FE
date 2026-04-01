import { createApp } from 'vue'
import { createPinia } from 'pinia'
import AOS from 'aos'
import 'aos/dist/aos.css'

import App from './App.vue'
import router from './router'
import './style.css'

const resetScrollToTop = () => {
  const scrollTarget = document.scrollingElement || document.documentElement || document.body

  if (scrollTarget) {
    scrollTarget.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    })
  }

  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
}

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

window.addEventListener('beforeunload', resetScrollToTop)
window.addEventListener('load', () => {
  resetScrollToTop()
  requestAnimationFrame(() => resetScrollToTop())
}, { once: true })
window.addEventListener('pageshow', () => {
  resetScrollToTop()
  requestAnimationFrame(() => resetScrollToTop())
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')

resetScrollToTop()
requestAnimationFrame(() => resetScrollToTop())
setTimeout(resetScrollToTop, 120)
setTimeout(resetScrollToTop, 320)

AOS.init({
  duration: 900,
  easing: 'ease-out-cubic',
  once: false,
  offset: 20,
})

router.afterEach(() => {
  setTimeout(() => AOS.refreshHard(), 80)
})
