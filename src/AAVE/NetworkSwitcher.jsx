const { config, switchNetwork } = props;

const ETH_MATIC = () => (
  <img
    height={36}
    src={`${config.ipfsPrefix}/bafkreibcyx5qsxnzwklrar7vcksny2us5ijavtfcxwlwj2plabspzenwii`}
  />
);

const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  position: relative;

  .dropdown-pc {
    display: none;
    position: absolute;
    right: 0;
    top: 80px;
    min-width: 260px;

    background: #151718;
    padding: 20px 16px;
    border-radius: 10px;
    font-size: 12px;
    z-index: 1;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);
  }
  .dropdown-img {
    width: 16px;
    height: 16px;
    margin-left: 8px;
    transition: all 0.3s ease-in-out;

    transform: rotate(${() => (state.showDropdown ? "180deg" : "0deg")});
  }

  @media (min-width: 640px) {
    justify-content: center;

    img {
      height: 60px;
    }

    .dropdown-img {
      width: 32px;
      height: 32px;
    }

    .dropdown-pc {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .dropdown-pc-item {
      display: flex;
      align-items: center;

      div {
        margin-left: 10px;
      }
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

const DropdownMobile = styled.div`
  position: fixed;
  z-index: 9999;

  height: 80vh;
  left: 0;
  bottom: 0;
  width: 100%;
  background: #151718;

  display: flex;
  flex-direction: column;
  gap: 20px;

  padding: 20px 12px;
  font-size: 12px;

  .dropdown-mobile-item {
    font-size: 14px;
    display: flex;
    align-items: center;

    div {
      margin-left: 10px;
    }
  }
`;

const DropdownContainer = styled.div`
  display: flex;
  align-items: center;
`;

const DropdownImage = () => (
  <img
    className="dropdown-img"
    src={`${config.ipfsPrefix}/bafkreiexo22bzy2dnto7xlzee5dgz3mkb5smmpvzdgx7ed3clbw3ad3jsa`}
  />
);

const ArbImage = () => (
  <img
    className="dropdown-img"
    src={`${config.ipfsPrefix}/bafkreic2ev5k5m44bs6hooi4s3wsmbjtwhh3mrcgoe3wugrg75yhkrorvi`}
  />
);

const EthImage = () => (
  <img
    className="dropdown-img"
    src={`${config.ipfsPrefix}/bafkreigeztpd4ehnjdlfzhk4uutrnc6b2v4c6mjcraxq6cbdy76kwtqkf4`}
  />
);

const toggleDropdown = () =>
  State.update({ showDropdown: !state.showDropdown });

State.init({
  showDropdown: false,
});

return (
  <>
    {state.showDropdown && (
      <DropdownMobile>
        <div>Select Aave Market</div>
        <div
          className="dropdown-mobile-item"
          onClick={() => {
            State.update({ showDropdown: false });
            switchNetwork(1);
          }}
        >
          <EthImage />
          <div>Ethereum</div>
        </div>
        <div
          className="dropdown-mobile-item"
          onClick={() => {
            State.update({ showDropdown: false });
            switchNetwork(42161);
          }}
        >
          <ArbImage />
          <div>Arbitrum</div>
        </div>
      </DropdownMobile>
    )}
    <SwitchContainer>
      <DropdownContainer onClick={toggleDropdown}>
        <ETH_MATIC />
        <SwitchTitle>Polygon zkEVM</SwitchTitle>
        <DropdownImage />
      </DropdownContainer>
      {state.showDropdown && (
        <div className="dropdown-pc">
          <div>Select Aave Market</div>
          <div
            className="dropdown-pc-item"
            onClick={() => {
              State.update({ showDropdown: false });
              switchNetwork(1);
            }}
          >
            <EthImage />
            <div>Ethereum</div>
          </div>
          <div
            className="dropdown-pc-item"
            onClick={() => {
              State.update({ showDropdown: false });
              switchNetwork(42161);
            }}
          >
            <ArbImage />
            <div>Arbitrum</div>
          </div>
        </div>
      )}
    </SwitchContainer>
  </>
);
