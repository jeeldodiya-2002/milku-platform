/**
 * MILKU WEATHER PROXY (Deploy to Cloudflare Workers)
 * Scales to 10k+ users while protecting your API key.
 */

export default {
  async fetch(request, env) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
       return new Response("Missing Coordinates", { status: 400 });
    }

    // LAYER 3: Geographic Approximation (Round to 1 decimal place = ~11km radius)
    // This ensures every user in the same city shares the same cache key.
    const roundedLat = parseFloat(lat).toFixed(1);
    const roundedLon = parseFloat(lon).toFixed(1);
    const cacheKey = `weather-${roundedLat}-${roundedLon}`;

    // LAYER 2: Edge Cache Checking
    const cache = caches.default;
    const cacheUrl = new URL(request.url);
    cacheUrl.pathname = `/${cacheKey}`; // Unique path for caching
    
    let response = await cache.match(cacheUrl);
    
    if (!response) {
      console.log(`Cache Miss for ${cacheKey}. Fetching fresh...`);
      
      const API_KEY = env.WEATHER_API_KEY; // Stored securely in Cloudflare ENV
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${roundedLat}&lon=${roundedLon}&units=metric&appid=${API_KEY}`;
      
      const apiResponse = await fetch(apiUrl);
      const data = await apiResponse.json();

      // Flatten the response to save bytes
      const result = {
        temp: Math.round(data.main.temp),
        city: data.name,
        timestamp: Date.now()
      };

      response = new Response(JSON.stringify(result), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=600', // Cache at edge for 10 minutes
        },
      });

      // Store in Edge Cache
      await cache.put(cacheUrl, response.clone());
    }

    return response;
  },
};
