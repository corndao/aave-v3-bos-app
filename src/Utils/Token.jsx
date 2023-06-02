// TODO self-host the abi
const erc20Abi = fetch(
  "https://gist.githubusercontent.com/veox/8800debbf56e24718f9f483e1e40c35c/raw/f853187315486225002ba56e5283c1dba0556e6f/erc20.abi.json"
);

if (!erc20Abi.ok) {
  console.log("loading abi");
  return "loading";
}

const erc20Iface = new ethers.utils.Interface(erc20Abi.body);

const erc20BalanceOf = (tokenAddress, account) => {
  const encodedData = erc20Iface.encodeFunctionData("balanceOf", [account]);

  return Ethers.provider()
    .call({
      to: tokenAddress,
      data: encodedData,
    })
    .then((rawData) => {
      const data = erc20Iface.decodeFunctionResult("balanceOf", rawData);

      return data;
    });
};

erc20BalanceOf(
  "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  "0xDFd5293D8e347dFe59E90eFd55b2956a1343963d"
).then((data) => {
  console.log("balanceOf:");
  console.log(data.toString());
});

return (
  <div>
    <Web3Connect
      className="LidoStakeFormSubmitContainer"
      connectLabel="Connect with Web3"
    />
  </div>
);
