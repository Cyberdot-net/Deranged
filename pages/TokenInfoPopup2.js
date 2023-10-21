import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import PropTypes from 'prop-types';

const TokenInfoPopup2 = ({ contractAddress, closePopup }) => {
  const [ethBalance, setEthBalance] = useState('0');

  useEffect(() => {
    async function fetchData () {
      try {
        const provider = new ethers.providers.JsonRpcProvider(
          'https://eth-sepolia.g.alchemy.com/v2/Hsxe3B-XTEp2o3QNI2LxIFYFaAf3cy0T'
        );

        // Fetch the ETH balance of the contract
        const ethBalance = await provider.getBalance(contractAddress);
        const formattedEthBalance = ethers.utils.formatEther(ethBalance);

        setEthBalance(formattedEthBalance);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [contractAddress]);

  return (
    <div className="popup-container">
    <div className="popup-content" style={{ width: '30%', marginTop: '10px' }}>
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
  contractAddress: PropTypes.string.isRequired,
  closePopup: PropTypes.func.isRequired
};

export default TokenInfoPopup2;
