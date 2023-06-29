const { config, data, onRequestClose, onActionSuccess, chainId } = props;

if (!data) {
  return;
}

const ROUND_DOWN = 0;
function isValid(a) {
  if (!a) return false;
  if (isNaN(Number(a))) return false;
  if (a === "") return false;
  return true;
}

const {
  symbol,
  marketReferencePriceInUsd,
  healthFactor,
  availableBorrows,
  availableBorrowsUSD,
  decimals,
  underlyingAsset,
  variableBorrows,
  name: tokenName,
} = data;

const RepayContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const TokenTexture = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: white;
`;

const TokenWrapper = styled.div`
  display: flex;
  img {
    margin-right: 4px;
  }
`;

const GrayTexture = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #7c7c86;
`;

const PurpleTexture = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #8a8db9;
`;

const GreenTexture = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #2cffa7;
`;

const RedTexture = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: red;
`;

const WhiteTexture = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: white;
`;
const TransactionOverviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Input = styled.input`
  background: transparent;
  border: none;
  outline: none;

  font-size: 20px;
  font-weight: bold;
  color: white;
  flex: 1;
  width: 160px;

  &[type="number"]::-webkit-outer-spin-button,
  &[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &[type="number"] {
    -moz-appearance: textfield;
  }
`;

const Max = styled.span`
  color: #8247e5;
  cursor: pointer;
`;

State.init({
  amount: "",
  amountInUSD: "0.00",
  loading: false,
  newHealthFactor: "-",
});

const maxValue = variableBorrows;

/**
 *
 * @param {string} chainId
 * @param {string} address user address
 * @param {string} asset asset address
 * @param {string} action 'deposit' | 'withdraw' | 'borrow' | 'repay'
 * @param {string} amount amount in USD with 2 fixed decimals
 * @returns
 */
function getNewHealthFactor(chainId, address, asset, action, amount) {
  const url = `https://aave-api.pages.dev/${chainId}/health/${address}`;
  return asyncFetch(`${url}?asset=${asset}&action=${action}&amount=${amount}`);
}

const changeValue = (value) => {
  let amountInUSD = "0.00";
  if (Number(value) > Number(maxValue)) {
    value = maxValue;
  }
  if (Number(value) < 0) {
    value = "0";
  }
  if (isValid(value)) {
    amountInUSD = Big(value)
      .mul(marketReferencePriceInUsd)
      .toFixed(2, ROUND_DOWN);
  }
  State.update({ amount: value, amountInUSD, newHealthFactor: "-" });

  Ethers.provider()
    .getSigner()
    .getAddress()
    .then((address) => {
      getNewHealthFactor(
        chainId,
        address,
        data.underlyingAsset,
        "repay",
        amountInUSD
      ).then((response) => {
        const newHealthFactor = JSON.parse(response.body);
        State.update({ newHealthFactor });
      });
    });
};

