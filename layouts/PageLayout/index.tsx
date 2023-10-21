import { FC, ReactNode, useState } from "react"
import { Background } from "components/Background"
import { Footer } from "components/Footer"
import { Logo } from "components/Logo"
import { Wallet } from "components/Wallet"
import { HiMenu } from "react-icons/hi"
import Popup from "reactjs-popup"
import ConnectWalletButton from "../../components/Wallet/ConnectWalletButton";
import { useAccount } from "wagmi"
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit"


type PageLayoutProps = {
  children: ReactNode
}

export const PageLayout: FC<PageLayoutProps> = ({ children }) => {
  const [isOpen, setOpen] = useState(false)
  const { openConnectModal } = useConnectModal();
  const { address } = useAccount()
  console.log(address)
  const closeModal = () => {
    setOpen(false)
  }

  return (
    <Background>
      <div className="flex flex-col min-h-screen xl:container xl:mx-auto">
        <header className="z-10 flex items-center min-h-[76px] justify-between px-4 py-4 xl:px-8">
          <div className="flex divide-x divide-gray-500">
            <Logo />
          </div>
          <div className="flex items-center gap-4">
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
              }) => {
                // Note: If your app doesn't use authentication, you
                // can remove all 'authenticationStatus' checks
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                  ready &&
                  account &&
                  chain &&
                  (!authenticationStatus ||
                    authenticationStatus === 'authenticated');

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      'style': {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <button onClick={openConnectModal} type="button" className="bg-blue-500 px-4 py-2 rounded-xl text-white">
                            Connect Wallet
                          </button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <button onClick={openChainModal} type="button" className="bg-red-500 text-white px-4 py-2 rounded-xl">
                            Wrong network
                          </button>
                        );
                      }

                      return (
                        <div style={{ display: 'flex', gap: 12 }}>
                          <button
                            onClick={openChainModal}
                            style={{ display: 'flex', alignItems: 'center' }}
                            type="button"
                            className="bg-blue-500 px-2 py-2 text-white rounded-md"
                          >
                            {chain.hasIcon && (
                              <div
                                style={{
                                  background: chain.iconBackground,
                                  width: 18,
                                  height: 18,
                                  borderRadius: 999,
                                  overflow: 'hidden',
                                  marginRight: 4,
                                }}
                              >
                                {chain.iconUrl && (
                                  <img
                                    alt={chain.name ?? 'Chain icon'}
                                    src={chain.iconUrl}
                                    style={{ width: 18, height: 18 }}
                                  />
                                )}
                              </div>
                            )}
                            <div className="flex xs:hidden">{chain.name}</div>
                          </button>

                          <button onClick={openAccountModal} type="button" className="bg-blue-500 px-4 py-2 rounded-md text-white">
                            <div className="flex xs:hidden">{account.displayName}</div> (
                            {account.displayBalance
                              ? `${account.displayBalance}`
                              : ''})
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </header>
        <main className="flex flex-col grow">
          {children}
        </main>
        <footer className="flex justify-center p-4 rounded-t-md">
          <Footer />
        </footer>
      </div>
    </Background>
  )
}
