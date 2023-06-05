// interface Market {
//   id: string,
//   underlyingAsset: string,
//   name: string,
//   symbol: string,
//   decimals: number,
// }
function getMarkets() {
  return asyncFetch(
    "https://inquisitive-fox-1c50a5.netlify.app/.netlify/functions/markets"
  );
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
function getUserDeposits(address) {
  return asyncFetch(
    `https://inquisitive-fox-1c50a5.netlify.app/.netlify/functions/deposits?address=${address}`
  );
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
  getMarkets,
  getUserDeposits,
});

return <div style={{ display: "none" }} />;
