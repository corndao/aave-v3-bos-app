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
};
// Import functions
const { formatAmount } = state.imports.number;
const { formatDateTime } = state.imports.date;

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
    <Widget
      src={`${config.ownerId}/widget/Components.Header`}
      props={{ config }}
    />
    <Body>
      <Widget
        src={`${config.ownerId}/widget/Components.NetworkSwitcher`}
        props={{ config }}
      />
      <Widget
        src={`${config.ownerId}/widget/Components.TabSwitcher`}
        props={{ config }}
      />
      <Widget
        src={`${config.ownerId}/widget/Components.Card.YourSupplies`}
        props={{ config }}
      />
      <Widget
        src={`${config.ownerId}/widget/Components.Card.YourSupplies`}
        props={{ config, supply: true }}
      />
      <Widget
        src={`${config.ownerId}/widget/Components.Card.AssetsToSupply`}
        props={{ config }}
      />
      <Widget
        src={`${config.ownerId}/widget/Components.Card.AssetsToSupply`}
        props={{ config, supply: true }}
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
