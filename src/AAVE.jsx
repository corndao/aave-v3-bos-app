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
  data: `${config.ownerId}/widget/Data`,
};
// Import functions
const { formatAmount } = state.imports.number;
const { formatDateTime } = state.imports.date;
const { getMarkets, getUserDeposits } = state.imports.data;

// Component body
const body = loading ? (
  "Loading..."
) : (
  <div>
    <div>AAVE</div>
    <div>Time: {formatDateTime(Date.now())}</div>
    <div>Price: {formatAmount("1.001")}</div>
    {getMarkets().then((r) => console.log(r.body)) && ""}
    {getUserDeposits("0xF7175dC7D7D42Cd41fD7d19f10adE1EA84D99D0C").then((r) =>
      console.log(r.body)
    ) && ""}
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
