<template>
  <teleport to="body">
    <transition name="search-overlay-fade">
      <div v-if="open" class="search-overlay" @click.self="handleClose">
        <div class="search-overlay__scrim"></div>

        <div
          class="search-overlay__panel"
          role="dialog"
          aria-modal="true"
          aria-label="Site search"
          @click.stop
        >
          <label class="search-overlay__field">
            <svg class="search-overlay__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="m21 21-4.35-4.35" stroke-linecap="round" />
              <circle cx="11" cy="11" r="7" />
            </svg>
            <input
              ref="inputRef"
              v-model="query"
              type="text"
              class="search-overlay__input"
              placeholder="Search..."
              autocomplete="off"
              @keydown.esc.prevent="handleClose"
            />
          </label>

          <div class="search-overlay__body">
            <p v-if="loading" class="search-overlay__state">Searching content...</p>

            <template v-else-if="activeItems.length">
              <div class="search-overlay__section">
                <p class="search-overlay__section-title">
                  {{ sectionTitle }}
                </p>

                <router-link
                  v-for="item in activeItems"
                  :key="`${item.kind}-${item.path}`"
                  :to="item.path"
                  class="search-result"
                  @click="handleResultClick"
                >
                  <span class="search-result__home" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M4 10.75 12 4l8 6.75" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M6.5 9.75V20h11V9.75" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </span>

                  <div class="search-result__breadcrumbs">
                    <template v-for="(segment, index) in getDisplaySegments(item)" :key="`${item.path}-${segment}-${index}`">
                      <span v-if="index > 0" class="search-result__separator" aria-hidden="true">›</span>
                      <span :class="index === getDisplaySegments(item).length - 1 ? 'search-result__title' : 'search-result__segment'">
                        {{ segment }}
                      </span>
                    </template>
                  </div>
                </router-link>
              </div>
            </template>

            <template v-else>
              <div class="search-overlay__empty">
                <p class="search-overlay__empty-title">No matching content found.</p>
              </div>
            </template>

            <div v-if="query.trim() && visibleRecommended.length" class="search-overlay__section">
              <p class="search-overlay__section-title">Recommended</p>

              <router-link
                v-for="item in visibleRecommended"
                :key="`recommended-${item.kind}-${item.path}`"
                :to="item.path"
                class="search-result search-result--recommended"
                @click="handleResultClick"
              >
                <span class="search-result__home" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M4 10.75 12 4l8 6.75" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M6.5 9.75V20h11V9.75" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>

                <div class="search-result__breadcrumbs">
                  <template v-for="(segment, index) in getDisplaySegments(item)" :key="`recommended-${item.path}-${segment}-${index}`">
                    <span v-if="index > 0" class="search-result__separator" aria-hidden="true">›</span>
                    <span :class="index === getDisplaySegments(item).length - 1 ? 'search-result__title' : 'search-result__segment'">
                      {{ segment }}
                    </span>
                  </template>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { searchSite } from '@/services/searchApi'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const inputRef = ref(null)
const query = ref('')
const loading = ref(false)
const MAX_RECOMMENDED_ITEMS = 2
const searchState = ref({
  query: '',
  recommended: [],
  results: [],
  total: 0,
})

let debounceTimer = null
let requestId = 0
let isResettingQuery = false

const visibleRecommended = computed(() => searchState.value.recommended.slice(0, MAX_RECOMMENDED_ITEMS))
const activeItems = computed(() => (query.value.trim() ? searchState.value.results : visibleRecommended.value))
const sectionTitle = computed(() => (query.value.trim() ? 'Results' : 'Recommended'))

function clearPendingSearch() {
  if (debounceTimer) {
    window.clearTimeout(debounceTimer)
    debounceTimer = null
  }
}

function lockBodyScroll(locked) {
  document.body.style.overflow = locked ? 'hidden' : ''
}

function handleWindowKeydown(event) {
  if (event.key === 'Escape' && props.open) {
    handleClose()
  }
}

async function fetchSearch() {
  const currentRequest = ++requestId
  loading.value = true

  try {
    const data = await searchSite({ q: query.value.trim() })
    if (currentRequest !== requestId) return
    searchState.value = data
  } catch {
    if (currentRequest !== requestId) return
    searchState.value = {
      query: query.value.trim(),
      recommended: [],
      results: [],
      total: 0,
    }
  } finally {
    if (currentRequest === requestId) {
      loading.value = false
    }
  }
}

function handleClose() {
  emit('close')
}

function handleResultClick() {
  handleClose()
}

