// Node 20.18.0 has native fetch! No need for node-fetch.
async function test() {
  const urls = [
    'https://www.picuki.com/profile/globalpharmahuman',
    'https://imginn.com/globalpharmahuman/',
    'https://dumpor.com/v/globalpharmahuman'
  ];

  for (const url of urls) {
    try {
      console.log(`Fetching: ${url}`);
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      console.log(`Status: ${res.status}`);
      if (res.ok) {
        const text = await res.text();
        console.log(`Length: ${text.length}`);
        console.log(`Sample: ${text.slice(0, 500)}`);
      } else {
        const text = await res.text();
        console.log(`Error body sample: ${text.slice(0, 200)}`);
      }
    } catch (e) {
      console.error(`Error for ${url}:`, e.message);
    }
    console.log('------------------------------------');
  }
}

test();
