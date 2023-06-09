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
      };
    case "testnet":
      return {
        ownerId: "aave-v3.testnet",
        nodeUrl: "https://rpc.testnet.near.org",
        ipfsPrefix: "https://ipfs.near.social/ipfs",
      };
    default:
      throw Error(`Unconfigured environment '${network}'.`);
  }
}
const config = getConfig(context.networkId);

// App states
State.init({
  imports: {},
  chainId: 42161,
});

const loading = !state.assetsToSupply;

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
    return;
  }
  provider
    .getSigner()
    ?.getAddress()
    ?.then((address) => {
      State.update({ address });
    });
  if (!state.address) {
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
    const balanceRaw = Big(userBalances[idx].balance).div(
      Big(10).pow(userBalances[idx].decimals)
    );
    const balance = balanceRaw.toFixed(2);
    const balanceInUSD = balanceRaw
      .mul(market.marketReferencePriceInUsd)
      .toFixed(2);
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
  "Loading..."
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
        props={{ config, yourSupplies: state.yourSupplies }}
      />
      <Widget
        src={`${config.ownerId}/widget/AAVE.Card.AssetsToSupply`}
        props={{ config, assetsToSupply: state.assetsToSupply }}
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