function getDisplaySegments(item) {
  const baseSegments = String(item?.subtitle || '')
    .split('>')
    .map((segment) => segment.trim())
    .filter(Boolean)

  return [...baseSegments, item.title]
}

watch(
  () => props.open,
  async (open) => {
    clearPendingSearch()
    requestId += 1

    if (!open) {
      loading.value = false
      lockBodyScroll(false)
      return
    }

    isResettingQuery = true
    query.value = ''
    searchState.value = {
      query: '',
      recommended: [],
      results: [],
      total: 0,
    }
    lockBodyScroll(true)
    await nextTick()
    isResettingQuery = false
    inputRef.value?.focus()
    fetchSearch()
  },
  { immediate: true },
)

watch(query, () => {
  if (!props.open) return
  if (isResettingQuery) return
  clearPendingSearch()
  debounceTimer = window.setTimeout(fetchSearch, query.value.trim() ? 220 : 0)
})

onBeforeUnmount(() => {
  clearPendingSearch()
  lockBodyScroll(false)
  window.removeEventListener('keydown', handleWindowKeydown)
})

watch(
  () => props.open,
  (open) => {
    if (open) {
      window.addEventListener('keydown', handleWindowKeydown)
    } else {
      window.removeEventListener('keydown', handleWindowKeydown)
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.search-overlay {
  position: fixed;
  inset: 0;
  z-index: 120;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 118px 20px 32px;
}

.search-overlay__scrim {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.48);
}

.search-overlay__panel {
  position: relative;
  width: min(100%, 864px);
  max-height: calc(100vh - 156px);
  overflow: hidden;
  border-radius: 6px;
  background: #ffffff;
  border: 1px solid rgba(215, 215, 215, 0.9);
  box-shadow:
    0 18px 40px rgba(0, 0, 0, 0.18),
    0 4px 14px rgba(0, 0, 0, 0.08);
}

.search-overlay__field {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 60px;
  padding: 10px 16px 10px 14px;
  border-bottom: 1px solid #d1d5db;
}

.search-overlay__icon {
  width: 30px;
  height: 30px;
  color: #111;
  flex-shrink: 0;
}

.search-overlay__input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: #111;
  font-size: 1rem;
  line-height: 1.5;
  font-weight: 400;
  letter-spacing: 0;
}

.search-overlay__input::placeholder {
  color: #98a1b2;
}

.search-overlay__body {
  max-height: calc(100vh - 216px);
  overflow-y: auto;
  padding: 14px 14px 16px;
}

.search-overlay__section + .search-overlay__section {
  margin-top: 12px;
}

.search-overlay__section-title {
  margin: 0 0 4px;
  padding: 0 4px;
  color: #1f1f1f;
  font-size: 0.75rem;
  line-height: 1.5;
  font-weight: 400;
}

.search-overlay__state,
.search-overlay__empty {
  padding: 8px 4px;
  color: #52525b;
}

.search-overlay__empty-title {
  margin: 0;
  color: #18181b;
  font-size: 0.95rem;
  line-height: 1.6;
  font-weight: 400;
}

.search-result {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 4px;
  border-radius: 4px;
  color: inherit;
  text-decoration: none;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.search-result:hover {
  background: #f8f8f8;
}

.search-result__home {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  color: #111;
  flex-shrink: 0;
}

.search-result__home svg {
  width: 18px;
  height: 18px;
}

.search-result__breadcrumbs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0;
  min-width: 0;
}

.search-result__separator {
  margin: 0 9px;
  color: #b8b8b8;
  font-size: 1rem;
  line-height: 1;
}

.search-result__segment,
.search-result__title {
  color: #111;
  font-size: 0.98rem;
  line-height: 1.6;
  font-weight: 400;
}

.search-result__segment {
  color: #1f1f1f;
}

.search-result__title {
  font-size: 0.98rem;
}

.search-overlay-fade-enter-active,
.search-overlay-fade-leave-active {
  transition: opacity 0.16s ease;
}

.search-overlay-fade-enter-from,
.search-overlay-fade-leave-to {
  opacity: 0;
}

@media (max-width: 767px) {
  .search-overlay {
    padding: 82px 12px 18px;
  }

  .search-overlay__panel {
    max-height: calc(100vh - 108px);
  }

  .search-overlay__field {
    min-height: 56px;
    padding: 10px 12px;
  }

  .search-overlay__input {
    font-size: 1rem;
  }

  .search-overlay__body {
    max-height: calc(100vh - 180px);
    padding: 12px 10px 14px;
  }

  .search-result {
    align-items: flex-start;
  }

  .search-result__separator {
    margin: 0 7px;
  }
}
</style>
