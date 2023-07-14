const ROUND_DOWN = 0;
const CONTRACT_ABI = {
  wrappedTokenGatewayV3ABI:
    "https://raw.githubusercontent.com/corndao/aave-v3-bos-app/main/abi/WrappedTokenGatewayV3ABI.json",
  erc20Abi:
    "https://raw.githubusercontent.com/corndao/aave-v3-bos-app/main/abi/ERC20Permit.json",
  aavePoolV3ABI:
    "https://raw.githubusercontent.com/corndao/aave-v3-bos-app/main/abi/AAVEPoolV3.json",
  variableDebtTokenABI:
    "https://raw.githubusercontent.com/corndao/aave-v3-bos-app/main/abi/VariableDebtToken.json",
};
const DEFAULT_CHAIN_ID = 1442;
const ETH_TOKEN = { name: "Ethereum", symbol: "ETH", decimals: 18 };
const MATIC_TOKEN = { name: "Matic", symbol: "MATIC", decimals: 18 };
const ACTUAL_BORROW_AMOUNT_RATE = 0.99;

// Get AAVE network config by chain id
function getNetworkConfig(chainId) {
  const abis = {
    wrappedTokenGatewayV3ABI: fetch(CONTRACT_ABI.wrappedTokenGatewayV3ABI),
    erc20Abi: fetch(CONTRACT_ABI.erc20Abi),
    aavePoolV3ABI: fetch(CONTRACT_ABI.aavePoolV3ABI),
    variableDebtTokenABI: fetch(CONTRACT_ABI.variableDebtTokenABI),
  };

  const constants = {
    FIXED_LIQUIDATION_VALUE: "1.0",
    MAX_UINT_256:
      "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
  };

  switch (chainId) {
    case 1: // ethereum mainnet
      return {
        chainName: "Ethereum Mainnet",
        nativeCurrency: ETH_TOKEN,
        rpcUrl: "https://rpc.ankr.com/eth",
        aavePoolV3Address: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
        wrappedTokenGatewayV3Address:
          "0xD322A49006FC828F9B5B37Ab215F99B4E5caB19C",
        borrowBlackListToken: ["AAVE"],
        ...abis,
        ...constants,
      };
    case 42161: // arbitrum one
      return {
        chainName: "Arbitrum Mainnet",
        nativeCurrency: ETH_TOKEN,
        rpcUrl: "https://arb1.arbitrum.io/rpc",
        aavePoolV3Address: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
        wrappedTokenGatewayV3Address:
          "0xB5Ee21786D28c5Ba61661550879475976B707099",
        borrowBlackListToken: ["AAVE"],
        ...abis,
        ...constants,
      };
    case 137: // polygon mainnet
      return {
        chainName: "Polygon Mainnet",
        nativeCurrency: MATIC_TOKEN,
        rpcUrl: "https://rpc.ankr.com/polygon",
        aavePoolV3Address: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
        wrappedTokenGatewayV3Address:
          "0x1e4b7A6b903680eab0c5dAbcb8fD429cD2a9598c",
        borrowBlackListToken: ["AAVE"],
        ...abis,
        ...constants,
      };
    case 1442: // zkevm testnet
      return {
        chainName: "Polygon zkEVM Testnet",
        nativeCurrency: ETH_TOKEN,
        rpcUrl: "https://rpc.public.zkevm-test.net",
        aavePoolV3Address: "0x4412c92f6579D9FC542D108382c8D1d6D2Be63d9",
        wrappedTokenGatewayV3Address:
          "0xD82940E16D25aB1349914e1C369eF1b287d457BF",
        borrowBlackListToken: ["AAVE"],
        ...abis,
        ...constants,
      };
    default:
      throw new Error("unknown chain id");
  }
}

function switchEthereumChain(chainId) {
  const chainIdHex = `0x${chainId.toString(16)}`;
  const res = Ethers.send("wallet_switchEthereumChain", [
    { chainId: chainIdHex },
  ]);
  // If `res` === `undefined`, it means switch chain failed, which is very weird but it works.
  // If `res` is `null` the function is either not called or executed successfully.
  if (res === undefined) {
    console.log(
      `Failed to switch chain to ${chainId}. Add the chain to wallet`
    );
    const config = getNetworkConfig(chainId);
    Ethers.send("wallet_addEthereumChain", [
      {
        chainId: chainIdHex,
        chainName: config.chainName,
        nativeCurrency: config.nativeCurrency,
        rpcUrls: [config.rpcUrl],
      },
    ]);
  }
}

