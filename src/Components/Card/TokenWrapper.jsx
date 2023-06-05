const TokenWrapper = styled.div`
  display: flex;

  img {
    margin-right: 10px;
  }

  .token-title {
    font-size: 24px;
    font-weight: bold;
  }

  .token-chain {
    font-size: 16px;
    font-weight: 500;
    color: #6f6f6f;
  }
`;

return <TokenWrapper>{props.children}</TokenWrapper>;
