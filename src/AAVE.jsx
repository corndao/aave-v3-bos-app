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
  reserveData: null,
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
const { formatAmount, formatDateTime, getReservesData } = state.imports;

if (state.imports && !state.reserveData) {
  getReservesData().then((reserveData) => {
    console.log("update reserves", reserveData);
    State.update({ reserveData });
  });
}

// Component body
const body =
  !state.imports || !state.reserveData ? (
    "Loading..."
  ) : (
    <div>
      <div>AAVE</div>
      <div>Time: {formatDateTime(Date.now())}</div>
      <div>Price: {formatAmount("1.001")}</div>
      <div># of Reserves: {state.reserveData[0].length}</div>
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
