import './index.css'

const BalanceDetails = props => {
  const {ethBalance, usdtBalance} = props

  return (
    <div className="balance-container">
      <h2>Balances</h2>
      <p>
        ETH: <span>{ethBalance}</span>
      </p>
      <p>
        USDT: <span>{usdtBalance}</span>
      </p>
    </div>
  )
}

export default BalanceDetails

