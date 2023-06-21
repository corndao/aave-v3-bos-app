const { config, assetsToBorrow, chainId, onActionSuccess } = props;

function isValid(a) {
  if (!a) return false;
  if (isNaN(Number(a))) return false;
  if (a === "") return false;
  return true;
}
console.log({ assetsToBorrow });
return (
  <>
    <Widget
      src={`${config.ownerId}/widget/AAVE.Card.CardsView`}
      props={{
        config,
        style: {
          marginTop: "16px",
        },
        title: "Assets to borrow",
        body: (
          <>
            {!assetsToBorrow ||
            !assetsToBorrow.debts ||
            assetsToBorrow.debts.length === 0 ? (
              <Widget
                src={`${config.ownerId}/widget/AAVE.Card.CardEmpty`}
                props={{
                  config,
                  children: "Nothing borrows yet",
                }}
              />
            ) : (
              <>
                {/* mobile view */}
                {assetsToBorrow.debts.map((row) => (
                  <Widget
                    src={`${config.ownerId}/widget/AAVE.Card.CardContainer`}
                    props={{
                      children: [
                        <Widget
                          src={`${config.ownerId}/widget/AAVE.Card.Divider`}
                          props={{ config }}
                        />,
                        <Widget
                          src={`${config.ownerId}/widget/AAVE.Card.CardsBody`}
                          props={{
                            config,
                            children: [
                              <Widget
                                src={`${config.ownerId}/widget/AAVE.Card.TokenWrapper`}
                                props={{
                                  children: [
                                    <img
                                      width={64}
                                      height={64}
                                      src={`https://app.aave.com/icons/tokens/${row.symbol.toLowerCase()}.svg`}
                                    />,
                                    <div>
                                      <div className="token-title">
                                        {row.symbol}
                                      </div>
                                      <div className="token-chain">
                                        {row.name}
                                      </div>
                                    </div>,
                                  ],
                                }}
                              />,
                              <Widget
                                src={`${config.ownerId}/widget/AAVE.Card.CardDataWrapper`}
                                props={{
                                  children: [
                                    <div className="card-data-row">
                                      <div className="card-data-key">Debt</div>
                                      <div className="card-data-value">
                                        <div>
                                          {Number(row.variableBorrows).toFixed(
                                            7
                                          )}
                                        </div>
                                        <div>
                                          ${" "}
                                          {Number(
                                            row.variableBorrowsUSD
                                          ).toFixed(2)}
                                        </div>
                                      </div>
                                    </div>,
                                    <div className="card-data-row">
                                      <div className="card-data-key">APY</div>
                                      <div className="card-data-value">{`${(
                                        Number(row.variableBorrowAPY) * 100
                                      ).toFixed(2)} %`}</div>
                                    </div>,
                                  ],
                                }}
                              />,
                              <Widget
                                src={`${config.ownerId}/widget/AAVE.PrimaryButton`}
                                props={{
                                  config,
                                  children: "Repay",
                                  onClick: () => {
                                    //
                                  },
                                }}
                              />,
                            ],
                          }}
                        />,
                      ],
                    }}
                  />
                ))}
                {/* pc view */}
                <Widget
                  src={`${config.ownerId}/widget/AAVE.Card.CardsTable`}
                  props={{
                    config,
                    headers: [
                      "Asset",
                      "Available to borrow",
                      "APY, variable",
                      "",
                    ],
                    data: assetsToBorrow.debts.map((row) => {
                      return [
                        <Widget
                          src={`${config.ownerId}/widget/AAVE.Card.TokenWrapper`}
                          props={{
                            children: [
                              <img
                                width={64}
                                height={64}
                                src={`https://app.aave.com/icons/tokens/${row.symbol.toLowerCase()}.svg`}
                              />,
                              <div>
                                <div className="token-title">{row.symbol}</div>
                                <div className="token-chain">{row.name}</div>
                              </div>,
                            ],
                          }}
                        />,
                        <div>
                          <div>
                            {isValid(assetsToBorrow.availableBorrowsUSD) &&
                            isValid(row.marketReferencePriceInUsd)
                              ? Big(assetsToBorrow.availableBorrowsUSD)
                                  .div(row.marketReferencePriceInUsd)
                                  .toFixed(7)
                              : Number(0).toFixed(7)}
                          </div>
                          <div>
                            ${" "}
                            {Number(assetsToBorrow.availableBorrowsUSD).toFixed(
                              2
                            )}
                          </div>
                        </div>,
                        `${(Number(row.variableBorrowAPY) * 100).toFixed(2)} %`,
                        <Widget
                          src={`${config.ownerId}/widget/AAVE.PrimaryButton`}
                          props={{
                            config,
                            children: "Repay",
                            onClick: () => {
                              //
                            },
                          }}
                        />,
                      ];
                    }),
                  }}
                />
              </>
            )}
          </>
        ),
      }}
    />
  </>
);
