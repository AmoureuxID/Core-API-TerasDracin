export default async function handler(req, res) {
  // Mengambil URL asli yang diakses user (contoh: /comic/search?q=naruto)
  const originalPath = req.url; 
  
  // Menggabungkan target aslinya
  const targetUrl = `https://www.sankavollerei.com${originalPath}`;

  try {
    // Meminta data ke API Sanka Vollerei
    const response = await fetch(targetUrl);
    const data = await response.json();

    // 🔥 MANIPULASI DATA UNTUK SEMUA ENDPOINT 🔥
    // Jika ada properti "creator", ubah menjadi namamu
    if (data.creator) {
      data.creator = "Web API Saya"; 
    }
    
    // (Opsional) Mengubah tulisan message
    // if (data.message) {
    //   data.message = "Berhasil ditarik dari API saya!";
    // }

    // Mengizinkan API diakses dari mana saja (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Mengirim hasil akhir ke user
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ 
      status: false, 
      creator: "Teras Dracin",
      message: "Terjadi kesalahan saat menghubungi server pusat" 
    });
  }
}