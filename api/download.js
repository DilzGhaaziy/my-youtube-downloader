const ytdl = require('ytdl-core');

export default async function handler(req, res) {
  try {
    const { url } = req.query;

    // Validasi URL
    if (!url || !ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'URL YouTube tidak valid atau kosong.' });
    }

    // Ambil info video untuk mendapatkan judul
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, ''); // Bersihkan karakter aneh pada judul

    // Set header agar browser menganggap ini file download
    res.setHeader('Content-Disposition', `attachment; filename="${title}.mp4"`);
    res.setHeader('Content-Type', 'video/mp4');

    // Mulai streaming video dari YouTube langsung ke browser user (Piping)
    ytdl(url, {
      format: 'mp4',
      quality: 'highest', // Atau '18' untuk 360p agar lebih ringan di Vercel
      filter: 'audioandvideo' 
    }).pipe(res);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal memproses video. YouTube mungkin memblokir IP server.' });
  }
}
