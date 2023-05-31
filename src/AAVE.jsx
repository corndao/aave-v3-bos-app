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

State.init({
  imports: null,
});

// Import functions to state.imports
function onLoad(imports) {
  if (!state.imports) {
    State.update({
      imports,
    });
  }
}

// Imported functions
const { formatAmount } = state.imports;

// Component body
const body = !state.imports ? (
  "Loading"
) : (
  <div>
    <div>AAVE</div>
    <div>Price: {formatAmount("1.001")}</div>
  </div>
);

return (
  <div>
    {/* Component Head */}
    <Widget src={`${config.ownerId}/widget/Utils.Number`} props={{ onLoad }} />
    {/* Component Body */}
    {body}
  </div>
);
