const { config } = props;

const ETH_MATIC = () => (
  <img
    height={36}
    src={`${config.ipfsPrefix}/bafkreibcyx5qsxnzwklrar7vcksny2us5ijavtfcxwlwj2plabspzenwii`}
  />
);

const SwitchContainer = styled.div`
  display: flex;
  align-items: center;

  @media (min-width: 640px) {
    justify-content: center;

    img {
      height: 60px;
    }
  }
`;

const SwitchTitle = styled.div`
  color: white;

  font-size: 18px;
  margin-left: 8px;

  @media (min-width: 640px) {
    font-size: 36px;
    font-weight: bold;
  }
`;

return (
  <>
    <SwitchContainer>
      <ETH_MATIC />

      <SwitchTitle>Polygon zkEVM</SwitchTitle>
    </SwitchContainer>
  </>
);
