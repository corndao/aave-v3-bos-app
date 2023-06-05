const CardContainer = styled.div`
  display: flex;
  flex-direction: column;

  gap: 20px;
`;

return <CardContainer>{props.children}</CardContainer>;
