import { useState, useEffect } from "react";
import { useAccount } from "wagmi";

// Declare the ethereum property on window
declare global {
  interface Window {
    ethereum?: any;
  }
}

const WalletStatus = () => {
  const { address } = useAccount()
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  useEffect(() => {
    if (address !== undefined) setIsWalletConnected(true)
    else setIsWalletConnected(false)
  }, [address]);

  return (
    <div className={`flex items-center gap-2 px-4 border-2 rounded-full text-neutral-200 max-w-max
      ${isWalletConnected ? "border-green-600" : "border-yellow-500"}`}>
      <div
        className={`w-2 h-2 ${isWalletConnected ? "bg-green-600" : "bg-yellow-500"
          } rounded-full`}
      ></div>
      <span className="text-sm font-semibold">
        {isWalletConnected ? "Wallet deranged correctly" : "Wallet not deranged"}
      </span>
    </div>
  );
}

export default WalletStatus;
