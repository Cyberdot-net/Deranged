import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import PropTypes from 'prop-types';

const TokenInfoPopup2 = ({ walletAddress, contractAddress, closePopup }) => {
  const [tokenBalance, setTokenBalance] = useState('0');
  const [transactionCount, setTransactionCount] = useState(0);
  const [ethBalance, setEthBalance] = useState('0');

  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const truncateBalance = (balance) => {
    return balance.slice(0, -24);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const provider = new ethers.providers.JsonRpcProvider(
          'https://eth-sepolia.g.alchemy.com/v2/Hsxe3B-XTEp2o3QNI2LxIFYFaAf3cy0T'
        );

        // Replace with the specific token address you want to query
        const tokenAddress = '0x75B71e17a84D592c7CDC84d4184bA8A88cC729A4';

        // Create an ERC20 token contract instance
        const tokenContract = new ethers.Contract(
          tokenAddress,
          ['function balanceOf(address) view returns (uint256)'],
          provider
        );

        // Fetch the token balance for the wallet
        const tokenBalance = await tokenContract.balanceOf(walletAddress);

        const formattedTokenBalance = formatNumber(
          ethers.utils.formatUnits(tokenBalance, 0)
        );

        const truncatedTokenBalance = truncateBalance(formattedTokenBalance);

        setTokenBalance(truncatedTokenBalance);

        // Fetch transaction count from Etherscan
        const etherscanApiKey = '5E3S3P9U3XR432TSVUJQN7T79Q4KFNXS88';
        const etherscanApiUrl = 'https://api.etherscan.io/api';
        const address = walletAddress;

        const response = await axios.get(etherscanApiUrl, {
          params: {
            module: 'account',
            action: 'txlist',
            address,
            startblock: 0,
            endblock: 99999999,
            sort: 'asc',
            apikey: etherscanApiKey
          }
        });

        const transactionData = response.data.result;
        const count = transactionData.length;

        setTransactionCount(count);

        // Fetch the ETH balance of the contract
        const ethBalance = await provider.getBalance(contractAddress);
        const formattedEthBalance = ethers.utils.formatEther(ethBalance);

        setEthBalance(formattedEthBalance);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [walletAddress, contractAddress]);





  return (
    <div className="popup-container">
  <div className="popup-content" style={{ width: '60%' }}>
    <p>ETH</p>
    <p>{ethBalance}</p>
    <button
      style={{
        background: 'linear-gradient(to top, #0072c1, #4e92ca, #8cb1d4)',
        borderRadius: '0.6rem',
        color: 'white',
        padding: '0.3rem 1rem',
        cursor: 'pointer',
        marginTop: '10px' // Add margin-top here
      }}
      onClick={closePopup}
    >
      Close
    </button>
  </div>
</div>

  );
};

TokenInfoPopup2.propTypes = {
  walletAddress: PropTypes.string.isRequired,
  contractAddress: PropTypes.string.isRequired,
  closePopup: PropTypes.func.isRequired
};

export default TokenInfoPopup2;
