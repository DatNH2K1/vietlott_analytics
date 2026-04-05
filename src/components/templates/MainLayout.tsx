import React from 'react';
import { Layout } from 'antd';
import { Sidebar } from '../organisms/Sidebar';

const { Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Layout className="app-shell">
      <Sidebar />
      <Layout className="bg-transparent">
        <Content
          className="page-content"
          style={{ margin: '24px 16px', padding: 24, minHeight: 280, overflow: 'auto' }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
