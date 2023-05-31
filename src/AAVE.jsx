// App config
function getConfig(network) {
  switch (network) {
    case "mainnet":
      return {
        ownerId: "aave-v3.near",
        nodeUrl: "https://rpc.mainnet.near.org",
      };
    case "testnet":
      return {
        ownerId: "aave-v3.testnet",
        nodeUrl: "https://rpc.testnet.near.org",
      };
    default:
      throw Error(`Unconfigured environment '${network}'.`);
  }
}
const config = getConfig(context.networkId);

// App states
State.init({
  imports: null,
});

// Import functions to state.imports
function importFunctions(imports) {
  if (!state.imports) {
    State.update({
      imports,
    });
  }
}

// Define the modules you'd like to load here
const modules = [
  `${config.ownerId}/widget/Utils.Number`,
  `${config.ownerId}/widget/Utils.Date`,
];

// Imported functions
const { formatAmount, formatDateTime } = state.imports;

// Component body
const body = !state.imports ? (
  "Loading..."
) : (
  <div>
    <div>AAVE</div>
    <div>Time: {formatDateTime(Date.now())}</div>
    <div>Price: {formatAmount("1.001")}</div>
  </div>
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