function getNonce(tokenAddress, userAddress) {
  const token = new ethers.Contract(
    tokenAddress,
    config.erc20Abi.body,
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
        spender: config.aavePoolV3Address,
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
function repayERC20(amount) {
  State.update({
    loading: true,
  });
  const asset = underlyingAsset;
  const deadline = Math.floor(Date.now() / 1000 + 3600); // after an hour
  Ethers.provider()
    .getSigner()
    .getAddress()
    .then((address) => {
      console.log({
        address,
        asset,
        tokenName,
        amount,
        deadline,
        now: "111",
      });
      return signERC20Approval(address, asset, tokenName, amount, deadline)
        .then((rawSig) => {
          const sig = ethers.utils.splitSignature(rawSig);
          const pool = new ethers.Contract(
            config.aavePoolV3Address,
            config.aavePoolV3ABI.body,
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
          ).then((tx) => {
            tx.wait().then((res) => {
              const { status } = res;
              if (status === 1) {
                onActionSuccess({
                  msg: `You repaid ${Big(amount)
                    .div(Big(10).pow(decimals))
                    .toFixed(8)} ${symbol}`,
                  callback: () => {
                    onRequestClose();
                    State.update({
                      loading: false,
                    });
                  },
                });
                console.log("tx succeeded", res);
              } else {
                State.update({
                  loading: false,
                });
                console.log("tx failed", res);
              }
            });
          });
        })
        .catch(() => State.update({ loading: false }));
    })
    .catch(() => State.update({ loading: false }));
}

function repayETH(amount) {
  State.update({ loading: true });
  const wrappedTokenGateway = new ethers.Contract(
    config.wrappedTokenGatewayV3Address,
    config.wrappedTokenGatewayV3ABI.body,
    Ethers.provider().getSigner()
  );

  Ethers.provider()
    .getSigner()
    .getAddress()
    .then((address) => {
      wrappedTokenGateway
        .repayETH(
          config.aavePoolV3Address,
          amount,
          2, // variable interest rate
          address,
          {
            value: amount,
          }
        )
        .then((tx) => {
          tx.wait().then((res) => {
            const { status } = res;
            if (status === 1) {
              onActionSuccess({
                msg: `You repaid ${Big(amount)
                  .div(Big(10).pow(decimals))
                  .toFixed(8)} ${symbol}`,
                callback: () => {
                  onRequestClose();
                  State.update({
                    loading: false,
                  });
                },
              });
              console.log("tx succeeded", res);
            } else {
              State.update({
                loading: false,
              });
              console.log("tx failed", res);
            }
          });
        })
        .catch(() => State.update({ loading: false }));
    })
    .catch(() => State.update({ loading: false }));
}

return (
  <>
    <Widget
      src={`${config.ownerId}/widget/AAVE.Modal.BaseModal`}
      props={{
        title: `Repay ${symbol}`,
        onRequestClose: onRequestClose,
        children: (
          <RepayContainer>
            <Widget
              src={`${config.ownerId}/widget/AAVE.Modal.RoundedCard`}
              props={{
                title: "Amount",
                config,
                children: (
                  <>
                    <Widget
                      src={`${config.ownerId}/widget/AAVE.Modal.FlexBetween`}
                      props={{
                        left: (
                          <TokenTexture>
                            <Input
                              type="number"
                              value={state.amount}
                              onChange={(e) => {
                                changeValue(e.target.value);
                              }}
                              placeholder="0"
                            />
                          </TokenTexture>
                        ),
                        right: (
                          <TokenWrapper>
                            <img
                              width={26}
                              height={26}
                              src={`https://app.aave.com/icons/tokens/${symbol.toLowerCase()}.svg`}
                            />
                            <TokenTexture>{symbol}</TokenTexture>
                          </TokenWrapper>
                        ),
                      }}
                    />
                    <Widget
                      src={`${config.ownerId}/widget/AAVE.Modal.FlexBetween`}
                      props={{
                        left: <GrayTexture>${state.amountInUSD}</GrayTexture>,
                        right: (
                          <GrayTexture>
                            Repay balance: {Number(variableBorrows).toFixed(7)}
                            <Max
                              onClick={() => {
                                changeValue(maxValue);
                              }}
                            >
                              MAX
                            </Max>
                          </GrayTexture>
                        ),
                      }}
                    />
                  </>
                ),
              }}
            />
            <Widget
              src={`${config.ownerId}/widget/AAVE.Modal.RoundedCard`}
              props={{
                title: "Transaction Overview",
                config,
                children: (
                  <TransactionOverviewContainer>
                    <Widget
                      src={`${config.ownerId}/widget/AAVE.Modal.FlexBetween`}
                      props={{
                        left: <PurpleTexture>Remaining Debt</PurpleTexture>,
                        right: (
                          <div style={{ textAlign: "right" }}>
                            <WhiteTexture>
                              {Number(variableBorrows).toFixed(7) +
                                ` ${symbol}`}
                              <img
                                src={`${config.ipfsPrefix}/bafkreiesqu5jyvifklt2tfrdhv6g4h6dubm2z4z4dbydjd6if3bdnitg7q`}
                                width={16}
                                height={16}
                              />{" "}
                              {isValid(state.amount)
                                ? Big(variableBorrows)
                                    .minus(state.amount)
                                    .toFixed(7) + ` ${symbol}`
                                : `- ${symbol}`}
                            </WhiteTexture>
                            <WhiteTexture>
                              {isValid(variableBorrows) &&
                              isValid(marketReferencePriceInUsd)
                                ? "$ " +
                                  Big(variableBorrows)
                                    .times(marketReferencePriceInUsd)
                                    .toFixed(2)
                                : "$ -"}
                              <img
                                src={`${config.ipfsPrefix}/bafkreiesqu5jyvifklt2tfrdhv6g4h6dubm2z4z4dbydjd6if3bdnitg7q`}
                                width={16}
                                height={16}
                              />{" "}
                              {isValid(state.amount) &&
                              isValid(state.amount) &&
                              isValid(marketReferencePriceInUsd)
                                ? "$ " +
                                  Big(variableBorrows)
                                    .minus(state.amount)
                                    .times(marketReferencePriceInUsd)
                                    .toFixed(2)
                                : "$ -"}
                            </WhiteTexture>
                          </div>
                        ),
                      }}
                    />
                    <Widget
                      src={`${config.ownerId}/widget/AAVE.Modal.FlexBetween`}
                      props={{
                        left: <PurpleTexture>Health Factor</PurpleTexture>,
                        right: (
                          <div style={{ textAlign: "right" }}>
                            <GreenTexture>
                              {Number(healthFactor).toFixed(2)}
                              <img
                                src={`${config.ipfsPrefix}/bafkreiesqu5jyvifklt2tfrdhv6g4h6dubm2z4z4dbydjd6if3bdnitg7q`}
                                width={16}
                                height={16}
                              />{" "}
                              {state.newHealthFactor === "-"
                                ? state.newHealthFactor
                                : Number(state.newHealthFactor).toFixed(2)}
                            </GreenTexture>
                            <WhiteTexture>
                              Liquidation at &lt;{" "}
                              {config.FIXED_LIQUIDATION_VALUE}
                            </WhiteTexture>
                          </div>
                        ),
                      }}
                    />
                  </TransactionOverviewContainer>
                ),
              }}
            />
            <Widget
              src={`${config.ownerId}/widget/AAVE.PrimaryButton`}
              props={{
                config,
                children: `Repay ${symbol}`,
                loading: state.loading,
                onClick: () => {
                  const amount = Big(state.amount)
                    .mul(Big(10).pow(decimals))
                    .toFixed(0);
                  if (symbol === "ETH" || symbol === "WETH") {
                    repayETH(amount);
                  } else {
                    repayERC20(amount);
                  }
                },
              }}
            />
          </RepayContainer>
        ),
        config,
      }}
    />
  </>
);
