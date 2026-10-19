export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const match = url.pathname.match(
      /^\/bot([^/]+)\/([A-Za-z0-9_]+)$/
    );

    if (!match) {
      return new Response("Not Found", {
        status: 404
      });
    }

    const botToken = match[1];

    // 检查 Secret 是否存在
    if (!env.TG_BOT_TOKEN) {
      return new Response("TG_BOT_TOKEN secret is not configured", {
        status: 500
      });
    }

    // 检查 Bot Token
    if (botToken !== env.TG_BOT_TOKEN) {
      return new Response("Unauthorized", {
        status: 403
      });
    }

    const telegramUrl =
      "https://api.telegram.org" +
      url.pathname +
      url.search;

    return fetch(
      new Request(
        telegramUrl,
        request
      )
    );
  }
};
