const { config, assetsToSupply } = props;

return (
  <Widget
    src={`${config.ownerId}/widget/AAVE.Card.CardsView`}
    props={{
      config,
      style: {
        marginTop: "16px",
      },
      title: "AssetsToSupply",
      body:
        !assetsToSupply || assetsToSupply.length === 0 ? (
          <Widget
            src={`${config.ownerId}/widget/AAVE.Card.CardEmpty`}
            props={{
              config,
              children: "Nothing supplied yet",
            }}
          />
        ) : (
          <>
            {/* pcView */}
            <Widget
              src={`${config.ownerId}/widget/AAVE.Card.CardsTable`}
              props={{
                config,
                headers: [
                  "Asset",
                  "Wallet balance",
                  "Supply APY",
                  "Can be collateral",
                  "",
                ],
                datas: assetsToSupply.map((row, idx) => [
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
                    <div>{row.balance}</div>
                    <div>$ {row.balanceInUSD}</div>
                  </div>,
                  `${(Number(row.supplyAPY) * 100).toFixed(2)} %`,
                  <div style={{ paddingLeft: "50px" }}>
                    {row.usageAsCollateralEnabled && (
                      <img
                        src={`${config.ipfsPrefix}/bafkreibsy5fzn67veowyalveo6t34rnqvktmok2zutdsp4f5slem3grc3i`}
                        width={16}
                        height={16}
                      />
                    )}
                    {!row.usageAsCollateralEnabled && (
                      <img
                        src={`${config.ipfsPrefix}/bafkreie5skej6q2tik3qa3yldkep4r465poq33ay55uzp2p6hty2ifhkmq`}
                        width={16}
                        height={16}
                      />
                    )}
                  </div>,
                  <Widget
                    src={`${config.ownerId}/widget/AAVE.PrimaryButton`}
                    props={{
                      children: "Supply",
                      onClick: () => {
                        console.log("Supply");
                      },
                    }}
                  />,
                ]),
              }}
            />
            {/* mobile view */}
            {assetsToSupply.map((row, idx) => {
              return (
                <Widget
                  src={`${config.ownerId}/widget/AAVE.Card.CardContainer`}
                  props={{
                    children: [
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
                                    <div className="card-data-key">
                                      Wallet balance
                                    </div>
                                    <div className="card-data-value">
                                      <div>{row.balance}</div>
                                      <div>$ {row.balanceInUSD}</div>
                                    </div>
                                  </div>,
                                  <div className="card-data-row">
                                    <div className="card-data-key">
                                      Supply APY
                                    </div>
                                    <div className="card-data-value">{`${(
                                      Number(row.supplyAPY) * 100
                                    ).toFixed(2)} %`}</div>
                                  </div>,
                                  <div className="card-data-row">
                                    <div className="card-data-key">
                                      Can be collateral
                                    </div>
                                    <div className="card-data-value">
                                      {row.usageAsCollateralEnabled && (
                                        <img
                                          src={`${config.ipfsPrefix}/bafkreibsy5fzn67veowyalveo6t34rnqvktmok2zutdsp4f5slem3grc3i`}
                                          width={16}
                                          height={16}
                                        />
                                      )}
                                      {!row.usageAsCollateralEnabled && (
                                        <img
                                          src={`${config.ipfsPrefix}/bafkreie5skej6q2tik3qa3yldkep4r465poq33ay55uzp2p6hty2ifhkmq`}
                                          width={16}
                                          height={16}
                                        />
                                      )}
                                    </div>
                                  </div>,
                                ],
                              }}
                            />,
                            <Widget
                              src={`${config.ownerId}/widget/AAVE.PrimaryButton`}
                              props={{
                                children: "Supply",
                                onClick: () => {
                                  console.log("Supply");
                                },
                              }}
                            />,
                          ],
                        }}
                      />,
                      <Widget
                        src={`${config.ownerId}/widget/AAVE.Card.Divider`}
                        props={{ config }}
                      />,
                    ],
                  }}
                />
              );
            })}
          </>
        ),
    }}
  />
);