# TMA USD₮ Payments Demo

This Demo TMA showcases the integration with @tonconnect/ui-react and simple processing of USD₮ invoice by [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier) in comment.

<p align="center">
  <img src="static/demo-pic-2.png" alt="Demo Picture 2" width="240"/>
  <img src="static/demo-pic-1.png" alt="Demo Picture 1" width="240"/>
</p>

# Give a Try on Testnet

| Action | Link and QR Code |
| --- | --- |
| **1. Get [TESTNET] Toncoins on your [Testnet TON Wallet](https://docs.ton.org/participate/wallets/apps#tonkeeper-test-environment) via [Test Giver Bot](https://t.me/tma_jetton_processing_bot/testgiver_ton_bot).** | ![Test Giver Bot](static%2Ft_me-testgiver_ton_bot.jpg) |
| **2. Get [TESTNET] USDt on your Testnet TON Wallet via [USDt giver bot](https://t.me/testnet_usdt_giver_bot). Testnet Toncoin from step (1) required for this step.** | ![USDt giver bot](static%2Ft_me-testnet_usdt_giver_bot.jpg) |
| **3. Experience [TESTNET] live demo at [tma_jetton_processing_bot](https://t.me/tma_jetton_processing_bot).** | ![tma_jetton_processing_bot](static%2Ft_me-tma_jetton_processing_bot.jpg) |


## Installation

### 1. Install the necessary packages for this project:

```bash
npm install
```

### 2. ngrok or localtunnel

Choose either ngrok or `localtunnel` to expose your local server to the internet for testing in Telegram.

#### a. ngrok Installation

```bash
npm install -g ngrok
```

ngrok Documentation: [https://ngrok.com/docs](https://ngrok.com/docs)

#### b. localtunnel Installation

```bash
npm install -g localtunnel
```

LocalTunnel Documentation: [https://localtunnel.github.io/www/](https://localtunnel.github.io/www/)

### 3. Creating Telegram Mini Apps

1. Open [@BotFather](https://t.me/BotFather) in Telegram.
2. Send the `/newbot` command to create a new bot.
3. Follow the prompts to set up your bot, providing all necessary information.
4. After the bot is created, send the `/newapp` command to BotFather.
5. Select your bot from the list.
6. Provide all the required information for your Mini App.

## Running the TMA

### 1. Setting Transaction Variables

To configure transaction variables in `src/constants/common-constants.ts`, set the following environment variables:

1. `USDT_MASTER_ADDRESS`: The master address of the USDT.
- **Testnet**,  USDTTT token master: `kQD0GKBM8ZbryVk2aESmzfU6b9b_8era_IkvBSELujFZPsyy`. [Default]
- **Mainnet**, USD₮ `EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs`. You need to set this address manually for production.
2. `INVOICE_WALLET_ADDRESS`: The address of the wallet where USDT will be received upon payment.
Important: This should be the address of the usual TON wallet, not the USDT jetton wallet. 
The address of the USDT jetton wallet will be calculated upon sending.

### 2. Starting the Application

To start the application, run:

```bash
npm run dev
```

The application will be accessible at [http://localhost:5173](http://localhost:5173).

### 3. Exposing Your Local Server (Optional)

#### a. Using `ngrok`

```bash
ngrok http 5173
```

#### b. Using `localtunnel`

```bash
lt --port 5173
```

After setting up ngrok or localtunnel, update your Telegram bot's configuration with the provided URL to ensure the bot points to your local development environment.

### 4. Updating Telegram Bot Configuration (Optional)

#### a. Update the Menu Button URL in Telegram Bot

1. Open [@BotFather](https://t.me/BotFather) in Telegram.
2. Send the `/mybots` command and select your bot.
3. Choose "Bot Settings" then "Menu Button" and finally "Configure menu button".
4. Enter the ngrok or localtunnel URL as the new destination.

#### b. Update Mini Apps URL in Telegram

1. Open [@BotFather](https://t.me/BotFather) in Telegram.
2. Send the `/myapps` command and select your Mini App.
3. Choose "Edit Web App URL".
4. Enter the ngrok or localtunnel URL as the new destination.


## Learn More About Ton Connect

To understand more about Ton Connect and how it enables blockchain functionalities in your applications, refer to the following resources:
- Ton Connect Documentation: [https://docs.ton.org/develop/dapps/ton-connect/](https://docs.ton.org/develop/dapps/ton-connect/)
- Ton Connect SDK and UI Library on GitHub: [https://github.com/ton-connect/sdk/tree/main/packages/ui](https://github.com/ton-connect/sdk/tree/main/packages/ui)



## Advanced

### Returning to the Application (Optional)

To return to the application after interacting with the wallet, you must specify a `twaReturnUrl` in `src/App.tsx`.

Here's a concise guide:

- **twaReturnUrl**: This is the return URL used by Telegram Web Apps. Set it to redirect users back to your application after wallet interaction. Example: `'https://t.me/WebAppWalletBot/myapp'`.

Here is a sample configuration for specifying a return URL:

```jsx
<TonConnectUIProvider
    manifestUrl="https://ton-connect.github.io/demo-dapp-with-wallet/tonconnect-manifest.json"
    uiPreferences={{ theme: THEME.DARK }}
    actionsConfiguration={{
        twaReturnUrl: 'https://t.me/WebAppWalletBot/myapp'
    }}
></TonConnectUIProvider>
```

### Adding a Custom Wallet (Optional)

To integrate a custom wallet into your application, adjust the `walletsListConfiguration` in `src/App.tsx`. Include your wallet details in `includeWallets` and specify `universalLink`.

Here's a concise guide:

- **universalLink**: This URL is used to open the wallet directly from a web link. It should link to your wallet's bot or app. Example: `'https://t.me/wallet/start'`.

Here is a sample configuration for adding a custom wallet:

```jsx
<TonConnectUIProvider
    manifestUrl="https://ton-connect.github.io/demo-dapp-with-wallet/tonconnect-manifest.json"
    uiPreferences={{ theme: THEME.DARK }}
    walletsListConfiguration={{
        includeWallets: [
            {
                appName: "telegram-wallet",
                name: "Wallet",
                imageUrl: "https://wallet.tg/images/logo-288.png",
                aboutUrl: "https://wallet.tg/",
                universalLink: "https://t.me/wallet/start",
                bridgeUrl: "https://bridge.tonapi.io/bridge",
                platforms: ["ios", "android", "macos", "windows", "linux"]
            }
        ]
    }}
    actionsConfiguration={{
        twaReturnUrl: 'https://t.me/WebAppWalletBot/myapp'
    }}
></TonConnectUIProvider>
```

