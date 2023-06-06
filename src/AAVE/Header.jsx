const { config } = props;

const Header = styled.div`
  padding: 18px 15px;
  background: #151718;
`;

const AAVELogo = () => (
  <img
    height={25}
    src={`${config.ipfsPrefix}/bafkreihd7awu5x6evyucm4u4qpbb7ezkddsut2mra7ugjxqd4x74bpbln4`}
  />
);

return (
  <Header>
    <AAVELogo />
  </Header>
);
