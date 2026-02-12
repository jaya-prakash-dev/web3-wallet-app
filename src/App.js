import { Component } from "react";
import { ethers } from "ethers";
import WalletSection from "./components/WalletSection";
import BalanceDetails from "./components/BalanceDetails";
import "./App.css";

class App extends Component {
  state = {
    walletAddress: "",
    ethBalance: "",
    usdtBalance: "",
    isConnected: false,
    isLoading: false,
    networkError: "",
  };
  componentDidMount() {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });

      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
    }
  }

  connectWallet = async () => {
    if (window.ethereum === undefined) {
      alert("MetaMask is not installed");
      return;
    }

    this.setState({ isLoading: true, networkError: "" });

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Always request accounts first
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      // Now check network AFTER connection
      const network = await provider.getNetwork();

      if (network.chainId !== 1n) {
        this.setState({
          networkError: "Please switch to Ethereum Mainnet",
          isLoading: false,
          isConnected: false,
          walletAddress: "",
          ethBalance: "",
          usdtBalance: "",
        });
        return;
      }

      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const balanceInWei = await provider.getBalance(address);
      const balanceInEth = parseFloat(ethers.formatEther(balanceInWei)).toFixed(
        4,
      );

      const usdtContractAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

      const usdtAbi = [
        "function balanceOf(address owner) view returns (uint256)",
      ];

      const usdtContract = new ethers.Contract(
        usdtContractAddress,
        usdtAbi,
        provider,
      );

      const usdtBalanceRaw = await usdtContract.balanceOf(address);

      const usdtBalanceFormatted = parseFloat(
        ethers.formatUnits(usdtBalanceRaw, 6),
      ).toFixed(2);

      this.setState({
        walletAddress: address,
        isConnected: true,
        ethBalance: balanceInEth,
        usdtBalance: usdtBalanceFormatted,
        isLoading: false,
        networkError: "",
      });
    } catch (error) {
      console.log(error);
      this.setState({ isLoading: false });
    }
  };

  render() {
    const {
      walletAddress,
      ethBalance,
      usdtBalance,
      isConnected,
      isLoading,
      networkError,
    } = this.state;

    return (
      <div className="app-container">
        <div className="responsive-container">
          <h1 className="main-heading">Web3 Wallet Dashboard</h1>

          <WalletSection
            walletAddress={walletAddress}
            isConnected={isConnected}
            connectWallet={this.connectWallet}
            isLoading={isLoading}
            networkError={networkError}
          />

          <BalanceDetails ethBalance={ethBalance} usdtBalance={usdtBalance} />
        </div>
      </div>
    );
  }
}

export default App;
