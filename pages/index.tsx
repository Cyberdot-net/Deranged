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
import TokenInfoPopup2 from './TokenInfoPopup2';
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi"
import { ethers } from "ethers"
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';

const Home: NextPage = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [claimNotification, setClaimNotification] = useState<string | null>(null);
  const [swapNotification, setSwapNotification] = useState<string | null>(null);
  const [ethAmount, setEthAmount] = useState<string>("");
  const [ethAmountError, setEthAmountError] = useState<string | null>(null);
  const errorNotificationClass = 'error-notification';
  const successNotificationClass = 'success-notification';
  const [showClaimPopup, setShowClaimPopup] = useState(false);
  const [showTokenInfoPopup, setShowTokenInfoPopup] = useState(false);
  const [showTokenInfoPopup2, setShowTokenInfoPopup2] = useState(false);
  const { openConnectModal } = useConnectModal();
  const { address } = useAccount()
  console.log(address)
  // Function to open the popup 1
  const openTokenInfoPopup = () => {
    setShowTokenInfoPopup(true);
  };

  // Function to close the popup 1
  const closeTokenInfoPopup = () => {
    setShowTokenInfoPopup(false);
  };

  // Function to open the popup 2
  const openTokenInfoPopup2 = () => {
    setShowTokenInfoPopup2(true);
  };

  // Function to close the popup 2
  const closeTokenInfoPopup2 = () => {
    setShowTokenInfoPopup2(false);
  };

  const showClaimSuccessPopup = () => {
    setShowClaimPopup(true);
  };

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
  const contractAddresspremium = '0x42Fda2eC03a664489Bf7D2C19b199d8287F3fB29';
  
  const handleClaimAirdrop = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        // const accounts = await window.ethereum.request({
        //   method: "eth_requestAccounts"
        // });
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner(address)
        const userAddress = address;
        const contractAddress = "0x03E071D664FA812094e15026668C73DDfbB8A99d";
        const contract1 = new ethers.Contract(
          contractAddress,
          YourContract1ABI,
          signer
        );
        const isClaimed = await contract1.hasClaimed(address)
        console.log(isClaimed)
        if (isClaimed === true) {
          toast.error("User has already claimed!", { autoClose: 1500 });
          return;
        }
        // const gasPrice = web3.utils.toWei("5", "gwei");
        const gasPrice = ethers.utils.formatUnits(5, "gwei");
        const data = contract1.claimTokens().encodeABI();
        try {
          // const gasLimit = await provider.estimateGas({
          //   to: contract1.options.address,
          //   data: data,
          //   from: userAddress
          // });

          const result = await signer.sendTransaction({
            to: contract1.options.address,
            data: data,
            from: userAddress,
            gasPrice: gasPrice
          });
          setClaimNotification("Transaction successful. Transaction hash: " + result.hash);

          // Show the claim success popup
          showClaimSuccessPopup();
        } catch (error) {
          console.error("Error:", error);
          setClaimNotification("Transaction failed. Error: " + (error as Error).message);
        }
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      console.error("MetaMask is not installed");
    }
  };

  const handleSwapEthForTokens = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        // Connect to MetaMask
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner(address)
        const contractAddress = "0x42Fda2eC03a664489Bf7D2C19b199d8287F3fB29";
        const contract = new ethers.Contract(
          contractAddress,
          YourContract2ABI,
          signer
        );
        console.log(contract)
        // Ensure the user has entered a valid ETH amount
        if (!ethAmount || isNaN(parseFloat(ethAmount))) {
          toast.error("Please enter a valid ETH amount.", { autoClose: 1500 })
          setEthAmountError("Please enter a valid ETH amount.");
          return;
        }
        // Convert the user-entered ETH amount to Wei
        const ethAmountWei = ethers.utils.parseEther(ethAmount);
        // Call the contract method for swapping ETH for Tokens
        // const methodName = "addLiquidity"; // Replace with the actual method name

        // // Convert gas price to Wei
        // const gasPrice = ethers.utils.formatUnits(5, "gwei"); // Replace '5' with your desired gas price
        const result = await contract.swapEthForTokens({ value: ethAmountWei })
        // const data = contract.methods[methodName]().encodeABI();
        // // Estimate gas limit for the transaction
        // const gasLimit = await provider.estimateGas({
        //   data: data,
        //   from: userAddress,
        //   to: contract.options.address,
        // });
        // // Send the transaction
        // const result = await provider.sendTransaction({
        //   to: contract.options.address,
        //   data: data,
        //   from: userAddress,
        //   gas: gasLimit,
        //   gasPrice: gasPrice,
        //   value: ethAmountWei
        // });
        // Handle the result and show a success notification
        setSwapNotification("Swap successful. Transaction hash: " + result.hash);
      } catch (error) {
        console.error("Error:", error);
        // Use type assertion (casting) to treat `error` as an `Error` object
        setSwapNotification("Swap failed. Error: " + (error as Error).message);
      }
    } else {
      console.error("MetaMask is not installed");
      // Show a message to install MetaMask
    }
  };

  return (
    <>
      <Head>
        <title>DERANGED</title>
      </Head>
      <ToastContainer />

      <div className="flex flex-col gap-16">
        <div className="relative grid h-full gap-10 p-4 pt-20 pb-32 my-auto overflow-hidden xl:px-8 xs:grid-cols-1">
          <div className="z-10 flex flex-col gap-6">

          <div className="shadowed-box">
  <div className="box-content">
    <div className="flex items-center justify-between"> {/* Use flex and justify-between */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 px-4 rounded-full text-neutral-200 max-w-max">
        </div>

        <h1 className="flex flex-col gap-3 font-semibold text-7xl sm:text-6xl xs:text-6xl text-left">
  <span className="text-white text-6xl">Embrace the chaos!</span>
  <span className="text-gray-300 text-2xl">This is the place where crypto&apos;s madness <br /> thrives, and only the deranged survive.</span>
</h1>
<p className="text-gray-300 text-left">
  Claim your share of the crypto madness right here <br /> and prepare to plunge into the depths of chaos!
</p>

        <div>
        <div className="" style={{ marginBottom: '20px' }}>
        <WalletStatus /></div>
        <div className="flex items-center gap-2 mb-3">
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
      {claimNotification && (
        <div className={claimNotification.includes('Transaction failed') ? errorNotificationClass : successNotificationClass}>
          {claimNotification}
        </div>
      )}
    </div>
        </div>
      </div>
      <div className="ml-[-0px] relative">
  <Image
    className={` ${isMobile ? 'ml-auto' : ''}`}
    src="/images/Parachute_02.png"
    alt="Description of the image" // Add a meaningful description here
    width={isMobile ? 288 : 550}
    height={isMobile ? 330 : 550}
    style={{
      width: isMobile ? 'auto' : '95%',
      height: isMobile ? 'auto' : '95%'
    }}
  />
  <div className="centered-backgrounds">
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] rounded-full bg-gradient-radial from-orange-600/10 via-transparent" />
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full bg-gradient-radial from-orange-600/40 via-transparent" />
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] rounded-full bg-gradient-radial from-orange-600/70 via-transparent" />
  </div>
