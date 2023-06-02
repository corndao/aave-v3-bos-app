const dataProviderAddress = "0x91c0eA31b49B69Ea18607702c5d9aC360bf3dE7d";

const dataProviderABi = fetch(
  "https://gist.githubusercontent.com/danielwpz/b8988ee623b3648f2c86e26b5d4532e4/raw/be9f9c1ede832b4088e4de82f35351b2ae664125/UiPoolDataProviderV3.json"
);
if (!dataProviderABi || !dataProviderABi.ok) {
  console.log("cannot fetch ABI");
  return "loading";
}

const dataProviderIface = new ethers.utils.Interface(dataProviderABi.body);
if (!dataProviderIface) {
  console.log("cannot get interface");
  return "loading";
}

function getReservesData() {
  const encodedData = dataProviderIface.encodeFunctionData("getReservesData", [
    "0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e",
  ]);

  return Ethers.provider()
    .call({
      to: dataProviderAddress,
      data: encodedData,
    })
    .then((rawData) => {
      const reserves = dataProviderIface.decodeFunctionResult(
        "getReservesData",
        rawData
      );

      console.log("getReservesData result:", reserves);

      return reserves;
    });
}

// --- End of functions definition ---

// Load functions through `onLoad` callback
function exportFunctions(functions) {
  const { onLoad } = props;
  if (onLoad && typeof onLoad === "function") {
    onLoad(functions);
  }
}

// Export functions
exportFunctions({
  getReservesData,
  // decodeResult,
});

return <div style={{ display: "none" }} />;
