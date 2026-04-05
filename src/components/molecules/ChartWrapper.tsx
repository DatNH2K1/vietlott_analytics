import React from 'react';
import { Card, Typography, Space } from 'antd';
import { BarChart2 } from 'lucide-react';

const { Title } = Typography;

interface ChartWrapperProps {
  title: string;
  children: React.ReactNode;
  extra?: React.ReactNode;
}

export const ChartWrapper: React.FC<ChartWrapperProps> = ({ title, children, extra }) => {
  return (
    <Card
      className="glass"
      title={
        <Space>
          <BarChart2 size={18} className="text-emerald-600" />
          <Title level={5} style={{ margin: 0 }}>
            {title}
          </Title>
        </Space>
      }
      extra={extra}
    >
      {children}
    </Card>
  );
};
