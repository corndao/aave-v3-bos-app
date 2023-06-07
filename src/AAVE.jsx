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
});

const loading = Object.keys(state.imports).length === 0;

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
const { getMarkets, getUserDeposits, getUserBalances } = state.imports.data;

const Body = styled.div`
  padding: 24px 15px;
  background: #0e0e26;
  min-height: 100vh;
  color: white;
`;

// Component body
const body = loading ? (
  "Loading..."
) : (
  <>
    <Widget src={`${config.ownerId}/widget/AAVE.Header`} props={{ config }} />
    <Body>
      <Widget
        src={`${config.ownerId}/widget/AAVE.NetworkSwitcher`}
        props={{ config }}
      />
      <Widget
        src={`${config.ownerId}/widget/AAVE.TabSwitcher`}
        props={{ config }}
      />
      <Widget
        src={`${config.ownerId}/widget/AAVE.Card.YourSupplies`}
        props={{ config }}
      />
      <Widget
        src={`${config.ownerId}/widget/AAVE.Card.YourSupplies`}
        props={{ config, supply: true }}
      />
      <Widget
        src={`${config.ownerId}/widget/AAVE.Card.AssetsToSupply`}
        props={{ config }}
      />
      <Widget
        src={`${config.ownerId}/widget/AAVE.Card.AssetsToSupply`}
        props={{ config, supply: true }}
      />
    </Body>
    {getMarkets().then((r) => console.log(r.body)) && ""}
    {getUserDeposits("0xF7175dC7D7D42Cd41fD7d19f10adE1EA84D99D0C").then((r) =>
      console.log(r.body)
    ) && ""}
    {getUserBalances("0xF7175dC7D7D42Cd41fD7d19f10adE1EA84D99D0C", [
      "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    ]).then((r) => console.log(r.body)) && ""}
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
