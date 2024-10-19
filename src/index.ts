import { Context, Hono } from 'hono'
import { fetchLatestFlashNews } from './blockBeatsNews'
import DingDingNotifier from './dingding'

interface Env {
  CRYPTO_NEWS_DINGDING_KV: KVNamespace
  DINGDING_ACCESS_TOKEN: string
  DINGDING_SECRET_KEY: string
}

const app = new Hono()

export default {
  fetch: app.fetch,
  scheduled: async (_event: ScheduledEvent, env: Env, _ctx: Context) => {
    try {
      // 获取最新的快讯
      const latestFlashNews = await fetchLatestFlashNews()
      
      if (latestFlashNews && latestFlashNews.length > 0) {
        // 获取最后一个已发送的快讯 ID
        const lastSentFlashIdStr = await env.CRYPTO_NEWS_DINGDING_KV.get('last_sent_flash_id')
        const lastSentFlashId = lastSentFlashIdStr ? parseInt(lastSentFlashIdStr, 10) : 0
        
        // 筛选出新于 lastSentFlashId 的快讯
        const newFlashNews = latestFlashNews.filter(flash => flash.id > lastSentFlashId)
        
        if (newFlashNews.length > 0) {
          const dingDingNotifier = new DingDingNotifier(env.DINGDING_ACCESS_TOKEN, env.DINGDING_SECRET_KEY)
          // 按照 ID 从小到大排序，确保更新的 lastSentFlashId 为最新的
          newFlashNews.sort((a, b) => a.id - b.id)
          
          // 发送未发送的快讯到钉钉
          await Promise.all(
            newFlashNews.map(async flash => {
              await dingDingNotifier.sendFlashNews(flash)
            })
          )
          
          // 更新 last_sent_flash_id 为最新的快讯 ID
          const updatedLastFlashId = newFlashNews[newFlashNews.length - 1].id
          await env.CRYPTO_NEWS_DINGDING_KV.put('last_sent_flash_id', updatedLastFlashId.toString())
        }
      }
    } catch (error) {
      console.error('定时任务出错:', error)
    }
  },
}
