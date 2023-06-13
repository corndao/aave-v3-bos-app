const ROUND_DOWN = 0;

function isValid(a) {
  if (!a) return false;
  if (isNaN(Number(a))) return false;
  if (a === "") return false;
  return true;
}

// interface Market {
//   id: string,
//   underlyingAsset: string,
//   name: string,
//   symbol: string,
//   decimals: number,
// }
// returns Market[]
function getMarkets(chainId) {
  return fetch(`https://aave-api.pages.dev/${chainId}/markets`);
}

/**
 * @param {string} account user address
 * @param {string[]} tokens list of token addresses
 */
// interface TokenBalance {
//   token: string,
//   balance: string,
//   decimals: number,
// }
// returns TokenBalance[]
function getUserBalances(chainId, account, tokens) {
  const url = `https://aave-api.pages.dev/${chainId}/balances?account=${account}&tokens=${tokens.join(
    "|"
  )}`;
  return fetch(url);
}

// interface UserDeposit {
//   underlyingAsset: string,
//   name: string,
//   symbol: string,
//   scaledATokenBalance: string,
//   usageAsCollateralEnabledOnUser: boolean,
//   underlyingBalance: string,
//   underlyingBalanceUSD: string,
// }
// returns UserDeposit[]
function getUserDeposits(chainId, address) {
  return fetch(`https://aave-api.pages.dev/${chainId}/deposits/${address}`);
}

// App config
function getConfig(network) {
  switch (network) {
    case "mainnet":
      return {
        ownerId: "aave-v3.near",
        nodeUrl: "https://rpc.mainnet.near.org",
        ipfsPrefix: "https://ipfs.near.social/ipfs",
        aavePoolV3Address: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
        wrappedTokenGatewayV3Address:
          "0xb5ee21786d28c5ba61661550879475976b707099",
        wrappedTokenGatewayV3ABI: fetch(
          "https://gist.githubusercontent.com/danielwpz/7867f925ce705b7df93cc61f2b1c0807/raw/ec1b149453a9000cecad647450c267ef351b8ae2/gistfile1.txt"
        ),
      };
    case "testnet":
      return {
        ownerId: "aave-v3.testnet",
        nodeUrl: "https://rpc.testnet.near.org",
        ipfsPrefix: "https://ipfs.near.social/ipfs",
        aavePoolV3Address: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
        wrappedTokenGatewayV3Address:
          "0xb5ee21786d28c5ba61661550879475976b707099",
        wrappedTokenGatewayV3ABI: fetch(
          "https://gist.githubusercontent.com/danielwpz/7867f925ce705b7df93cc61f2b1c0807/raw/ec1b149453a9000cecad647450c267ef351b8ae2/gistfile1.txt"
        ),
      };
    default:
      throw Error(`Unconfigured environment '${network}'.`);
  }
}
const config = getConfig(context.networkId);

// Get AAVE config by chain id
function getAAVEConfig(chainId) {
  switch (chainId) {
    case 1: // ethereum mainnet
      return {
        aavePoolV3Address: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
        wrappedTokenGatewayV3Address:
          "0xD322A49006FC828F9B5B37Ab215F99B4E5caB19C",
      };
    case 42161: // arbitrum one
      return {
        aavePoolV3Address: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
        wrappedTokenGatewayV3Address:
          "0xB5Ee21786D28c5Ba61661550879475976B707099",
      };
    case 137: // polygon mainnet
      return {
        aavePoolV3Address: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
        wrappedTokenGatewayV3Address:
          "0x1e4b7A6b903680eab0c5dAbcb8fD429cD2a9598c",
      };
    case 1442: // zkevm testnet
      return {
        aavePoolV3Address: "0x4412c92f6579D9FC542D108382c8D1d6D2Be63d9",
        wrappedTokenGatewayV3Address:
          "0xD82940E16D25aB1349914e1C369eF1b287d457BF",
      };
    default:
      throw new Error("unknown chain id");
  }
}

// App states
State.init({
  imports: {},
  chainId: 42161,
  showWithdrawModal: false,
  showSupplyModal: false,
});

const loading = !state.assetsToSupply || !state.yourSupplies;

// Import functions to state.imports
function importFunctions(imports) {
  if (loading) {
    State.update({
      imports,
    });
  }
}

