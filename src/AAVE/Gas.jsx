const gasLimitRecommendations = {
  default: {
    limit: "210000",
    recommended: "210000",
  },
  approval: {
    limit: "65000",
    recommended: "65000",
  },
  creditDelegationApproval: {
    limit: "55000",
    recommended: "55000",
  },
  supply: {
    limit: "300000",
    recommended: "300000",
  },
  deposit: {
    limit: "300000",
    recommended: "300000",
  },
  borrow: {
    limit: "400000",
    recommended: "400000",
  },
  withdraw: {
    limit: "230000",
    recommended: "300000",
  },
  liquidationCall: {
    limit: "700000",
    recommended: "700000",
  },
  liquidationFlash: {
    limit: "995000",
    recommended: "995000",
  },
  repay: {
    limit: "300000",
    recommended: "300000",
  },
  borrowETH: {
    limit: "450000",
    recommended: "450000",
  },
  withdrawETH: {
    limit: "640000",
    recommended: "640000",
  },
  swapCollateral: {
    limit: "1000000",
    recommended: "1000000",
  },
  repayCollateral: {
    limit: "700000",
    recommended: "700000",
  },
  migrateV3: {
    limit: "700000",
    recommended: "700000",
  },
  supplyWithPermit: {
    limit: "350000",
    recommended: "350000",
  },
  repayWithPermit: {
    limit: "350000",
    recommended: "350000",
  },
  vote: {
    limit: "125000",
    recommended: "125000",
  },
  stake: {
    limit: "395000",
    recommended: "395000",
  },
  claimRewards: {
    limit: "275000",
    recommended: "275000",
  },
  setUsageAsCollateral: {
    limit: "138000",
    recommended: "138000",
  },
};

function getGasPrice() {
  return Ethers.provider().getGasPrice();
}

function gasEstimation(action) {
  return getGasPrice().then((gasPrice) => {
    const gasLimit = gasLimitRecommendations[action].limit;
    return gasPrice.mul(gasLimit);
  });
}

function depositETHGas() {
  return gasEstimation("deposit");
}

function depositERC20Gas() {
  return gasEstimation("supplyWithPermit");
}

function withdrawETHGas() {
  return gasEstimation("withdrawETH");
}

function withdrawERC20Gas() {
  return gasEstimation("withdraw");
}

function borrowETHGas() {
  return gasEstimation("borrowETH");
}

function borrowERC20Gas() {
  return gasEstimation("borrow");
}

function repayETHGas() {
  return gasEstimation("repay");
}

function repayERC20Gas() {
  return gasEstimation("repayWithPermit");
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
  depositETHGas,
  depositERC20Gas,
  withdrawETHGas,
  withdrawERC20Gas,
  borrowETHGas,
  borrowERC20Gas,
  repayETHGas,
  repayERC20Gas,
});

return <div style={{ display: "none" }} />;
