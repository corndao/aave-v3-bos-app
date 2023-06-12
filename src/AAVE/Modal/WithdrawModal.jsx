const { config } = props;

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
                      left: <TokenTexture>0.1</TokenTexture>,
                      right: (
                        <TokenWrapper>
                          <img
                            width={26}
                            height={26}
                            src={`https://app.aave.com/icons/tokens/${"USDT".toLowerCase()}.svg`}
                          />
                          <TokenTexture>USDT</TokenTexture>
                        </TokenWrapper>
                      ),
                    }}
                  />
                  <Widget
                    src={`${config.ownerId}/widget/AAVE.Modal.FlexBetween`}
                    props={{
                      left: <GrayTexture>$0.09</GrayTexture>,
                      right: <GrayTexture>Wallet balance: 1.49</GrayTexture>,
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
                      right: <WhiteTexture>0.98887210 USDT</WhiteTexture>,
                    }}
                  />
                </TransactionOverviewContainer>
              ),
            }}
          />
          <Widget
            src={`${config.ownerId}/widget/AAVE.PrimaryButton`}
            props={{
              children: "Supply DAI",
              onClick: () => {
                console.log("Supply DAI");
              },
            }}
          />
        </WithdrawContainer>
      ),
      config,
    }}
  />
);
