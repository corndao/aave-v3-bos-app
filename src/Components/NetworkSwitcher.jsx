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
`;

const SwitchTitle = styled.div`
  color: white;

  font-size: 18px;
  margin-left: 8px;
`;

return (
  <>
    <SwitchContainer>
      <ETH_MATIC />

      <SwitchTitle>Polygon zkEVM</SwitchTitle>
    </SwitchContainer>
  </>
);
