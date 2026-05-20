export default async function handler(req, res) {
  const { url } = req.query

  if (!url) {
    return res.status(400).json({ error: 'URL manquante' })
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://www.tiktok.com/',
      },
    })

    if (!response.ok) {
      return res.status(500).json({ error: 'Erreur fetch vidéo' })
    }

    const contentType = response.headers.get('content-type') || 'video/mp4'
    res.setHeader('Content-Type', contentType)
    res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"')
    res.setHeader('Access-Control-Allow-Origin', '*')

    const buffer = await response.arrayBuffer()
    res.send(Buffer.from(buffer))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}