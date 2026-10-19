# TG-API-Proxy
Telegram Bot API Proxy for Cloudflare Workers

A lightweight and secure reverse proxy for the Telegram Bot API, built with Cloudflare Workers.

This project allows you to access the Telegram Bot API through your own Cloudflare Worker domain.

The Telegram Bot Token is stored as a Cloudflare Worker Secret instead of being included in the source code.

## How It Works

The proxy forwards requests like:

    https://your-worker.example.workers.dev/bot<TOKEN>/getMe

to:

    https://api.telegram.org/bot<TOKEN>/getMe

The Worker verifies that the Bot Token in the request matches the token stored in the `TG_BOT_TOKEN` secret.

Requests with an invalid Bot Token are rejected with HTTP 403.

## One-Click Deploy

You can deploy this project directly to Cloudflare Workers using the button below.

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ThreePanda/TG-API-Proxy)

## Add the Telegram Bot Token

Open your Worker project and go to: Settings → Runtime variables and secrets

Click Add variable and enter the variable name: TG_BOT_TOKEN

Redeploy the Worker if Cloudflare asks you to do so.

## Manual Deployment

You can manually deploy the Worker directly from the Cloudflare Dashboard without installing Node.js, npm, or Wrangler.

### Create a Worker

Log in to your Cloudflare Dashboard and open: **Workers & Pages → Create application → Create Worker**

Create a new Worker using the default **Hello World** template.

Give your Worker a name, for example: telegram-bot-api-proxy

### Edit the Worker Code

After creating the Worker, open the Worker project and select: **Edit code**, replace the default content with the src/index.js

After deployment, configure the `TG_BOT_TOKEN` secret in the Cloudflare Worker dashboard.

## Testing

Assume your Worker URL is:

    https://tg.example.com

and your Telegram Bot Token is:

    123456789:AAxxxxxxxxxxxxxxxx

### Test without authentication

    curl -i \
      "https://tg.example.com/bot123456789:AAxxxxxxxxxxxxxxxx/getMe"

The request should be rejected if the Bot Token is incorrect.

### Test with a valid Bot Token

    curl -i \
      "https://tg.example.com/bot123456789:AAxxxxxxxxxxxxxxxx/getMe"

A successful response should look similar to:

    {
      "ok": true,
      "result": {
        "id": 123456789,
        "is_bot": true,
        "first_name": "ExampleBot",
        "username": "example_bot"
      }
    }

## Sending Messages

You can use the proxy exactly like the normal Telegram Bot API.

Example:

    curl -X POST \
      "https://tg.example.com/bot123456789:AAxxxxxxxxxxxxxxxx/sendMessage" \
      -d "chat_id=123456789" \
      -d "text=Hello from Cloudflare Workers"

## Supported API Methods

The Worker forwards Telegram Bot API methods using the standard URL format:

    /bot<TOKEN>/<METHOD>

Examples:

    /bot<TOKEN>/getMe
    /bot<TOKEN>/sendMessage
    /bot<TOKEN>/getUpdates
    /bot<TOKEN>/deleteWebhook
    /bot<TOKEN>/setWebhook

The Worker does not need to know the individual Telegram API methods.

## Custom Domain

You can attach a custom domain to the Worker from:

Cloudflare Dashboard → Workers & Pages → Your Worker → Settings → Domains & Routes
