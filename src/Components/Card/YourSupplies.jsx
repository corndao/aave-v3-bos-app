const { config, supply } = props;

const NoSupplyContainer = styled.div`
  min-height: 220px;

  font-size: 14px;

  display: grid;
  place-content: center;
`;

const SupplyContainer = styled.div`
  display: flex;
  flex-direction: column;

  gap: 20px;
`;

const TokenWrapper = styled.div`
  display: flex;

  img {
    margin-right: 10px;
  }

  .token-title {
    font-size: 24px;
    font-weight: bold;
  }

  .token-chain {
    font-size: 16px;
    font-weight: 500;
    color: #6f6f6f;
  }
`;

const KVWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .kv-row {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .kv-key {
    color: #777790;
    font-size: 15px;
    font-weight: 500;
  }
  .kv-value {
    font-size: 15px;
    font-weight: bold;
    text-align: right;
  }
`;
return (
  <Widget
    src={`${config.ownerId}/widget/Components.Card.CardsView`}
    props={{
      style: {
        marginTop: "16px",
      },
      title: "Your supplies",
      body:
        supply === undefined ? (
          <NoSupplyContainer>Nothing supplied yet</NoSupplyContainer>
        ) : (
          <SupplyContainer>
            <TokenWrapper>
              <img
                width={64}
                height={64}
                src={`${config.ipfsPrefix}/bafkreifsxqn36p7om3pqyrtrd3rkrzowdson3q3xml3ltyadsqhc73f57u`}
              />
              <div>
                <div className="token-title">Tether</div>
                <div className="token-chain">USDT</div>
              </div>
            </TokenWrapper>
            <KVWrapper>
              <div className="kv-row">
                <div className="kv-key">Supply balance</div>
                <div className="kv-value">
                  <div>0.0923810</div>
                  <div>$ 0.09</div>
                </div>
              </div>
              <div className="kv-row">
                <div className="kv-key">Supply APY</div>
                <div className="kv-value">2.06%</div>
              </div>
            </KVWrapper>
            <Widget
              src={`${config.ownerId}/widget/Components.PrimaryButton`}
              props={{
                children: "Withdraw",
                onClick: () => {
                  console.log("Withdraw");
                },
              }}
            />
          </SupplyContainer>
        ),
    }}
  />
);
