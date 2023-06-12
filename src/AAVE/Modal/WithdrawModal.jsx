const { config, data, onRequestClose } = props;

if (!data) {
  return;
}

const ROUND_DOWN = 0;
function isValid(a) {
  if (!a) return false;
  if (isNaN(Number(a))) return false;
  if (a === "") return false;
  return true;
}

const {
  decimals,
  symbol,
  underlyingBalance,
  underlyingBalanceUSD,
  marketReferencePriceInUsd,
} = data;

const WithdrawContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const TokenTexture = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: white;
`;

const TokenWrapper = styled.div`
  display: flex;
  img {
    margin-right: 4px;
  }
`;

const GrayTexture = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #7c7c86;
`;

const PurpleTexture = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #8a8db9;
`;

const WhiteTexture = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: white;
`;
const TransactionOverviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Input = styled.input`
  background: transparent;
  border: none;
  outline: none;

  font-size: 20px;
  font-weight: bold;
  color: white;
  flex: 1;
  width: 160px;

  &[type="number"]::-webkit-outer-spin-button,
  &[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &[type="number"] {
    -moz-appearance: textfield;
  }
`;

State.init({
  amount: "",
  amountInUSD: "0.00",
});

const _remainingSupply = Number(underlyingBalance) - Number(state.amount);
const remainingSupply = isNaN(_remainingSupply)
  ? underlyingBalance
  : Big(_remainingSupply).toFixed(2);

function withdrawETH(amount) {
  return Ethers.provider()
    .getSigner()
    .getAddress()
    .then((address) => {
      const wrappedTokenGateway = new ethers.Contract(
        config.wrappedTokenGatewayV3Address,
        config.wrappedTokenGatewayV3ABI.body,
        Ethers.provider().getSigner()
      );

      return wrappedTokenGateway.withdrawETH(
        config.aavePoolV3Address,
        amount,
        address
      );
    })
    .then(() => onRequestClose);
}

return (
  <Widget
    src={`${config.ownerId}/widget/AAVE.Modal.BaseModal`}
    props={{
      title: "Withdraw USDT",
      onRequestClose: props.onRequestClose,
      children: (
        <WithdrawContainer>
          <Widget
            src={`${config.ownerId}/widget/AAVE.Modal.RoundedCard`}
            props={{
              title: "Amount",
              config,
              children: (
                <>
                  <Widget
                    src={`${config.ownerId}/widget/AAVE.Modal.FlexBetween`}
                    props={{
                      left: (
                        <TokenTexture>
                          <Input
                            type="number"
                            value={state.amount}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (isValid(value)) {
                                State.update({
                                  amountInUSD: Big(value)
                                    .mul(marketReferencePriceInUsd)
                                    .toFixed(2, ROUND_DOWN),
                                });
                              } else {
                                State.update({ amountInUSD: "0.00" });
                              }
                              State.update({ amount: value });
                            }}
                            placeholder="0"
                          />
                        </TokenTexture>
                      ),
                      right: (
                        <TokenWrapper>
                          <img
                            width={26}
                            height={26}
                            src={`https://app.aave.com/icons/tokens/${symbol.toLowerCase()}.svg`}
                          />
                          <TokenTexture>{symbol}</TokenTexture>
                        </TokenWrapper>
                      ),
                    }}
                  />
                  <Widget
                    src={`${config.ownerId}/widget/AAVE.Modal.FlexBetween`}
                    props={{
                      left: <GrayTexture>${state.amountInUSD}</GrayTexture>,
                      right: (
                        <GrayTexture>
                          Supply balance:{" "}
                          {Big(underlyingBalance).toFixed(3, ROUND_DOWN)}
                        </GrayTexture>
                      ),
                    }}
                  />
                </>
              ),
            }}
          />
          <Widget
            src={`${config.ownerId}/widget/AAVE.Modal.RoundedCard`}
            props={{
              title: "Transaction overview",
              config,
              children: (
                <TransactionOverviewContainer>
                  <Widget
                    src={`${config.ownerId}/widget/AAVE.Modal.FlexBetween`}
                    props={{
                      left: <PurpleTexture>Remaining supply</PurpleTexture>,
                      right: (
                        <WhiteTexture>{remainingSupply} USDT</WhiteTexture>
                      ),
                    }}
                  />
                </TransactionOverviewContainer>
              ),
            }}
          />
          <Widget
            src={`${config.ownerId}/widget/AAVE.PrimaryButton`}
            props={{
              children: "Withdraw",
              onClick: () => {
                const amount = Big(state.amount)
                  .mul(Big(10).pow(decimals))
                  .toFixed(0);
                if (symbol === "WETH") {
                  // supply weth
                  withdrawETH(amount);
                } else {
                  // supply common
                  console.log(`Withdraw ${symbol}`);
                }
              },
            }}
          />
        </WithdrawContainer>
      ),
      config,
    }}
  />
);
