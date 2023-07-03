const {
  config,
  yourBorrows,
  showRepayModal,
  setShowRepayModal,
  onActionSuccess,
  chainId,
} = props;

State.init({
  data: undefined,
});

const RepayButton = ({ data }) => (
  <Widget
    src={`${config.ownerId}/widget/AAVE.PrimaryButton`}
    props={{
      config,
      children: "Repay",
      onClick: () => {
        State.update({ data });
        setShowRepayModal(true);
      },
    }}
  />
);

if (!yourBorrows) {
  return <div />;
}

const { debts, ...yourBorrowsCommonParams } = yourBorrows;

return (
  <>
    <Widget
      src={`${config.ownerId}/widget/AAVE.Card.CardsView`}
      props={{
        config,
        style: {
          marginTop: "16px",
        },
        title: "Your borrows",
        body: (
          <>
            {!debts || debts.length === 0 ? (
              <Widget
                src={`${config.ownerId}/widget/AAVE.Card.CardEmpty`}
                props={{
                  config,
                  children: "Nothing borrowed yet",
                }}
              />
            ) : (
              <>
                {/* mobile view */}
                {debts.map((row) => (
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
                              <RepayButton
                                data={{ ...row, ...yourBorrowsCommonParams }}
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
                    headers: ["Asset", "Debt", "APY", ""],
                    data: debts.map((row) => {
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
                          <div>{Number(row.variableBorrows).toFixed(7)}</div>
                          <div>
                            $ {Number(row.variableBorrowsUSD).toFixed(2)}
                          </div>
                        </div>,
                        `${(Number(row.variableBorrowAPY) * 100).toFixed(2)} %`,
                        <RepayButton
                          data={{ ...row, ...yourBorrowsCommonParams }}
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
    {showRepayModal && (
      <Widget
        src={`${config.ownerId}/widget/AAVE.Modal.RepayModal`}
        props={{
          config,
          onRequestClose: () => setShowRepayModal(false),
          data: state.data,
          onActionSuccess,
          onlyOneBorrow: debts.length === 1,
          chainId,
        }}
      />
    )}
  </>
);
