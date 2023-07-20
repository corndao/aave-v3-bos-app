const WalletBalanceProviderABI =
  "https://raw.githubusercontent.com/corndao/aave-v3-bos-app/main/abi/WalletBalanceProvider.json";

const abi = fetch(WalletBalanceProviderABI);

if (!abi.ok) {
  return "loading";
}

const balanceProviderAddress = {
  1: "0xC7be5307ba715ce89b152f3Df0658295b3dbA8E2",
  42161: "0xBc790382B3686abffE4be14A030A96aC6154023a",
  137: "0xBc790382B3686abffE4be14A030A96aC6154023a",
  1442: "0x0da6DCAd2bE4801b644AEE679e0AdE008bB4bc6b",
};

function batchBalanceOf(chainId, userAddress, tokenAddresses) {
  const balanceProvider = new ethers.Contract(
    balanceProviderAddress[chainId],
    abi.body,
    Ethers.provider().getSigner()
  );

  return balanceProvider.batchBalanceOf([userAddress], tokenAddresses);
}

batchBalanceOf(137, "0xF7175dC7D7D42Cd41fD7d19f10adE1EA84D99D0C", [
  "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
  "0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39",
  "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
]).then((balances) => {
  console.log(balances);
});

return (
  <div>
    <Web3Connect
      className="LidoStakeFormSubmitContainer"
      connectLabel="Connect with Web3"
    />
  </div>
);
