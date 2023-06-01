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

// Define the modules you'd like to import
const modules = [
  `${config.ownerId}/widget/Utils.Number`,
  `${config.ownerId}/widget/Utils.Date`,
  `${config.ownerId}/widget/Utils.Data`,
];
// Import functions
const { formatAmount, formatDateTime, getReservesData, getStakedBalance } =
  state.imports;

// Component body
const body = !state.imports ? (
  "Loading..."
) : (
  <div>
    <div>AAVE</div>
    <div>Time: {formatDateTime(Date.now())}</div>
    <div>Price: {formatAmount("1.001")}</div>
    <div>{getReservesData()}</div>
    <div>{getStakedBalance("0xae7ab96520de3a18e5e111b5eaab095312d7fe84")}</div>
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
