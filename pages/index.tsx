import { useState, useEffect } from "react";
import { TokenomicsSection } from "content/TokenomicsSection";
import type { NextPage } from "next";
import Head from "next/head";
import WalletStatus from "../components/Wallet/WalletStatus";
import YourContract1ABI from "./abi1.json";
import YourContract2ABI from "./abi2.json";
import Image from "next/image";
import CountdownTimer from '../components/Countdown/CountdownTimer';
import TokenInfoPopup from './TokenInfoPopup';
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useContractRead, useContractWrite, useWalletClient } from "wagmi"
import { ethers } from "ethers"
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';

const Home: NextPage = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  // const [claimNotification, setClaimNotification] = useState<string | null>(null);
  // const [swapNotification, setSwapNotification] = useState<string | null>(null);
  const [ethAmount, setEthAmount] = useState<string>("");
  const [ethAmountError, setEthAmountError] = useState<string | null>(null);
  // const errorNotificationClass = 'error-notification';
  // const successNotificationClass = 'success-notification';
  const [showClaimPopup, setShowClaimPopup] = useState(false);
  const [showTokenInfoPopup, setShowTokenInfoPopup] = useState(false);
  const { openConnectModal } = useConnectModal();
  const { data: signer } = useWalletClient()
  const { address } = useAccount()

  // Function to open the popup
  const openTokenInfoPopup = () => {
    setShowTokenInfoPopup(true);
  };

  // Function to close the popup
  const closeTokenInfoPopup = () => {
    setShowTokenInfoPopup(false);
  };

  // const showClaimSuccessPopup = () => {
  //   setShowClaimPopup(true);
  // };

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();

    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  const targetDate = '2023-10-23T16:00:00'; // Replace with your specific date and time
  const targetDate2 = '2023-10-24T16:00:00'; // Replace with your specific date and time
  const contractAddressfree = '0x03E071D664FA812094e15026668C73DDfbB8A99d'; // Replace with the actual contract address

  const hasClaimed = useContractRead({
    address: '0x03E071D664FA812094e15026668C73DDfbB8A99d',
    abi: YourContract1ABI,
    functionName: 'hasClaimed',
    args: [address]
  })

  const { write } = useContractWrite({
    address: '0x03E071D664FA812094e15026668C73DDfbB8A99d',
    abi: YourContract1ABI,
    functionName: 'claimTokens',
    onError: async (data) => {
      await new Promise(resolve => {
        toast.error(`Transaction Failed. ${data}`, {
          autoClose: 2000,
          onClose: resolve
        });
      });
    },
    onSuccess: async (data) => {
      await new Promise(resolve => {
        toast.success(`Transaction Success. ${data}`, {
          autoClose: 2000,
          onClose: resolve
        });
      });
    }
  })

  const { write: swapEthForTokens } = useContractWrite({
    address: '0x42Fda2eC03a664489Bf7D2C19b199d8287F3fB29',
    abi: YourContract2ABI,
    functionName: 'swapEthForTokens',
    onError: async (data) => {
      await new Promise(resolve => {
        toast.error(`Transaction Failed. ${data}`, {
          autoClose: 2000,
          onClose: resolve
        });
      });
    },
    onSuccess: async (data) => {
      await new Promise(resolve => {
        toast.success(`Transaction Success. ${data}`, {
          autoClose: 2000,
          onClose: resolve
        });
      });
    }
  })

  const handleClaimAirdrop = async () => {
    if (!signer) return;
    const isClaimed = hasClaimed.data;
    console.log(isClaimed)
    if (isClaimed === true) {
      toast.error("User has already claimed!", { autoClose: 1500 });
      return;
    }
    write({
      args: []
    })
  };

  const handleSwapEthForTokens = async () => {
    // Connect to MetaMask
    if (!signer) return;
    if (!ethAmount || isNaN(parseFloat(ethAmount))) {
      toast.error("Please enter a valid ETH amount.", { autoClose: 1500 })
      setEthAmountError("Please enter a valid ETH amount.");
      return;
    }
    const ethAmountWei = ethers.utils.parseEther(ethAmount);
    swapEthForTokens({
      args: [],
      value: ethAmountWei.toBigInt()
    })
  };

  return (
    <>
      <Head>
        <title>DERANGED</title>
      </Head>
      <ToastContainer />
      <div className="flex flex-col gap-16">
        <div className="relative grid h-full grid-cols-2 gap-10 p-4 pt-20 pb-32 my-auto overflow-hidden xl:px-8 xs:grid-cols-1">
          <div className="z-10 flex flex-col gap-6">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2 px-4 rounded-full text-neutral-200 max-w-max">
              </div>

              <h1 className="flex flex-col gap-3 font-semibold text-7xl sm:text-6xl xs:text-6xl">
                <span className="text-white text-6xl">Embrace the chaos!</span>
                <span className="text-white text-2xl">This is the place where crypto&apos;s madness <br></br>thrives, and only the deranged survive.
                </span>
              </h1>
              <p className="text-gray-100">
                Claim your share of the crypto madness right here <br /> and prepare to plunge into the depths of chaos!
              </p>
              <div></div>
            </div>
            <div className=""><WalletStatus /></div>
            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-2 p-4 px-8 transition-all max-w-max hover:scale-105 bg-gradient-to-t from-yellow-700 via-yellow-400 to-yellow-300 rounded-md"
                style={{ backgroundColor: '#c46603', borderRadius: '1rem' }}
                // onClick={handleClaimAirdrop}
                onClick={address === undefined ? openConnectModal : handleClaimAirdrop}
              >
                <span className="font-semibold" style={{ color: 'rgb(45, 34, 70)' }}>Claim</span>
                {/* Add your loading and arrow icons here */}
              </button>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'white' }}>
                <div>Time Remaining</div>
                <CountdownTimer targetDate={targetDate} textColor="white" />
              </div>
            </div>
            <div>
              <button className="flex items-center gap-2 p-1 px-5 transition-all max-w-max hover:scale-105 bg-gradient-to-t from-blue-700 via-blue-400 to-blue-300 rounded-md"
                style={{ backgroundColor: '#c46603', borderRadius: '0.6rem' }} onClick={openTokenInfoPopup}>Info</button>
              {showTokenInfoPopup && <TokenInfoPopup walletAddress={contractAddressfree} closePopup={closeTokenInfoPopup} />}
            </div>

            <div className="flex flex-col gap-16">

              {/* ClaimTokens Notification */}
              {/* {claimNotification && (
                <div className={claimNotification.includes('Transaction failed') ? errorNotificationClass : successNotificationClass}>
                  {claimNotification}
                </div>
              )} */}

              {/* ... */}
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-col gap-6 font-semibold text-1xl sm:text-1xl xs:text-1xl">
                <p className="text-gray-300">Stoke the flames of madness! Generous tips set the<br></br> stage for a grand spectacle, with all funds merging<br></br> into the liquidity pool in a truly deranged fashion.<br></br> Be a part of the show and tip your way to the<br></br> deranged stratosphere!</p>

              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Enter ETH amount"
                value={ethAmount}
                onChange={(e) => setEthAmount(e.target.value)}
                className="p-2 rounded-md"
              />

              <div className="flex items-center gap-2">
                <button
                  className="flex items-center gap-2 p-4 px-6 transition-all max-w-max hover:scale-105 bg-gradient-to-t from-green-700 via-green-400 to-green-300 rounded-md"
                  style={{ backgroundColor: '#c46603', borderRadius: '1rem' }}
                  // onClick={handleSwapEthForTokens}
                  onClick={address == null ? openConnectModal : handleSwapEthForTokens}
                >
                  <span className="font-semibold" style={{ color: 'rgb(45, 34, 70)' }}>Premium</span>
                  {/* Add loading indicator if needed */}
                </button>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'white' }}>
                  <div>Time Remaining</div>
                  <CountdownTimer targetDate={targetDate2} textColor="white" />
                </div>
              </div>
              <div className="parent-container">

                {showClaimPopup && (
                  <div className="popup">
                    <div className="popup-content">
                      <p>Claim successful!</p>
                      <p>Are you looking for more chances to earn bigger?</p>
                      <p>
                        Head over to our{" "}
                        <a
                          href="https://zealy.io/c/deranged"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "orange" }}
                        >
                          Zealy Community
                        </a>{" "}
                        and get deranged
                      </p>
                      <button onClick={() => setShowClaimPopup(false)}>Close</button>
                    </div>
                  </div>
                )}
              </div>

            </div>
            {ethAmountError && (
              <div className="text-sm font-semibold text-red-800">{ethAmountError}</div>
            )}
            <div className="flex flex-col gap-16">

              {/* SwapEthForTokens Notification */}
              {/* {swapNotification && (
                <div className="text-sm font-semibold text-green-800">{swapNotification}</div>
              )} */}

              {/* ... */}
            </div>
          </div>

          <div className="relative flex flex-col items-center justify-center gap-2">
            <div className="relative">
              <div className="ml-[-0px]">
                <Image
                  className={` ${isMobile ? 'ml-auto' : ''}`}
                  src="/images/Parachute_02.png"
                  alt="Description of the image" // Add a meaningful description here
                  width={isMobile ? 288 : 550}
                  height={isMobile ? 330 : 550}
                  style={{
                    width: isMobile ? 'auto' : '100%',
                    height: isMobile ? 'auto' : '100%'
                  }}
                />
              </div>
            </div>
            <div className="bg-gray-800 bg-opacity-0 p-2 rounded-md custom-border" style={{ maxWidth: '295px' }}>
              <p className="text-xs text-gray-300">1 $DERANGED = 0.000000045015846 ETH</p>
              <p className="text-xs text-gray-300">1 ETH = 22,214,399.79157562 $DERANGED</p>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] mx-auto my-auto rounded-full bg-gradient-radial from-orange-600/10 via-transparent" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] mx-auto my-auto rounded-full bg-gradient-radial from-orange-600/40 via-transparent" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] mx-auto my-auto rounded-full bg-gradient-radial from-orange-600/70 via-transparent" />
          </div>
        </div>
        <TokenomicsSection />
      </div>
    </>
  );
};

export default Home;
