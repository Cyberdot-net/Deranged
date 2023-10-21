import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import PropTypes from 'prop-types'; // Import PropTypes

const TokenInfoPopup = ({ walletAddress, closePopup }) => {
  const [tokenBalance, setTokenBalance] = useState('0');
  const [transactionCount, setTransactionCount] = useState(0);

  // Function to format a number by adding commas
  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Function to truncate the last 18 digits
  const truncateBalance = (balance) => {
    return balance.slice(0, -24);
  };

  useEffect(() => {
    async function fetchData () {
      try {
        // Initialize an ethers.js provider
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
        const balance = await tokenContract.balanceOf(walletAddress);

        // Format the token balance by removing decimals and adding commas
        const formattedBalance = formatNumber(
          ethers.utils.formatUnits(balance, 0)
        ); // Assuming 0 decimal places

        // Truncate the last 18 digits
        const truncatedBalance = truncateBalance(formattedBalance);

        // Set the truncated token balance
        setTokenBalance(truncatedBalance);

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

        // Set the transaction count
        setTransactionCount(count);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [walletAddress]);

  return (
    <div className="popup-container">
      <div className="popup-content" style={{ width: '60%' }}>
        <p>Remaining: {tokenBalance} $DERANGED</p>
        <p>Total Transactions: {transactionCount}</p>
        <button onClick={closePopup}>Close</button>
      </div>
    </div>
  );
};

// Add prop type validation
TokenInfoPopup.propTypes = {
  walletAddress: PropTypes.string.isRequired,
  closePopup: PropTypes.func.isRequired
};

export default TokenInfoPopup;