</div>

    </div>

</div>
</div>

            <div className="flex flex-col gap-1">
              <div className="flex flex-col gap-6 font-semibold text-1xl sm:text-1xl xs:text-1xl">
              <div className="shadowed-box">
  <div className="box-content flex items-center">
    <div className={`image-container ${isMobile ? '' : 'mr-auto'}`}>
      <Image
        src="/images/bussiness.png"
        alt="Description of the image" // Add a meaningful description here
        width={isMobile ? 288 : 330}
        height={isMobile ? 330 : 330}
        style={{
          width: isMobile ? 'auto' : '100%',
          height: isMobile ? 'auto' : '100%'
        }}
      />
    </div>
    <div className="text-content">
    <p className="text-6xl text-white text-right">
  Stoke the flames of madness!
</p>

      <p className="text-gray-300 sm:text-6xl xs:text-6xl text-right text-2xl" style={{ marginBottom: '50px', marginTop: '20px' }}>
      Generous tips create a grand spectacle, merging<br></br> all funds into the liquidity pool.
      </p>
      <p className="text-gray-300 sm:text-6xl xs:text-6xl text-center text-1xl" style={{ marginBottom: '20px', marginTop: '20px' }}>
      Join the show and tip your way<br></br> to the deranged stratosphere.
      </p>
      <div className="flex items-center justify-center mt-3 mb-3">
        <div className="bg-gray-800 bg-opacity-0 p-3 rounded-md custom-border" style={{ maxWidth: '295px', textAlign: 'center' }}>
          <p className="text-xs text-gray-300">1 $DERANGED = 0.000000045015846 ETH</p>
          <p className="text-xs text-gray-300">1 ETH = 22,214,399.79157562 $DERANGED</p>
        </div>
      </div>
      <div className="flex items-center justify-center mt-3 mb-3">
      <input
  type="number"
  placeholder="Enter ETH amount"
  value={ethAmount}
  onChange={(e) => setEthAmount(e.target.value)}
  className="p-2 rounded-md mr-2"
  style={{ color: 'black' }}
/>
        <button
          className="flex items-center gap-2 p-4 px-6 transition-all max-w-max hover:scale-105 bg-gradient-to-t from-green-700 via-green-400 to-green-300 rounded-md"
          style={{ backgroundColor: '#c46603', borderRadius: '1rem' }}
          onClick={address === null ? openConnectModal : handleSwapEthForTokens}
        >
          <span className="font-semibold" style={{ color: 'rgb(45, 34, 70)' }}>Premium</span>
          {/* Add a loading indicator if needed */}
        </button>
      </div>
      <div>
  <button
    className="flex items-center gap-2 p-1 px-5 transition-all max-w-max hover:scale-105 bg-gradient-to-t from-blue-700 via-blue-400 to-blue-300 rounded-md"
    style={{ backgroundColor: '#c46603', borderRadius: '0.6rem' }}
    onClick={openTokenInfoPopup2}
  >
    Info
  </button>
  {showTokenInfoPopup2 && (
    <TokenInfoPopup2
      walletAddress={contractAddresspremium}
      contractAddress={contractAddresspremium}
      closePopup={closeTokenInfoPopup2}
    />
  )}
</div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'white' }}>
        <div>Time Remaining</div>
        <CountdownTimer targetDate={targetDate2} textColor="white" />
      </div>
    </div>
  </div>
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
              {swapNotification && (
                <div className="text-sm font-semibold text-green-800">{swapNotification}</div>
              )}

              {/* ... */}
            </div>
          </div>

          <div className="relative flex flex-col items-center justify-center gap-2">
            <div className="relative">

</div>

          </div>
        </div>
      </div>
      <TokenomicsSection />
    </>
  );
};

export default Home;
