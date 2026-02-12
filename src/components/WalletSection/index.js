import './index.css'

const WalletSection = props => {
  const {walletAddress, isConnected, connectWallet, isLoading} = props

  const getShortAddress = address => {
    if (address === '') {
      return ''
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="wallet-section-container">
      <h2>Wallet Connection</h2>

      {!isConnected ? (
        <button
          type="button"
          onClick={connectWallet}
          disabled={isLoading}
        >
          {isLoading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <p>{getShortAddress(walletAddress)}</p>
      )}
    </div>
  )
}

export default WalletSection
