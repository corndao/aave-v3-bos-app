const { config, assetsToBorrow, chainId, onActionSuccess } = props;

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
            <Widget
              src={`${config.ownerId}/widget/AAVE.Card.CardEmpty`}
              props={{
                config,
                children: "Nothing borrows yet",
              }}
            />
          </>
        ),
      }}
    />
  </>
);
