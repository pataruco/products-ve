import styled from 'styled-components';

const StyledHeader = styled.header`
  padding: var(--base-padding);

  h1 {
    margin: 0;
  }
`;

const Header = () => {
  return (
    <StyledHeader>
      <h1>El Guacal</h1>
    </StyledHeader>
  );
};

export default Header;
