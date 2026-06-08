const fs = require('fs');

async function download() {
  const url = 'https://dumpor.com/v/globalpharmahuman';
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    if (res.ok) {
      const text = await res.text();
      fs.writeFileSync('scratch/dumpor-output.html', text);
      console.log('Saved to scratch/dumpor-output.html');
    } else {
      console.log(`Failed to fetch: ${res.status}`);
    }
  } catch (e) {
    console.error(e);
  }
}

download();
