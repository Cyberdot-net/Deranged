import { ToolTipPieChart } from "components/TooltipPieChart";
import Image from 'next/image'; // Import Next.js Image component
import tokenomicsImage from "../../public/images/Icon.png"; // Replace with the actual path to your image

export const TokenomicsSection = () => {
  return (
    <div className="bg-primaryPurple-900 text-white">
      {/* Tokenomics Title */}
      <h2 className="pt-8 pb-4 text-7xl font-cartoonia3d text-center">Tokenomics</h2>

      {/* Top Div with Token Information */}
      <div className="flex flex-col items-center px-4">
        <div className="flex flex-col gap-2 text-center">
          <span className="text-lg">$DRGD</span>
          <span className="text-xs text-neutral-300">Token Symbol</span>
          <span className="text-lg">69,420,000,000</span>
          <span className="text-xs text-neutral-300">Total Supply</span>
        </div>
      </div>

      {/* Bottom Div with Pie Chart and Image */}
      <div className="flex flex-col items-center sm:flex-row sm:justify-center mt-4">
        {/* Centered Container for Pie Chart and Image */}
        <div className="flex items-center">
          {/* Left Column (Pie Chart) */}
          <div className="mr-4">
            <ToolTipPieChart data={[
              { title: "Free Claim", value: 15, color: "#1cae41" },
              { title: "Premium Claim", value: 25, color: "#8a1d1d" },
              { title: "Centralized Exchange (CEX)", value: 4, color: "#004377" },
              { title: "Marketing and Collaboration", value: 4, color: "#eab308" },
              { title: "Liquidity Pool", value: 52, color: "#c46603" }
            ]} />
          </div>

          {/* Right Column (Image) */}
          <div className="flex items-center">
            <Image src={tokenomicsImage} alt="Tokenomics Image" width={300} height={400} />
          </div>
        </div>
      </div>
    </div>
  );
};

