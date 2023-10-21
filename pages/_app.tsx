import { useEffect, useState } from "react";
import "styles/globals.css";
import type { AppProps } from "next/app.js";
import { PageLayout } from "layouts/PageLayout";
// import { defaultWagmiConfig } from "@web3modal/wagmi";

// const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultWallets,
  RainbowKitProvider
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  zora,
  bsc,
  bscTestnet,
  sepolia
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

if (!process.env.NEXT_PUBLIC_PROJECT_ID) {
  throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");
}

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, zora, bsc, bscTestnet, sepolia],
  [
    alchemyProvider({ apiKey: 'ekZhZsGjfWuK39pYW_YXSEcRKDN8amSN' }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'walletConnect',
  projectId: 'fe62b424c4ab666f47d64744e0b3dca0',
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <>
      {ready ? (
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider coolMode chains={chains}>
            <PageLayout>
              <Component {...pageProps} />
            </PageLayout >
          </RainbowKitProvider>
        </WagmiConfig>
      ) : null
      }
    </>
  );
}

export default MyApp;
