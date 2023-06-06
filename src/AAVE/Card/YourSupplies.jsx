const { config, supply } = props;

const mobileDataRow = (
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
                src={`${config.ownerId}/widget/AAVE.Card.CardDataWrapper`}
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
                src={`${config.ownerId}/widget/AAVE.PrimaryButton`}
                props={{
                  children: "Withdraw",
                  onClick: () => {
                    console.log("Withdraw");
                  },
                }}
              />,
            ],
          }}
        />,
      ],
    }}
  />
);

const mobileView = (
  <>
    {mobileDataRow}
    {mobileDataRow}
  </>
);

const dataRow = [
  <Widget
    src={`${config.ownerId}/widget/AAVE.Card.TokenWrapper`}
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
  <div>
    <div>0.0923810</div>
    <div>$ 0.09</div>
  </div>,
  "2.06 %",
  <Widget
    src={`${config.ownerId}/widget/AAVE.PrimaryButton`}
    props={{
      children: "Supply",
      onClick: () => {
        console.log("Supply");
      },
    }}
  />,
];

const pcView = (
  <>
    <Widget
      src={`${config.ownerId}/widget/AAVE.Card.CardsTable`}
      props={{
        config,
        headers: ["Asset", "Wallet balance", "Supply APY", ""],
        datas: [dataRow, dataRow, dataRow],
      }}
    />
  </>
);
return (
  <Widget
    src={`${config.ownerId}/widget/AAVE.Card.CardsView`}
    props={{
      config,
      style: {
        marginTop: "16px",
      },
      title: "Your supplies",
      body:
        supply === undefined ? (
          <Widget
            src={`${config.ownerId}/widget/AAVE.Card.CardEmpty`}
            props={{
              config,
              children: "Nothing supplied yet",
            }}
          />
        ) : (
          <>
            {mobileView}
            {pcView}
          </>
        ),
    }}
  />
);
