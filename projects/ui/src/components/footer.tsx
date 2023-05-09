import styled from 'styled-components';

const StyledFooter = styled.footer`
  padding: var(--base-padding);
  background-color: #f4f4f4;

  ul {
    margin: 0;
    padding: 0;
    display: flex;
    list-style: none;
  }
`;

const Header = () => {
  return (
    <StyledFooter>
      <ul>
        <li>
          {/* rome-ignore lint/a11y/useValidAnchor: <explanation> */}
          <a href="#">Some links</a>
        </li>
      </ul>
    </StyledFooter>
  );
};

export default Header;
