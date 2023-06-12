const wrappedTokenGatewayV3ABI = fetch(
  "https://gist.githubusercontent.com/danielwpz/7867f925ce705b7df93cc61f2b1c0807/raw/ec1b149453a9000cecad647450c267ef351b8ae2/gistfile1.txt"
);
const aavePoolV3ABI = fetch(
  "https://gist.githubusercontent.com/danielwpz/f5f95a9fdc87dbf38302322ee0fe3bc5/raw/0fa5e7145ba45595fd88a62f3e0592ae8c9fe389/AAVEPoolV3.json"
);
const erc20Abi = fetch(
  "https://gist.githubusercontent.com/danielwpz/40e8b7ed6ab2f1ba23dae5b0fade3ca3/raw/6a4b332d0992f160f851f533c0aad2c07f668357/ERC20Permit.json"
);

// TODO update
const chainId = 42161;
const wrappedTokenGatewayV3Address =
  "0xb5ee21786d28c5ba61661550879475976b707099";
const aavePoolV3Address = "0x794a61358D6845594F94dc1DB02A252b5b4814aD";

if (!wrappedTokenGatewayV3ABI.ok || !erc20Abi.ok || !aavePoolV3ABI.ok) {
  return "loading";
}

// -- supply native ETH

function depositETH(amount) {
  return Ethers.provider()
    .getSigner()
    .getAddress()
    .then((address) => {
      const wrappedTokenGateway = new ethers.Contract(
        wrappedTokenGatewayV3Address,
        wrappedTokenGatewayV3ABI.body,
        Ethers.provider().getSigner()
      );

      return wrappedTokenGateway.depositETH(aavePoolV3Address, address, 0, {
        value: amount,
      });
    });
}

/// -- supply ERC20 tokens

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
 * @param {string} user user address
 * @param {string} reserve AAVE reserve address (token to supply)
 * @param {string} amount token amount in full decimals
 * @param {number} deadline unix timestamp in SECONDS
 * @param {string} rawSig signature from signERC20Approval
 * @returns txn object
 */
function supplyWithPermit(user, reserve, amount, deadline, rawSig) {
  const sig = ethers.utils.splitSignature(rawSig);
  const pool = new ethers.Contract(
    aavePoolV3Address,
    aavePoolV3ABI.body,
    Ethers.provider().getSigner()
  );
  return pool[
    "supplyWithPermit(address,uint256,address,uint16,uint256,uint8,bytes32,bytes32)"
  ](reserve, amount, user, 0, deadline, sig.v, sig.r, sig.s);
}

/// -- withdraw ERC20 tokens

function withdraw(asset, amount) {
  return Ethers.provider()
    .getSigner()
    .getAddress()
    .then((address) => {
      const pool = new ethers.Contract(
        aavePoolV3Address,
        aavePoolV3ABI.body,
        Ethers.provider().getSigner()
      );

      return pool["withdraw(address,uint256,address)"](asset, amount, address);
    });
}

/// -- withdraw ETH
/// -- NOTE: need to approve aWETH token first

function withdrawETH(amount) {
  return Ethers.provider()
    .getSigner()
    .getAddress()
    .then((address) => {
      const wrappedTokenGateway = new ethers.Contract(
        wrappedTokenGatewayV3Address,
        wrappedTokenGatewayV3ABI.body,
        Ethers.provider().getSigner()
      );

      return wrappedTokenGateway.withdrawETH(
        aavePoolV3Address,
        amount,
        address
      );
    });
}

/// -- approve/allowance ERC20
/// -- needed for withdrawing ETH

function approveForGateway(tokenAddress, amount) {
  const token = new ethers.Contract(
    tokenAddress,
    erc20Abi.body,
    Ethers.provider().getSigner()
  );

  return token.approve(wrappedTokenGatewayV3Address, amount);
}

function allowanceForGateway(tokenAddress) {
  return Ethers.provider()
    .getSigner()
    .getAddress()
    .then((address) => {
      const token = new ethers.Contract(
        tokenAddress,
        erc20Abi.body,
        Ethers.provider().getSigner()
      );

      return token.allowance(address, wrappedTokenGatewayV3Address);
    });
}

// depositETH("1000000000000000")
//   .then(res => {
//     console.log('depositETH txn:');
//     console.log(res);
//   });

// signERC20Approval(
//   "0xf7175dc7d7d42cd41fd7d19f10ade1ea84d99d0c",
//   "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
//   "Tether USD",
//   "100000",
//   1686128715
// )
//   .then((rawSig) => {
//     return supplyWithPermit(
//       "0xf7175dc7d7d42cd41fd7d19f10ade1ea84d99d0c",
//       "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
//       "100000",
//       1686128715,
//       rawSig
//     );
//   })
//   .then((txn) => {
//     console.log("supply txn");
//     console.log(txn);
//   });

// withdraw(
//   "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
//   "100000"
// )
//   .then(txn => {
//     console.log("withdraw txn");
//     console.log(txn);
//   });

// withdrawETH("100000000000000")
//   .then(txn => {
//     console.log("withdraw ETH txn");
//     console.log(txn);
//   });

// approveForGateway(
//   "0xe50fa9b3c56ffb159cb0fca61f5c9d750e8128c8",
//   "12003454992880559"
// )
//   .then(txn => {
//     console.log("approve gateway txn");
//     console.log(txn);
//   });

// allowanceForGateway("0xe50fa9b3c56ffb159cb0fca61f5c9d750e8128c8")
//   .then(allowance => {
//     console.log('allowance', allowance.toString());
//   });

return (
  <div>
    <Web3Connect
      className="LidoStakeFormSubmitContainer"
      connectLabel="Connect with Web3"
    />
  </div>
);
