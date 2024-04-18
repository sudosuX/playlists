addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const { pathname } = new URL(request.url);

  if (pathname === '/') {
    return new Response(JSON.stringify({
      name: "Toffee App + Tsports All Channel m3u link for Android",
      apps: [
        {
          name: "OTT Navigator",
          link: "/ott",
        },
        {
          name: "NS Player",
          link: "/ns",
        },
      ],
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (pathname === '/ott') {
    try {
      let toffeeResponse = await fetch(
        "https://raw.githubusercontent.com/Jeshan-akand/Toffee-Channels-Link-Headers/main/toffee_channel_data.json"
      );
      let toffeeChannelData = await toffeeResponse.json();

      let tsportsResponse = await fetch(
        "https://raw.githubusercontent.com/byte-capsule/TSports-m3u8-Grabber/main/TSports_m3u8_headers.Json"
      );
      let tsportsChannelData = await tsportsResponse.json();

      let combinedChannelData = [...toffeeChannelData.channels, ...tsportsChannelData.channels];

      combinedChannelData.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );

      let formattedChannels = "";

      for (let i = 0; i < combinedChannelData.length; i++) {
        const channel = combinedChannelData[i];

        formattedChannels += `#EXTINF:-1 tvg-chno="${i + 1}" tvg-id="" tvg-logo="${channel.logo}", ${channel.name}\n`;
        formattedChannels += `#EXTVLCOPT:http-user-agent=Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.193 Mobile Safari/537.36\n`;

        const cookieProperty = "cookie" in channel.headers ? "cookie" : "Cookie";
        formattedChannels += `#EXTHTTP:${JSON.stringify({
          [cookieProperty]: channel.headers[cookieProperty],
        })}\n`;

        formattedChannels += `${channel.link}\n`;
      }

      return new Response(formattedChannels, {
        headers: { 'Content-Type': 'text/plain' }
      });
    } catch (error) {
      console.error("Error fetching API:", error);
      return new Response("Internal Server Error", {
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }

  if (pathname === '/ns') {
    try {
      let toffeeResponse = await fetch(
        "https://raw.githubusercontent.com/Jeshan-akand/Toffee-Channels-Link-Headers/main/toffee_channel_data.json"
      );
      let toffeeChannelData = await toffeeResponse.json();

      let tsportsResponse = await fetch(
        "https://raw.githubusercontent.com/byte-capsule/TSports-m3u8-Grabber/main/TSports_m3u8_headers.Json"
      );
      let tsportsChannelData = await tsportsResponse.json();

      let combinedChannelData = [...toffeeChannelData.channels, ...tsportsChannelData.channels];

      combinedChannelData.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );

      let formattedChannels = [];

      for (let i = 0; i < combinedChannelData.length; i++) {
        const channel = combinedChannelData[i];
        const cookieProperty = "cookie" in channel.headers ? "cookie" : "Cookie";

        formattedChannels.push({
          name: channel.name,
          link: channel.link,
          logo: channel.logo,
          origin: channel.link.substring(
            0,
            channel.link.indexOf("/", channel.link.indexOf("//") + 2)
          ),
          userAgent:
            "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.193 Mobile Safari/537.36",
          cookie: channel.headers[cookieProperty],
        });
      }

      return new Response(JSON.stringify(formattedChannels), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error("Error fetching API:", error);
      return new Response("Internal Server Error", {
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }

  return new Response("Not Found", { status: 404 });
}
