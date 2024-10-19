import { Flash } from './model'

class DingDingNotifier {
  private webhookUrl: string
  private secretKey: string

  constructor(accessToken: string, secretKey: string) {
    if (!accessToken || !secretKey) {
      throw new Error('ACCESS_TOKEN 和 SECRET_KEY 未设置')
    }
    this.webhookUrl = `https://oapi.dingtalk.com/robot/send?access_token=${accessToken}`
    this.secretKey = secretKey
  }

  /**
   * 将HTML标签转换为Markdown语法
   * @param htmlContent 包含HTML标签的内容
   * @returns 转换后的Markdown内容
   */
  private convertHtmlToMarkdown(htmlContent: string): string {
    let markdownContent = htmlContent

    // 替换段落标签
    markdownContent = markdownContent.replace(/<\/?p>/g, '\n\n')

    // 替换换行标签
    markdownContent = markdownContent.replace(/<br\s*\/?>/gi, '  \n')

    // 可以根据需要添加更多的HTML到Markdown的转换规则

    return markdownContent.trim()
  }

  /**
   * 移除URL中的查询参数
   * @param url 图片的URL
   * @returns 去除查询参数后的URL
   */
  private stripQueryParams(url: string): string {
    try {
      const parsedUrl = new URL(url)
      return `${parsedUrl.origin}${parsedUrl.pathname}`
    } catch (error) {
      console.warn('无效的URL，无法移除查询参数:', url)
      return url
    }
  }

  /**
   * 发送ActionCard消息到钉钉
   * @param flashNews 快讯内容
   */
  async sendFlashNews(flashNews: Flash) {
    const timestamp = Date.now().toString()
    const stringToSign = `${timestamp}\n${this.secretKey}`

    // 使用 Web Crypto API 生成 HMAC-SHA256 签名
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(this.secretKey),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(stringToSign))
    const signBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    const encodedSign = encodeURIComponent(signBase64)

    const signedWebhookUrl = `${this.webhookUrl}&timestamp=${timestamp}&sign=${encodedSign}`

    // 转换HTML标签为Markdown语法
    const markdownContent = this.convertHtmlToMarkdown(flashNews.content)

    // 移除图片URL中的查询参数，并构建图片Markdown
    const cleanImageUrl = flashNews.pic ? this.stripQueryParams(flashNews.pic) : ''
    const imageMarkdown = cleanImageUrl ? `![图片](${cleanImageUrl})\n\n` : ''

    // 构建文本内容，图片放在最前面，并进行判空
    const textContent = `${imageMarkdown}### ${flashNews.title}\n${markdownContent}`

    const actionCardPayload = {
      msgtype: 'actionCard',
      actionCard: {
        title: flashNews.title,
        text: textContent,
        singleTitle: '阅读全文',
        singleURL: flashNews.link
      }
    }

    try {
      const response = await fetch(signedWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(actionCardPayload)
      })

      if (!response.ok) {
        console.error('发送失败:', response.statusText)
      }
    } catch (error) {
      console.error('发送错误:', error)
    }
  }
}

export default DingDingNotifier
