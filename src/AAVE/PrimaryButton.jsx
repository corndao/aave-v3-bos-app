const { children, ...properties } = props;
const PrimaryButton = styled.button`
  border: 0;

  color: white;
  background: #8247e5;
  border-radius: 5px;

  height: 48px;
  width: 100%;

  font-size: 16px;
  font-weight: bold;
`;

return <PrimaryButton {...properties}>{children}</PrimaryButton>;
