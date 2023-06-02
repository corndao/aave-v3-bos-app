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

function decodeResult(method, rawData) {
  console.log("decodeResult2", method);

  const dataProviderABi = fetch(
    "https://gist.githubusercontent.com/danielwpz/b8988ee623b3648f2c86e26b5d4532e4/raw/be9f9c1ede832b4088e4de82f35351b2ae664125/UiPoolDataProviderV3.json"
  );
  const dataProviderIface = new ethers.utils.Interface(dataProviderABi.body);

  const data = dataProviderIface.decodeFunctionResult(method, rawData);
  console.log(`decode ${method} result:`, data);
  return data;
}

if (state.imports && !state.reserveData) {
  getReservesData("home").then((data) => {
    console.log("home data", data.slice(0, 100));
    const reserveData = decodeResult("getReservesData", data);
    console.log("home reserves", reserveData);
    State.update({ reserveData });
  });
}

console.log("reserve data", state.reserveData);

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
