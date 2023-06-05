const CardEmpty = styled.div`
  min-height: 220px;

  font-size: 14px;

  display: grid;
  place-content: center;
`;

return <CardEmpty>{props.children}</CardEmpty>;
