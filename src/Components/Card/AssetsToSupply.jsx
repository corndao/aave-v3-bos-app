const { config, supply } = props;

return (
  <Widget
    src={`${config.ownerId}/widget/Components.Card.CardsView`}
    props={{
      config,
      style: {
        marginTop: "16px",
      },
      title: "AssetsToSupply",
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
                          <div className="card-data-key">Wallet balance</div>
                          <div className="card-data-value">
                            <div>0.0923810</div>
                            <div>$ 0.09</div>
                          </div>
                        </div>,
                        <div className="card-data-row">
                          <div className="card-data-key">Supply APY</div>
                          <div className="card-data-value">2.06%</div>
                        </div>,
                        <div className="card-data-row">
                          <div className="card-data-key">Can be collateral</div>
                          <div className="card-data-value">
                            <img
                              src={`${config.ipfsPrefix}/bafkreibsy5fzn67veowyalveo6t34rnqvktmok2zutdsp4f5slem3grc3i`}
                              width={16}
                              height={16}
                            />
                          </div>
                        </div>,
                      ],
                    }}
                  />,
                  <Widget
                    src={`${config.ownerId}/widget/Components.PrimaryButton`}
                    props={{
                      children: "Supply",
                      onClick: () => {
                        console.log("Supply");
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
                          <div className="card-data-key">Wallet balance</div>
                          <div className="card-data-value">
                            <div>0.0923810</div>
                            <div>$ 0.09</div>
                          </div>
                        </div>,
                        <div className="card-data-row">
                          <div className="card-data-key">Supply APY</div>
                          <div className="card-data-value">2.06%</div>
                        </div>,
                        <div className="card-data-row">
                          <div className="card-data-key">Can be collateral</div>
                          <div className="card-data-value">
                            <img
                              src={`${config.ipfsPrefix}/bafkreibsy5fzn67veowyalveo6t34rnqvktmok2zutdsp4f5slem3grc3i`}
                              width={16}
                              height={16}
                            />
                          </div>
                        </div>,
                      ],
                    }}
                  />,
                  <Widget
                    src={`${config.ownerId}/widget/Components.PrimaryButton`}
                    props={{
                      children: "Supply",
                      onClick: () => {
                        console.log("Supply");
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
