import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { DashboardOutlined } from '@ant-design/icons';
import { PRODUCTS } from '../../types/lottery';

const { Sider } = Layout;
const { Title } = Typography;

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Tổng quan',
    },
    {
      key: 'products-group',
      label: 'Sản phẩm',
      type: 'group' as const,
      children: PRODUCTS.map((p) => ({
        key: `/product/${p.id}`,
        icon: <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />,
        label: p.displayName,
      })),
    },
  ];

  return (
    <Sider
      collapsible
      trigger={null}
      width={260}
      className="app-sidebar m-4 mr-0 rounded-2xl overflow-hidden"
      theme="light"
    >
      <div className="p-6 flex items-center gap-3">
        <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-xl shadow-lg shadow-emerald-500/20" />
        <Title level={4} style={{ margin: 0, color: '#0f172a', letterSpacing: '-0.02em' }}>
          Vietlott<span className="text-emerald-600 block text-xs font-semibold uppercase tracking-wider">Analytics</span>
        </Title>
      </div>
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        className="bg-transparent px-2"
        onClick={(info) => {
          if (typeof info.key === 'string' && info.key.startsWith('/')) {
            navigate(info.key);
          }
        }}
      />
    </Sider>
  );
};
