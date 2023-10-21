export const SEPOLIA_CHAIN_ID = 11155111

export const MEME_COIN_ADDRESS = process.env.NEXT_PUBLIC_MEME_COIN_ADDRESS
export const AIRDROP_ADDRESS = process.env.NEXT_PUBLIC_AIRDROP_ADDRESS

export const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID as string) || SEPOLIA_CHAIN_ID