if (
  state.chainId === undefined &&
  ethers !== undefined &&
  Ethers.send("eth_requestAccounts", [])[0]
) {
  Ethers.provider()
    .getNetwork()
    .then((data) => {
      const chainId = data?.chainId;
      State.update({ chainId });
    });
}

function isValid(a) {
  if (!a) return false;
  if (isNaN(Number(a))) return false;
  if (a === "") return false;
  return true;
}

const GAS_LIMIT_RECOMMENDATIONS = {
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
  const assetsToSupply = state.assetsToSupply;
  if (!assetsToSupply) {
    return "-";
  }
  const ethAsset = assetsToSupply.find((asset) => asset.symbol === "ETH");
  if (!ethAsset) {
    return "-";
  }
  const { marketReferencePriceInUsd: ethPrice, decimals: ethDecimals } =
    ethAsset;
  return getGasPrice().then((gasPrice) => {
    const gasLimit = GAS_LIMIT_RECOMMENDATIONS[action].limit;
    return Big(gasPrice.toString())
      .mul(gasLimit)
      .div(Big(10).pow(ethDecimals))
      .mul(ethPrice)
      .toFixed(2);
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

// interface Market {
//   id: string,
//   underlyingAsset: string,
//   name: string,
//   symbol: string,
//   decimals: number,
//   supplyAPY: string;
//   marketReferencePriceInUsd: string;
//   usageAsCollateralEnabled: boolean;
//   aTokenAddress: string;
//   variableBorrowAPY: string;
// }
// returns Market[]
function getMarkets(chainId) {
  return asyncFetch(
    `https://aave-data-service-7a85eea3aebe.herokuapp.com/${chainId}/markets`
  );
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
function getUserBalances(chainId, account, tokens) {
  const url = `https://aave-data-service-7a85eea3aebe.herokuapp.com/${chainId}/balances?account=${account}&tokens=${tokens.join(
    "|"
  )}`;
  return asyncFetch(url);
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
function getUserDeposits(chainId, address) {
  return asyncFetch(
    `https://aave-data-service-7a85eea3aebe.herokuapp.com/${chainId}/deposits/${address}`
  );
}

// interface UserDebtSummary {
//   healthFactor: string,
//   netWorthUSD: string,
//   availableBorrowsUSD: string,
//   debts: UserDebt[],
// }
// interface UserDebt {
//   underlyingAsset: string;
//   name: string;
//   symbol: string;
//   usageAsCollateralEnabledOnUser: boolean,
//   scaledVariableDebt: string,
//   variableBorrows: string,
//   variableBorrowsUSD: string,
// }
// returns UserDebtSummary
function getUserDebts(chainId, address) {
  return asyncFetch(
    `https://aave-data-service-7a85eea3aebe.herokuapp.com/${chainId}/debts/${address}`
  );
}

// App config
function getConfig(network) {
  const chainId = state.chainId;
  switch (network) {
    case "mainnet":
      return {
        ownerId: "aave-v3.near",
        nodeUrl: "https://rpc.mainnet.near.org",
        ipfsPrefix: "https://ipfs.near.social/ipfs",
        ...(chainId ? getNetworkConfig(chainId) : {}),
      };
    case "testnet":
      return {
        ownerId: "aave-v3.testnet",
        nodeUrl: "https://rpc.testnet.near.org",
        ipfsPrefix: "https://ipfs.near.social/ipfs",
        ...(chainId ? getNetworkConfig(chainId) : {}),
      };
    default:
      throw Error(`Unconfigured environment '${network}'.`);
  }
}
const config = getConfig(context.networkId);

// App states
State.init({
  imports: {},
  chainId: undefined,
  showWithdrawModal: false,
  showSupplyModal: false,
  showRepayModal: false,
  showBorrowModal: false,
  walletConnected: false,
  assetsToSupply: undefined,
  yourSupplies: undefined,
  assetsToBorrow: undefined,
  yourBorrows: undefined,
  address: undefined,
  ethBalance: undefined,
  selectTab: "supply", // supply | borrow
  userBalances: undefined,
});

const loading =
  !state.assetsToSupply || !state.yourSupplies || !state.assetsToBorrow;

// Import functions to state.imports
function importFunctions(imports) {
  if (loading) {
    State.update({
      imports,
    });
  }
}

// Define the modules you'd like to import
const modules = {
  number: `${config.ownerId}/widget/Utils.Number`,
  date: `${config.ownerId}/widget/Utils.Date`,
  data: `${config.ownerId}/widget/AAVE.Data`,
};
// Import functions
// const { formatAmount } = state.imports.number;
// const { formatDateTime } = state.imports.date;

function checkProvider() {
  const provider = Ethers.provider();
  if (provider) {
    State.update({ walletConnected: true });
  } else {
    State.update({ walletConnected: false });
  }
}

function calculateAvailableBorrows({
  availableBorrowsUSD,
  marketReferencePriceInUsd,
}) {
  return isValid(availableBorrowsUSD) && isValid(marketReferencePriceInUsd)
    ? Big(availableBorrowsUSD).div(marketReferencePriceInUsd).toFixed()
    : Number(0).toFixed();
}

function bigMin(_a, _b) {
  const a = Big(_a);
  const b = Big(_b);
  return a.gt(b) ? b : a;
}

function formatHealthFactor(healthFactor) {
  if (healthFactor === "∞") return healthFactor;
  if (!healthFactor || !isValid(healthFactor)) return "-";
  if (Number(healthFactor) === -1) return "∞";
  return Big(healthFactor).toFixed(2, ROUND_DOWN);
}

function getUserBalancesBySequences(underlyingAssets) {
  const seqAmount = 5;
  let idx = 0;
  for (let i = 0; i < underlyingAssets.length; i += seqAmount) {
    const nowSeq = underlyingAssets.slice(i, i + seqAmount);
    if (state[`userBalances${idx}`]) {
      continue;
    }
    getUserBalances(state.chainId, state.address, nowSeq).then(
      (userBalancesResponse) => {
        const userBalances = JSON.parse(userBalancesResponse.body);
        State.update({
          [`userBalances${idx++}`]: userBalances,
        });
      }
    );
  }

  const totalSeqAmount = Math.ceil(underlyingAssets.length / seqAmount);
  const result = Array(totalSeqAmount)
    .fill(0)
    .map((_, idx) => `userBalances${idx}`)
    .map((key) => state[key])
    .filter((element) => !!element);

  if (result.length === totalSeqAmount) {
    State.update({
      userBalances: result.reduce((prev, cur) => [...prev, ...cur], []),
    });
  }
}

// update data in async manner
function updateData() {
  const provider = Ethers.provider();
  if (!provider) {
    return;
  }
  provider
    .getSigner()
    ?.getAddress()
    ?.then((address) => {
      State.update({ address });
    });
  provider
    .getSigner()
    ?.getBalance()
    .then((balance) => State.update({ ethBalance: balance }));
  if (!state.address || !state.ethBalance) {
    return;
  }

  getMarkets(state.chainId).then((marketsResponse) => {
    if (!marketsResponse) {
      return;
    }
    const markets = JSON.parse(marketsResponse.body);
    const marketsMapping = markets.reduce((prev, cur) => {
      prev[cur.underlyingAsset] = cur;
      return prev;
    }, {});

    // get user balances
    getUserBalancesBySequences(markets.map((market) => market.underlyingAsset));
    const userBalances = state.userBalances;
    if (userBalances.length !== markets.length) {
      return;
    }
    const userBalancesMap = userBalances.reduce((prev, cur) => {
      prev[cur.token] = cur;
    }, {});
    const assetsToSupply = markets
      .map((market, idx) => {
        if (!isValid(userBalancesMap[market.underlyingAsset].decimals)) {
          return;
        }
        const balanceRaw = Big(
          market.symbol === "WETH"
            ? state.ethBalance
            : userBalances[idx].balance
        ).div(Big(10).pow(userBalances[idx].decimals));
        const balance = balanceRaw.toFixed(
          userBalances[idx].decimals,
          ROUND_DOWN
        );
        const balanceInUSD = balanceRaw
          .mul(market.marketReferencePriceInUsd)
          .toFixed(3, ROUND_DOWN);
        return {
          ...userBalances[idx],
          ...market,
          balance,
          balanceInUSD,
          ...(market.symbol === "WETH"
            ? {
                symbol: "ETH",
                name: "Ethereum",
              }
            : {}),
        };
      })
      .filter((asset) => !!asset)
      .sort((asset1, asset2) => {
        const balanceInUSD1 = Number(asset1.balanceInUSD);
        const balanceInUSD2 = Number(asset2.balanceInUSD);
        if (balanceInUSD1 !== balanceInUSD2)
          return balanceInUSD2 - balanceInUSD1;
        return asset1.symbol.localeCompare(asset2.symbol);
      });

    State.update({
      assetsToSupply,
    });

    // get user borrow data
    updateUserDebts(marketsMapping, assetsToSupply);
  });

  // get user supplies
  updateUserSupplies(marketsMapping);
}

function updateUserSupplies(marketsMapping) {
  const prevYourSupplies = state.yourSupplies;
  getUserDeposits(state.chainId, state.address).then((userDepositsResponse) => {
    if (!userDepositsResponse) {
      return;
    }
    const userDeposits = JSON.parse(userDepositsResponse.body).filter(
      (row) => Number(row.underlyingBalance) !== 0
    );
    const yourSupplies = userDeposits.map((userDeposit) => {
      const market = marketsMapping[userDeposit.underlyingAsset];
      return {
        ...market,
        ...userDeposit,
        ...(market.symbol === "WETH"
          ? {
              symbol: "ETH",
              name: "Ethereum",
            }
          : {}),
      };
    });

    State.update({
      yourSupplies,
    });

    if (JSON.stringify(prevYourSupplies) === JSON.stringify(yourSupplies)) {
      console.log("refresh supplies again ...", prevYourSupplies, yourSupplies);
      setTimeout(updateData, 500);
    }
  });
}

function updateUserDebts(marketsMapping, assetsToSupply) {
  if (!marketsMapping || !assetsToSupply) {
    return;
  }

  const prevYourBorrows = state.yourBorrows;
  // userDebts depends on the balance from assetsToSupply
  const assetsToSupplyMap = assetsToSupply.reduce((prev, cur) => {
    prev[cur.token] = cur;
    return prev;
  }, {});

  getUserDebts(state.chainId, state.address).then((userDebtsResponse) => {
    if (!userDebtsResponse) {
      return;
    }
    const userDebts = JSON.parse(userDebtsResponse.body);
    const assetsToBorrow = {
      ...userDebts,
      healthFactor: formatHealthFactor(userDebts.healthFactor),
      debts: userDebts.debts
        .map((userDebt) => {
          const market = marketsMapping[userDebt.underlyingAsset];
          if (!market) {
            throw new Error("Fatal error: Market not found");
          }
          const { availableLiquidityUSD } = market;
          const availableBorrowsUSD = bigMin(
            userDebts.availableBorrowsUSD,
            availableLiquidityUSD
          )
            .times(ACTUAL_BORROW_AMOUNT_RATE)
            .toFixed();
          const symbol = userDebt.symbol === "WETH" ? "ETH" : userDebt.symbol;
          return {
            ...market,
            ...userDebt,
            ...(market.symbol === "WETH"
              ? {
                  symbol: "ETH",
                  name: "Ethereum",
                }
              : {}),
            availableBorrows: calculateAvailableBorrows({
              availableBorrowsUSD,
              marketReferencePriceInUsd: market.marketReferencePriceInUsd,
            }),
            availableBorrowsUSD,
            balance: assetsToSupplyMap[userDebt.underlyingAsset].balance,
            balanceInUSD:
              assetsToSupplyMap[userDebt.underlyingAsset].balanceInUSD,
          };
        })
        .sort((asset1, asset2) => {
          const availableBorrowsUSD1 = Number(asset1.availableBorrowsUSD);
          const availableBorrowsUSD2 = Number(asset2.availableBorrowsUSD);
          if (availableBorrowsUSD1 !== availableBorrowsUSD2)
            return availableBorrowsUSD2 - availableBorrowsUSD1;
          return asset1.symbol.localeCompare(asset2.symbol);
        })
        .filter(
          (asset) =>
            !config.borrowBlackListToken ||
            !config.borrowBlackListToken.includes(asset.symbol)
        ),
    };
    const yourBorrows = {
      ...assetsToBorrow,
      debts: assetsToBorrow.debts.filter(
        (row) =>
          !isNaN(Number(row.variableBorrowsUSD)) &&
          Number(row.variableBorrowsUSD) > 0
      ),
    };

    State.update({
      yourBorrows,
      assetsToBorrow,
    });

    if (JSON.stringify(prevYourBorrows) === JSON.stringify(yourBorrows)) {
      console.log("refresh borrows again ...", prevYourBorrows, yourBorrows);
      setTimeout(updateData, 500);
    }
  });
}

function onActionSuccess({ msg, callback }) {
  // update data if action finishes
  updateData();
  // update UI after data has almost loaded
  setTimeout(() => {
    if (callback) {
      callback();
    }
    if (msg) {
      State.update({ alertModalText: msg });
    }
  }, 5000);
}

checkProvider();
if (state.walletConnected && state.chainId && loading) {
  updateData();
}

const Body = styled.div`
  padding: 24px 15px;
  background: #0e0e26;
  min-height: 100vh;
  color: white;
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
// Component body
const body = loading ? (
  <>
    <Widget src={`${config.ownerId}/widget/AAVE.Header`} props={{ config }} />
    <Body>
      {state.walletConnected ? "Loading..." : "Need to connect wallet first."}
    </Body>
  </>
) : (
  <>
    <Widget src={`${config.ownerId}/widget/AAVE.Header`} props={{ config }} />
    <Body>
      <FlexContainer>
        <Widget
          src={`${config.ownerId}/widget/AAVE.NetworkSwitcher`}
          props={{
            chainId: state.chainId,
            config,
            switchNetwork: (chainId) => {
              switchEthereumChain(chainId);
            },
          }}
        />
        <Widget
          src={`${config.ownerId}/widget/AAVE.HeroData`}
          props={{
            config,
            netWorth: `$ ${
              state.assetsToBorrow?.netWorthUSD
                ? Big(state.assetsToBorrow.netWorthUSD).toFixed(2)
                : "-"
            }`,
            netApy: `${
              state.assetsToBorrow?.netAPY
                ? Number(
                    Big(state.assetsToBorrow.netAPY).times(100).toFixed(2)
                  ) === 0
                  ? "0.00"
                  : Big(state.assetsToBorrow.netAPY).times(100).toFixed(2)
                : "-"
            }%`,
            healthFactor: formatHealthFactor(state.assetsToBorrow.healthFactor),
            showHealthFactor:
              state.yourBorrows &&
              state.yourBorrows.debts &&
              state.yourBorrows.debts.length > 0,
          }}
        />
      </FlexContainer>
      <Widget
        src={`${config.ownerId}/widget/AAVE.TabSwitcher`}
        props={{
          config,
          select: state.selectTab,
          setSelect: (tabName) => State.update({ selectTab: tabName }),
        }}
      />
      {state.selectTab === "supply" && (
        <>
          <Widget
            src={`${config.ownerId}/widget/AAVE.Card.YourSupplies`}
            props={{
              config,
              chainId: state.chainId,
              yourSupplies: state.yourSupplies,
              showWithdrawModal: state.showWithdrawModal,
              setShowWithdrawModal: (isShow) =>
                State.update({ showWithdrawModal: isShow }),
              onActionSuccess,
              healthFactor: formatHealthFactor(
                state.assetsToBorrow.healthFactor
              ),
              formatHealthFactor,
              withdrawETHGas,
              withdrawERC20Gas,
            }}
          />
          <Widget
            src={`${config.ownerId}/widget/AAVE.Card.AssetsToSupply`}
            props={{
              config,
              chainId: state.chainId,
              assetsToSupply: state.assetsToSupply,
              showSupplyModal: state.showSupplyModal,
              setShowSupplyModal: (isShow) =>
                State.update({ showSupplyModal: isShow }),
              onActionSuccess,
              healthFactor: formatHealthFactor(
                state.assetsToBorrow.healthFactor
              ),
              formatHealthFactor,
              depositETHGas,
              depositERC20Gas,
            }}
          />
        </>
      )}
      {state.selectTab === "borrow" && (
        <>
          <Widget
            src={`${config.ownerId}/widget/AAVE.Card.YourBorrows`}
            props={{
              config,
              chainId: state.chainId,
              yourBorrows: state.yourBorrows,
              showRepayModal: state.showRepayModal,
              setShowRepayModal: (isShow) =>
                State.update({ showRepayModal: isShow }),
              showBorrowModal: state.showBorrowModal,
              setShowBorrowModal: (isShow) =>
                State.update({ showBorrowModal: isShow }),
              formatHealthFactor,
              onActionSuccess,
              repayETHGas,
              repayERC20Gas,
              borrowETHGas,
              borrowERC20Gas,
            }}
          />
          <Widget
            src={`${config.ownerId}/widget/AAVE.Card.AssetsToBorrow`}
            props={{
              config,
              chainId: state.chainId,
              assetsToBorrow: state.assetsToBorrow,
              showBorrowModal: state.showBorrowModal,
              yourSupplies: state.yourSupplies,
              setShowBorrowModal: (isShow) =>
                State.update({ showBorrowModal: isShow }),
              formatHealthFactor,
              onActionSuccess,
              borrowETHGas,
              borrowERC20Gas,
            }}
          />
        </>
      )}
      {state.alertModalText && (
        <Widget
          src={`${config.ownerId}/widget/AAVE.Modal.AlertModal`}
          props={{
            config,
            title: "All done!",
            description: state.alertModalText,
            onRequestClose: () => State.update({ alertModalText: false }),
          }}
        />
      )}
    </Body>
  </>
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
