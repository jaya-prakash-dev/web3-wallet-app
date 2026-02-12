import {Component} from 'react'
import {ethers} from 'ethers'
import WalletSection from './components/WalletSection'
import BalanceDetails from './components/BalanceDetails'
import './App.css'

class App extends Component {
  state = {
    walletAddress: '',
    ethBalance: '',
    usdtBalance: '',
    isConnected: false,
    isLoading: false,
  }

  connectWallet = async () => {
    if (window.ethereum === undefined) {
      alert('MetaMask is not installed')
      return
    }

    this.setState({isLoading: true})

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)

      await provider.send('eth_requestAccounts', [])

      const signer = await provider.getSigner()
      const address = await signer.getAddress()

      // Fetch ETH balance
      const balanceInWei = await provider.getBalance(address)
      const balanceInEth = parseFloat(
        ethers.formatEther(balanceInWei)
      ).toFixed(4)

      // USDT Contract (Ethereum Mainnet)
      const usdtContractAddress =
        '0xdAC17F958D2ee523a2206206994597C13D831ec7'

      const usdtAbi = [
        'function balanceOf(address owner) view returns (uint256)',
      ]

      const usdtContract = new ethers.Contract(
        usdtContractAddress,
        usdtAbi,
        provider
      )

      const usdtBalanceRaw = await usdtContract.balanceOf(address)

      const usdtBalanceFormatted = parseFloat(
        ethers.formatUnits(usdtBalanceRaw, 6)
      ).toFixed(2)

      this.setState({
        walletAddress: address,
        isConnected: true,
        ethBalance: balanceInEth,
        usdtBalance: usdtBalanceFormatted,
        isLoading: false,
      })
    } catch (error) {
      console.log(error)
      this.setState({isLoading: false})
    }
  }

  render() {
    const {
      walletAddress,
      ethBalance,
      usdtBalance,
      isConnected,
      isLoading,
    } = this.state

    return (
      <div className="app-container">
        <div className="responsive-container">
          <h1 className="main-heading">Web3 Wallet Dashboard</h1>

          <WalletSection
            walletAddress={walletAddress}
            isConnected={isConnected}
            connectWallet={this.connectWallet}
            isLoading={isLoading}
          />

          <BalanceDetails
            ethBalance={ethBalance}
            usdtBalance={usdtBalance}
          />
        </div>
      </div>
    )
  }
}

export default App
