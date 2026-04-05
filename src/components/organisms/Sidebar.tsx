import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { BarChartOutlined, DashboardOutlined } from '@ant-design/icons';
import { PRODUCTS } from '../../types/lottery';

const { Sider } = Layout;
const { Title, Text } = Typography;

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
        <Title level={4} style={{ margin: 0, color: '#0f172a' }}>
          <BarChartOutlined className="text-emerald-600 mr-2" />
          Vietlott Analytics
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
      <div className="p-6 absolute bottom-0 w-full text-center">
        <Text type="secondary" style={{ fontSize: '11px' }}>
          v2.0.0 • Vietlott Insights
        </Text>
      </div>
    </Sider>
  );
};
