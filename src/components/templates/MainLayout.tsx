import React from 'react';
import { Layout } from 'antd';
import { Sidebar } from '../organisms/Sidebar';

const { Content, Footer } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Layout className="app-shell">
      <Sidebar />
      <Layout className="bg-transparent" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Content
          className="page-content"
          style={{ margin: '24px 16px', padding: 24, minHeight: 280, flex: 1 }}
        >
          {children}
        </Content>
        <Footer style={{ textAlign: 'center', background: 'transparent', padding: '12px 24px', opacity: 0.7 }}>
          <div className="text-xs text-slate-500 max-w-2xl mx-auto">
            <strong>Miễn trừ trách nhiệm:</strong> Thông tin trên website này chỉ mang tính chất tham khảo. 
            Tôi <strong>không khuyến khích hoặc cung cấp bất kỳ lời khuyên cờ bạc nào</strong>. 
            Người dùng tự chịu trách nhiệm về các quyết định của mình. 
            Vui lòng đối chiếu kết quả chính thức tại trang chủ Vietlott.
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};
