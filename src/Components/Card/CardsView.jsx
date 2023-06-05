const { title, body, style } = props;

const CardsContainer = styled.div`
  border-radius: 10px;
  background: #151718;

  padding: 18px 0;
`;

const CardsTitle = styled.div`
  color: white;

  font-size: 14px;
  font-weight: 800;

  padding: 0 14px;
`;

const Divider = styled.hr`
  width: 100%;
  border: 0;
  height: 1px;
  background: white;
  border-radius: 9999px;
`;

const CardsBody = styled.div`
  padding: 0 14px;
`;
return (
  <CardsContainer style={style}>
    <CardsTitle>{title}</CardsTitle>
    <Divider />
    <CardsBody>{body}</CardsBody>
  </CardsContainer>
);
