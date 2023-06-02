/**
 * AAVE V3 Data service
 */

// TODO configurable
const dataProviderAddress = "0x91c0eA31b49B69Ea18607702c5d9aC360bf3dE7d";
const incentivesProviderAddress = "0x162A7AC02f547ad796CA549f757e2b8d1D9b10a6";

// TODO self-host the abi
const dataProviderABi = fetch(
  "https://gist.githubusercontent.com/danielwpz/b8988ee623b3648f2c86e26b5d4532e4/raw/be9f9c1ede832b4088e4de82f35351b2ae664125/UiPoolDataProviderV3.json"
);
const incentivesProviderABI = fetch(
  "https://gist.githubusercontent.com/danielwpz/da80f2fa26a353d007099403d48af287/raw/683cd7d0b7d672595a414b5de20c3e4d16e1b97a/UiIncentiveDataProviderV3.json"
);

if (!dataProviderABi.ok || !incentivesProviderABI.ok) {
  console.log("loading ABI");
  return "loading";
}

const dataProviderIface = new ethers.utils.Interface(dataProviderABi.body);
const incentivesProviderIface = new ethers.utils.Interface(
  incentivesProviderABI.body
);

const pow = (a, b) => {
  let r = a;
  for (let i = 1; i < b; i++) {
    r = r * a;
  }

  return r;
};

// struct AggregatedReserveData {
//   address underlyingAsset;
//   string name;
//   string symbol;
//   uint256 decimals;
//   uint256 baseLTVasCollateral;
//   uint256 reserveLiquidationThreshold;
//   uint256 reserveLiquidationBonus;
//   uint256 reserveFactor;
//   bool usageAsCollateralEnabled;
//   bool borrowingEnabled;
//   bool stableBorrowRateEnabled;
//   bool isActive;
//   bool isFrozen;
//   // base data
//   uint128 liquidityIndex;
//   uint128 variableBorrowIndex;
//   uint128 liquidityRate;
//   uint128 variableBorrowRate;
//   uint128 stableBorrowRate;
//   uint40 lastUpdateTimestamp;
//   address aTokenAddress;
//   address stableDebtTokenAddress;
//   address variableDebtTokenAddress;
//   address interestRateStrategyAddress;
//   //
//   uint256 availableLiquidity;
//   uint256 totalPrincipalStableDebt;
//   uint256 averageStableRate;
//   uint256 stableDebtLastUpdateTimestamp;
//   uint256 totalScaledVariableDebt;
//   uint256 priceInMarketReferenceCurrency;
//   address priceOracle;
//   uint256 variableRateSlope1;
//   uint256 variableRateSlope2;
//   uint256 stableRateSlope1;
//   uint256 stableRateSlope2;
//   uint256 baseStableBorrowRate;
//   uint256 baseVariableBorrowRate;
//   uint256 optimalUsageRatio;
//   // v3
//   bool isPaused;
//   bool isSiloedBorrowing;
//   uint128 accruedToTreasury;
//   uint128 unbacked;
//   uint128 isolationModeTotalDebt;
//   bool flashLoanEnabled;
//   //
//   uint256 debtCeiling;
//   uint256 debtCeilingDecimals;
//   uint8 eModeCategoryId;
//   uint256 borrowCap;
//   uint256 supplyCap;
//   // eMode
//   uint16 eModeLtv;
//   uint16 eModeLiquidationThreshold;
//   uint16 eModeLiquidationBonus;
//   address eModePriceSource;
//   string eModeLabel;
//   bool borrowableInIsolation;
// }
const parseReserveData = (data) => {
  const underlyingAsset = data[0];
  const name = data[1];
  const symbol = data[2];
  const decimals = data[3].toString();

  const liquidityRateBN = data[15];
  const liquidityRate = liquidityRateBN.toString();

  // supply apy
  // NOTE: raw number, mul 100 to get percentage
  const hoursPerYear = 8766;
  const ray = 1e27;
  const supplyAPY =
    pow(
      parseInt(liquidityRateBN.toString()) / ray / hoursPerYear + 1,
      hoursPerYear
    ) - 1;

  const availableLiquidity = data[23].toString();
  const totalPrincipalStableDebt = data[24].toString();
  const totalScaledVariableDebt = data[27].toString();

  return {
    underlyingAsset,
    name,
    symbol,
    decimals,
    liquidityRate,
    availableLiquidity,
    totalPrincipalStableDebt,
    totalScaledVariableDebt,
    supplyAPY,
  };
};

const getReservesData = () => {
  // TODO configurable
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

      console.log("getReservesData result:");
      console.log(reserves);

      const [reservesData, baseCurrencyInfo] = reserves;
      reservesData.forEach(parseReserveData);

      return {
        reservesData: reservesData.map(parseReserveData),
        baseCurrencyInfo,
      };
    });
};

// struct AggregatedReserveIncentiveData {
//   address underlyingAsset;
//   IncentiveData aIncentiveData;
//   IncentiveData vIncentiveData;
//   IncentiveData sIncentiveData;
// }

// struct IncentiveData {
//   address tokenAddress;
//   address incentiveControllerAddress;
//   RewardInfo[] rewardsTokenInformation;
// }

// struct RewardInfo {
//   string rewardTokenSymbol;
//   address rewardTokenAddress;
//   address rewardOracleAddress;
//   uint256 emissionPerSecond;
//   uint256 incentivesLastUpdateTimestamp;
//   uint256 tokenIncentivesIndex;
//   uint256 emissionEndTimestamp;
//   int256 rewardPriceFeed;
//   uint8 rewardTokenDecimals;
//   uint8 precision;
//   uint8 priceFeedDecimals;
// }
//
// rawData is AggregatedReserveIncentiveData
const parseIncentivesData = (rawData) => {
  const parseRewardsTokenInfo = (data) => {
    const rewardTokenSymbol = data[0];
    const rewardTokenAddress = data[1];
    const emissionPerSecond = data[3];
    const rewardTokenDecimals = data[8];

    return {
      rewardTokenSymbol,
      rewardTokenAddress,
      emissionPerSecond,
      rewardTokenDecimals,
    };
  };

  const parseIncentiveData = (data) => {
    const tokenAddress = data[0];
    const incentiveControllerAddress = data[1];
    const rewardsTokenInformation = data[2].map(parseRewardsTokenInfo);

    return {
      tokenAddress,
      incentiveControllerAddress,
      rewardsTokenInformation,
    };
  };

  const underlyingAsset = rawData[0];
  const aIncentiveData = parseIncentiveData(rawData[1]);

  return {
    underlyingAsset,
    aIncentiveData,
  };
};

const getIncentivesData = () => {
  const encodedData = incentivesProviderIface.encodeFunctionData(
    "getReservesIncentivesData",
    ["0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e"]
  );

  return Ethers.provider()
    .call({
      to: incentivesProviderAddress,
      data: encodedData,
    })
    .then((rawData) => {
      const data = incentivesProviderIface.decodeFunctionResult(
        "getReservesIncentivesData",
        rawData
      );

      console.log("getIncentivesData result:");
      console.log(data);

      return data[0].map(parseIncentivesData);
    });
};

getReservesData().then((data) => {
  const { reservesData } = data;
  for (let i = 0; i < reservesData.length; i++) {
    console.log(reservesData[i]);
  }
});
// getIncentivesData()
//   .then(data => {
//     console.log('parsed data');
//     console.log(data);
//   })

return (
  <div>
    <Web3Connect
      className="LidoStakeFormSubmitContainer"
      connectLabel="Connect with Web3"
    />
  </div>
);
