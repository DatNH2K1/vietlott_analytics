import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { HomePage } from './pages/HomePage';
import { ProductPage } from './pages/ProductPage';

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#0f766e',
          colorSuccess: '#16a34a',
          colorWarning: '#f59e0b',
          borderRadius: 14,
          fontFamily: '"Sora", "Segoe UI", sans-serif',
        },
        components: {
          Layout: {
            bodyBg: 'transparent',
            headerBg: 'transparent',
            siderBg: 'transparent',
          },
          Card: {
            colorBgContainer: '#ffffff',
            colorBorderSecondary: '#e2e8f0',
          },
          Table: {
            colorBgContainer: '#ffffff',
            headerBg: '#f8fafc',
            headerColor: '#0f172a',
            rowHoverBg: '#f1f5f9',
          },
          Menu: {
            itemBg: 'transparent',
            itemColor: '#475569',
            itemSelectedBg: 'rgba(15, 118, 110, 0.12)',
            itemSelectedColor: '#0f766e',
            itemHoverBg: 'rgba(15, 118, 110, 0.08)',
          },
        },
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:productId" element={<ProductPage />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
