const { config, yourBorrows } = props;

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
