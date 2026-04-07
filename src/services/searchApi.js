import publicApi from '@/services/publicApi'
import { resolveMediaUrl } from '@/utils/media'

const normalizeItem = (item) => ({
  ...item,
  image_url: resolveMediaUrl(item.image_url),
})

export async function searchSite(params = {}) {
  const { data } = await publicApi.get('/api/v1/search/', { params })

  return {
    ...data,
    recommended: Array.isArray(data?.recommended) ? data.recommended.map(normalizeItem) : [],
    results: Array.isArray(data?.results) ? data.results.map(normalizeItem) : [],
  }
}