// Define the modules you'd like to import
const modules = {
  number: `${config.ownerId}/widget/Utils.Number`,
  date: `${config.ownerId}/widget/Utils.Date`,
  data: `${config.ownerId}/widget/AAVE.Data`,
};
// Import functions
const { formatAmount } = state.imports.number;
const { formatDateTime } = state.imports.date;

function initData() {
  const provider = Ethers.provider();
  if (!provider) {
    State.update({ connectWallet: false });
    return;
  }
  provider
    .getSigner()
    ?.getAddress()
    ?.then((address) => {
      State.update({ address });
    });
  provider
    .getSigner()
    ?.getBalance()
    .then((balance) => State.update({ ethBalance: balance }));
  if (!state.address || !state.ethBalance) {
    return;
  }
  const marketsResponse = getMarkets(state.chainId);
  if (!marketsResponse) {
    return;
  }
  const markets = JSON.parse(marketsResponse.body);
  const userBalancesResponse = getUserBalances(
    state.chainId,
    state.address,
    markets.map((market) => market.underlyingAsset)
  );
  if (!userBalancesResponse) {
    return;
  }
  const userBalances = JSON.parse(userBalancesResponse.body);
  const assetsToSupply = markets.map((market, idx) => {
    if (!isValid(userBalances[idx].decimals)) {
      return;
    }
    const balanceRaw = Big(
      market.symbol === "WETH" ? state.ethBalance : userBalances[idx].balance
    ).div(Big(10).pow(userBalances[idx].decimals));
    const balance = balanceRaw.toFixed(3, ROUND_DOWN);
    const balanceInUSD = balanceRaw
      .mul(market.marketReferencePriceInUsd)
      .toFixed(3, ROUND_DOWN);
    return {
      ...userBalances[idx],
      ...market,
      balance,
      balanceInUSD,
    };
  });
  State.update({
    assetsToSupply,
  });

  // yourSupplies
  const userDepositsResponse = getUserDeposits(state.chainId, state.address);
  if (!userDepositsResponse) {
    return;
  }
  const userDeposits = JSON.parse(userDepositsResponse.body).filter(
    (row) => Number(row.underlyingBalance) !== 0
  );
  const marketsMapping = markets.reduce((prev, cur) => {
    prev[cur.symbol] = cur;
    return prev;
  }, {});
  const yourSupplies = userDeposits.map((userDeposit) => {
    const market = marketsMapping[userDeposit.symbol];
    return {
      ...market,
      ...userDeposit,
    };
  });
  State.update({
    yourSupplies,
  });
}

initData();

const Body = styled.div`
  padding: 24px 15px;
  background: #0e0e26;
  min-height: 100vh;
  color: white;
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
// Component body
const body = loading ? (
  <>
    <Widget src={`${config.ownerId}/widget/AAVE.Header`} props={{ config }} />
    <Body>
      {state.connectWallet ? "Loading" : "Need to connect wallet first."}
    </Body>
  </>
) : (
  <>
    <Widget src={`${config.ownerId}/widget/AAVE.Header`} props={{ config }} />
    <Body>
      <FlexContainer>
        <Widget
          src={`${config.ownerId}/widget/AAVE.NetworkSwitcher`}
          props={{
            config,
            switchNetwork: (chainId) => {
              State.update({
                chainId,
                assetsToSupply: undefined,
                yourSupplies: undefined,
              });
            },
          }}
        />
      </FlexContainer>
      <Widget
        src={`${config.ownerId}/widget/AAVE.TabSwitcher`}
        props={{ config }}
      />
      <Widget
        src={`${config.ownerId}/widget/AAVE.Card.YourSupplies`}
        props={{
          config,
          yourSupplies: state.yourSupplies,
          showWithdrawModal: state.showWithdrawModal,
          setShowWithdrawModal: (isShow) =>
            State.update({ showWithdrawModal: isShow }),
        }}
      />
      <Widget
        src={`${config.ownerId}/widget/AAVE.Card.AssetsToSupply`}
        props={{
          config,
          assetsToSupply: state.assetsToSupply,
          showSupplyModal: state.showWithdrawModal,
          setShowSupplyModal: (isShow) =>
            State.update({ showWithdrawModal: isShow }),
        }}
      />
    </Body>
  </>
);

return (
  <div>
    {/* Component Head */}
    <Widget
      src={`${config.ownerId}/widget/Utils.Import`}
      props={{ modules, onLoad: importFunctions }}
    />
    {/* Component Body */}
    {body}
  </div>
);
