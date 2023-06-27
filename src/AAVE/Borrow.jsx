const CONTRACT_ABI = {
  wrappedTokenGatewayV3ABI:
    "https://raw.githubusercontent.com/corndao/aave-v3-bos-app/main/abi/WrappedTokenGatewayV3ABI.json",
  erc20Abi:
    "https://raw.githubusercontent.com/corndao/aave-v3-bos-app/main/abi/ERC20Permit.json",
  aavePoolV3ABI:
    "https://raw.githubusercontent.com/corndao/aave-v3-bos-app/main/abi/AAVEPoolV3.json",
};

const vwethABI = fetch(
  "https://gist.githubusercontent.com/danielwpz/21facb2ad9f8ccab27f9744e3f7889cb/raw/fbc45b76010d07561b513b5ae0bf54285b0b938d/vweth1.json"
);

const aavePoolV3ABI = fetch(CONTRACT_ABI.aavePoolV3ABI);
const wrappedTokenGatewayV3ABI = fetch(CONTRACT_ABI.wrappedTokenGatewayV3ABI);
const erc20Abi = fetch(CONTRACT_ABI.erc20Abi);
const wrappedTokenGatewayV3Address =
  "0xB5Ee21786D28c5Ba61661550879475976B707099";
const aavePoolV3Address = "0x794a61358D6845594F94dc1DB02A252b5b4814aD";

if (
  !aavePoolV3ABI.ok ||
  !wrappedTokenGatewayV3ABI.ok ||
  !erc20Abi.ok ||
  !vwethABI.ok
) {
  return "loading";
}

function borrowERC20(address, asset, amount) {
  const pool = new ethers.Contract(
    aavePoolV3Address,
    aavePoolV3ABI.body,
    Ethers.provider().getSigner()
  );

  return pool["borrow(address,uint256,uint256,uint16,address)"](
    asset,
    amount,
    2, // variable interest rate
    0,
    address
  );
}

function borrowETH(amount) {
  const wrappedTokenGateway = new ethers.Contract(
    wrappedTokenGatewayV3Address,
    wrappedTokenGatewayV3ABI.body,
    Ethers.provider().getSigner()
  );

  return wrappedTokenGateway.borrowETH(
    aavePoolV3Address,
    amount,
    2, // variable interest rate
    0
  );
}

function getNonce(tokenAddress, userAddress) {
  const token = new ethers.Contract(
    tokenAddress,
    erc20Abi.body,
    Ethers.provider().getSigner()
  );

  return token.nonces(userAddress).then((nonce) => nonce.toNumber());
}

/**
 *
 * @param {string} user user address
 * @param {string} reserve AAVE reserve address (token to supply)
 * @param {string} tokenName token name
 * @param {string} amount token amount in full decimals
 * @param {number} deadline unix timestamp in SECONDS
 * @returns raw signature string will could be used in supplyWithPermit
 */
function signERC20Approval(user, reserve, tokenName, amount, deadline) {
  const chainId = 42161;
  return getNonce(reserve, user).then((nonce) => {
    const typeData = {
      types: {
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" },
        ],
        Permit: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      },
      primaryType: "Permit",
      domain: {
        name: tokenName,
        version: "1",
        chainId,
        verifyingContract: reserve,
      },
      message: {
        owner: user,
        spender: aavePoolV3Address,
        value: amount,
        nonce,
        deadline,
      },
    };

    const dataToSign = JSON.stringify(typeData);

    return Ethers.provider().send("eth_signTypedData_v4", [user, dataToSign]);
  });
}

/**
 *
 * @param {*} rawSig signature from signERC20Approval
 * @param {string} address user address
 * @param {string} asset asset address (e.g. USDT)
 * @param {string} amount repay amount in full decimals
 * @param {number} deadline UNIX timestamp in SECONDS
 * @returns
 */
function repayERC20(rawSig, address, asset, amount, deadline) {
  const sig = ethers.utils.splitSignature(rawSig);
  const pool = new ethers.Contract(
    aavePoolV3Address,
    aavePoolV3ABI.body,
    Ethers.provider().getSigner()
  );

  return pool[
    "repayWithPermit(address,uint256,uint256,address,uint256,uint8,bytes32,bytes32)"
  ](
    asset,
    amount,
    2, // variable interest rate
    address,
    deadline,
    sig.v,
    sig.r,
    sig.s
  );
}

function repayETH(address, amount) {
  const wrappedTokenGateway = new ethers.Contract(
    wrappedTokenGatewayV3Address,
    wrappedTokenGatewayV3ABI.body,
    Ethers.provider().getSigner()
  );

  return wrappedTokenGateway.repayETH(
    aavePoolV3Address,
    amount,
    2, // variable interest rate
    address,
    {
      value: amount,
    }
  );
}

function approveDelegation(vwETHAddress) {
  const vToken = new ethers.Contract(
    vwETHAddress,
    vwethABI.body,
    Ethers.provider().getSigner()
  );
  const maxUint256 = ethers.BigNumber.from(
    "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
  );

  // TODO replace address
  return vToken.approveDelegation(wrappedTokenGatewayV3Address, maxUint256);
}

/**
 * @param {string} vwETHAddress
 * @param {string} userAddress
 * @returns {BigNumber}
 */
function borrowAllowance(vwETHAddress, userAddress) {
  const vToken = new ethers.Contract(
    vwETHAddress,
    vwethABI.body,
    Ethers.provider().getSigner()
  );

  // TODO replace address
  return vToken.borrowAllowance(userAddress, wrappedTokenGatewayV3Address);
}

// borrowERC20(
//   "0xF7175dC7D7D42Cd41fD7d19f10adE1EA84D99D0C",
//   "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
//   "100000000000000000"
// )
// .then(txn => {
//   console.log('borrow txn');
//   console.log(txn);
// });

// borrowETH("100000000000000")
// .then(txn => {
//   console.log('borrowETH txn');
//   console.log(txn);
// });

// signERC20Approval(
//   "0xF7175dC7D7D42Cd41fD7d19f10adE1EA84D99D0C",
//   "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
//   "Tether USD",
//   "100000",
//   1687759391
// )
// .then(rawSig => {
//   return repayERC20(
//     rawSig,
//     "0xF7175dC7D7D42Cd41fD7d19f10adE1EA84D99D0C",
//     "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
//     "100000",
//     1687759391
//   );
// })
// .then(txn => {
//   console.log('borrowETH txn');
//   console.log(txn);
// });

// repayETH(
//   "0xF7175dC7D7D42Cd41fD7d19f10adE1EA84D99D0C",
//   "100000000000000"
// )
// .then(txn => {
//   console.log('repayETH txn');
//   console.log(txn);
// });

// approveDelegation("0x0c84331e39d6658cd6e6b9ba04736cc4c4734351")
// .then(txn => {
//   console.log('approve delegation txn');
//   console.log(txn);
// });

// borrowAllowance("0x0c84331e39d6658cd6e6b9ba04736cc4c4734351", "0xF7175dC7D7D42Cd41fD7d19f10adE1EA84D99D0C")
// .then(allowance => {
//   console.log({ allowance });
// })

return (
  <div>
    <Web3Connect
      className="LidoStakeFormSubmitContainer"
      connectLabel="Connect with Web3"
    />
  </div>
);
