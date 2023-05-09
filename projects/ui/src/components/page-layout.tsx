import React from 'react';
import styled from 'styled-components';

import Footer from './footer';
import Header from './header';

const StyledPageLayout = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  main {
    flex: 1 auto;
    display: flex;
    flex-direction: column;
    position: relative;

    & > * {
      flex: 1 auto;
    }
  }
`;

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <StyledPageLayout>
      <Header />
      <main>{children}</main>
      <Footer />
    </StyledPageLayout>
  );
};

export default PageLayout;
