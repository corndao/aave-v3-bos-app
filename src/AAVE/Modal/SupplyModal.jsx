const { config, data } = props;

const {
  symbol,
  balance,
  marketReferencePriceInUsd,
  supplyAPY,
  usageAsCollateralEnabled,
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

return (
  <Widget
    src={`${config.ownerId}/widget/AAVE.Modal.BaseModal`}
    props={{
      title: `Supply ${symbol}`,
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
                      left: <TokenTexture>0</TokenTexture>,
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
                      left: <GrayTexture>$0.09</GrayTexture>,
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
                if (symbol === "WETH") {
                  // supply weth
                  console.log(`Supply ${symbol}`);
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
