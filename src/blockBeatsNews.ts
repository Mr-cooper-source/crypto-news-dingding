import { Flash, FlashResponse } from './model'

export const fetchLatestFlashNews = async (): Promise<Flash[] | undefined> => {
  const apiUrl = new URL('open-api/open-flash', 'https://api.theblockbeats.news/v1/')
  apiUrl.search = new URLSearchParams({
    size: '20',
    page: '1',
    lang: 'cn',
  }).toString()

  const response = await fetch(apiUrl)

  if (response.ok) {
    const data = (await response.json()) as FlashResponse
    if (data.status === 0) {
      return data.data.data
    }
  }
}
