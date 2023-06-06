const { config, supply } = props;

return (
  <Widget
    src={`${config.ownerId}/widget/Components.Card.CardsView`}
    props={{
      config,
      style: {
        marginTop: "16px",
      },
      title: "Your supplies",
      body:
        supply === undefined ? (
          <Widget
            src={`${config.ownerId}/widget/Components.Card.CardEmpty`}
            props={{
              children: "Nothing supplied yet",
            }}
          />
        ) : (
          <>
            <Widget
              src={`${config.ownerId}/widget/Components.Card.CardContainer`}
              props={{
                children: [
                  <Widget
                    src={`${config.ownerId}/widget/Components.Card.TokenWrapper`}
                    props={{
                      children: [
                        <img
                          width={64}
                          height={64}
                          src={`${config.ipfsPrefix}/bafkreifsxqn36p7om3pqyrtrd3rkrzowdson3q3xml3ltyadsqhc73f57u`}
                        />,
                        <div>
                          <div className="token-title">Tether</div>
                          <div className="token-chain">USDT</div>
                        </div>,
                      ],
                    }}
                  />,
                  <Widget
                    src={`${config.ownerId}/widget/Components.Card.CardDataWrapper`}
                    props={{
                      children: [
                        <div className="card-data-row">
                          <div className="card-data-key">Supply balance</div>
                          <div className="card-data-value">
                            <div>0.0923810</div>
                            <div>$ 0.09</div>
                          </div>
                        </div>,
                        <div className="card-data-row">
                          <div className="card-data-key">Supply APY</div>
                          <div className="card-data-value">2.06%</div>
                        </div>,
                      ],
                    }}
                  />,
                  <Widget
                    src={`${config.ownerId}/widget/Components.PrimaryButton`}
                    props={{
                      children: "Withdraw",
                      onClick: () => {
                        console.log("Withdraw");
                      },
                    }}
                  />,
                ],
              }}
            />
            <Widget
              src={`${config.ownerId}/widget/Components.Card.Divider`}
              props={{ config }}
            />
            <Widget
              src={`${config.ownerId}/widget/Components.Card.CardContainer`}
              props={{
                children: [
                  <Widget
                    src={`${config.ownerId}/widget/Components.Card.TokenWrapper`}
                    props={{
                      children: [
                        <img
                          width={64}
                          height={64}
                          src={`${config.ipfsPrefix}/bafkreifsxqn36p7om3pqyrtrd3rkrzowdson3q3xml3ltyadsqhc73f57u`}
                        />,
                        <div>
                          <div className="token-title">Tether</div>
                          <div className="token-chain">USDT</div>
                        </div>,
                      ],
                    }}
                  />,
                  <Widget
                    src={`${config.ownerId}/widget/Components.Card.CardDataWrapper`}
                    props={{
                      children: [
                        <div className="card-data-row">
                          <div className="card-data-key">Supply balance</div>
                          <div className="card-data-value">
                            <div>0.0923810</div>
                            <div>$ 0.09</div>
                          </div>
                        </div>,
                        <div className="card-data-row">
                          <div className="card-data-key">Supply APY</div>
                          <div className="card-data-value">2.06%</div>
                        </div>,
                      ],
                    }}
                  />,
                  <Widget
                    src={`${config.ownerId}/widget/Components.PrimaryButton`}
                    props={{
                      children: "Withdraw",
                      onClick: () => {
                        console.log("Withdraw");
                      },
                    }}
                  />,
                ],
              }}
            />
          </>
        ),
    }}
  />
);
