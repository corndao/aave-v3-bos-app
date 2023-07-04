const CONTRACT_ABI = {
  wrappedTokenGatewayV3ABI:
    "https://raw.githubusercontent.com/corndao/aave-v3-bos-app/main/abi/WrappedTokenGatewayV3ABI.json",
  erc20Abi:
    "https://raw.githubusercontent.com/corndao/aave-v3-bos-app/main/abi/ERC20Permit.json",
  aavePoolV3ABI:
    "https://raw.githubusercontent.com/corndao/aave-v3-bos-app/main/abi/AAVEPoolV3.json",
};

const aavePoolV3Address = "0x794a61358D6845594F94dc1DB02A252b5b4814aD";

const erc20Abi = fetch(CONTRACT_ABI.erc20Abi);
const aavePoolV3ABI = fetch(CONTRACT_ABI.aavePoolV3ABI);

if (!erc20Abi.ok || !aavePoolV3ABI.ok) {
  return "loading";
}

function approve(tokenAddress, amount) {
  const token = new ethers.Contract(
    tokenAddress,
    erc20Abi.body,
    Ethers.provider().getSigner()
  );

  return token["approve(address,uint256)"](aavePoolV3Address, amount);
}

function getAllowance(userAddress, tokenAddress) {
  const token = new ethers.Contract(
    tokenAddress,
    erc20Abi.body,
    Ethers.provider().getSigner()
  );

  return token.allowance(userAddress, aavePoolV3Address);
}

function depositFromApproval(userAddress, tokenAddress, amount) {
  const pool = new ethers.Contract(
    aavePoolV3Address,
    aavePoolV3ABI.body,
    Ethers.provider().getSigner()
  );

  return pool["supply(address,uint256,address,uint16)"](
    tokenAddress,
    amount,
    userAddress,
    0
  );
}

function repayFromApproval(userAddress, tokenAddress, amount) {
  const pool = new ethers.Contract(
    aavePoolV3Address,
    aavePoolV3ABI.body,
    Ethers.provider().getSigner()
  );

  return pool["repay(address,uint256,uint256,address)"](
    tokenAddress,
    amount,
    2, // variable interest rate
    userAddress
  );
}

// approve(
//   "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
//   "100000000000000000"
// )
// .then(txn => {
// });

// getAllowance(
//   "0xF7175dC7D7D42Cd41fD7d19f10adE1EA84D99D0C",
//   "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1"
// )
// .then(a => {
//   console.log('allowance', a.toString());
// });

// depositFromApproval(
//   "0xF7175dC7D7D42Cd41fD7d19f10adE1EA84D99D0C",
//   "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
//   "100000000000000000"
// );

// repayFropmApproval(
//   "0xF7175dC7D7D42Cd41fD7d19f10adE1EA84D99D0C",
//   "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
//   "100000000000000000"
// );

return (
  <div>
    <Web3Connect
      className="LidoStakeFormSubmitContainer"
      connectLabel="Connect with Web3"
    />
  </div>
);
