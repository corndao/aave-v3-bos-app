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
  symbol,
  balance,
  marketReferencePriceInUsd,
  supplyAPY,
  usageAsCollateralEnabled,
  decimals,
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

const GreenTexture = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #2cffa7;
`;

const RedTexture = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: red;
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

function depositETH(amount) {
  return Ethers.provider()
    .getSigner()
    .getAddress()
    .then((address) => {
      const wrappedTokenGateway = new ethers.Contract(
        config.wrappedTokenGatewayV3Address,
        config.wrappedTokenGatewayV3ABI.body,
        Ethers.provider().getSigner()
      );
      return wrappedTokenGateway.depositETH(
        config.aavePoolV3Address,
        address,
        0,
        {
          value: amount,
        }
      );
    })
    .then((res) => {
      const hash =
        "0xe0e603df530a864a21f922c3ecf460c5a8319c32c6f582ad6aac461baf804f2";
      // after success
      onRequestClose();
    });
}

return (
  <Widget
    src={`${config.ownerId}/widget/AAVE.Modal.BaseModal`}
    props={{
      title: `Supply ${symbol}`,
      onRequestClose: onRequestClose,
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
                        <GrayTexture>Wallet balance: {balance}</GrayTexture>
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
                      left: <PurpleTexture>Supply APY</PurpleTexture>,
                      right: (
                        <WhiteTexture>
                          {(Number(supplyAPY) * 100).toFixed(2)}%
                        </WhiteTexture>
                      ),
                    }}
                  />
                  <Widget
                    src={`${config.ownerId}/widget/AAVE.Modal.FlexBetween`}
                    props={{
                      left: <PurpleTexture>Collateralization</PurpleTexture>,
                      right: usageAsCollateralEnabled ? (
                        <GreenTexture>Enabled</GreenTexture>
                      ) : (
                        <RedTexture>Disabled</RedTexture>
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
              children: `Supply ${symbol}`,
              onClick: () => {
                const amount = Big(state.amount)
                  .mul(Big(10).pow(decimals))
                  .toFixed(0);
                if (symbol === "WETH") {
                  // supply weth
                  depositETH(amount);
                } else {
                  // supply common
                  console.log(`Supply ${symbol}`);
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
