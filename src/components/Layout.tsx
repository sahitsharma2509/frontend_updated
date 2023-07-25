// components/Layout.js
import DefaultHeader from '../pages/_layout/_headers/DefaultHeader';
import DefaultFooter from '../pages/_layout/_footers/DefaultFooter';
import PageWrapper from '../layout/PageWrapper/PageWrapper';
import Page from '../layout/Page/Page';
import React, { ReactNode } from 'react';

interface LayoutProps {
  title: string;
  showHeader?: boolean; // make this optional if you want to show header by default
  showFooter?: boolean; // make this optional if you want to show footer by default
  children: React.ReactNode;
  hideHeader?: boolean; // new prop
}

const Layout: React.FC<LayoutProps> = ({ title, children, showHeader = true, showFooter = true, hideHeader = false }) => {
  return (
    <div className = 'wrapper'>
      {showHeader && !hideHeader && <DefaultHeader />}
      <main className="content">
      <PageWrapper title={title}>
        <Page>{children}</Page>
      </PageWrapper>
      </main>
 
    </div>
  );
};

  
  export default Layout;
