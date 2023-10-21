import { Web3Button } from "@web3modal/react";

const ConnectWalletButton = () => {
  const styles = {
    container: {
      display: "flex",
      justifyContent: "flex-end",
      padding: "20px"
    }
  };

  return (
    <div style={styles.container}>
  <Web3Button
    icon="show"
    label="Connect Wallet"
    balance="show"
  />
</div>
  );
};

export default ConnectWalletButton;
