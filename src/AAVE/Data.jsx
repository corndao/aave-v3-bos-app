// interface Market {
//   id: string,
//   underlyingAsset: string,
//   name: string,
//   symbol: string,
//   decimals: number,
// }
// returns Market[]
function getMarkets() {
  return fetch("https://aave-api.pages.dev/markets");
}

/**
 * @param {string} account user address
 * @param {string[]} tokens list of token addresses
 */
// interface TokenBalance {
//   token: string,
//   balance: string,
//   decimals: number,
// }
// returns TokenBalance[]
function getUserBalances(account, tokens) {
  const url = `https://aave-api.pages.dev/balances?account=${account}&tokens=${tokens.join(
    "|"
  )}`;
  return fetch(url);
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
// returns UserDeposit[]
function getUserDeposits(address) {
  return fetch(`https://aave-api.pages.dev/deposits/${address}`);
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
  getUserBalances,
});

return <div style={{ display: "none" }} />;
