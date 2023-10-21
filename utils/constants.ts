import { CHAIN_ID, SEPOLIA_CHAIN_ID } from "config"
import { AddEthereumChainParameter } from "@3rdweb/hooks"

// Chains & Icons -> https://github.com/ethereum-lists/chains/tree/master/_data

interface t {
  [key: number]: AddEthereumChainParameter
}

export const addNetowrkMetadata: t = {
  [SEPOLIA_CHAIN_ID]: {
    chainId: `0x${CHAIN_ID.toString(16)}`,
    chainName: "Sepolia",
    nativeCurrency: {
      name: "Sepolia",
      symbol: "ETH",
      decimals: 18
    },
    rpcUrls: ["https://rpc.sepolia.org/"],
    blockExplorerUrls: ["https://sepolia.etherscan.io/"],
    iconUrls: [""]
  }
}

export const networkMetadata = {}
