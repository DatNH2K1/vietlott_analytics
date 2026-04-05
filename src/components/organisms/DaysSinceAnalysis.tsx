import React from 'react';
import { Card, Table, Space, Typography, Tag } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import type { DaysSinceStat } from '../../types/lottery';

const { Text } = Typography;

interface DaysSinceAnalysisProps {
  data: DaysSinceStat[];
  loading: boolean;
}

export const DaysSinceAnalysis: React.FC<DaysSinceAnalysisProps> = ({ data, loading }) => {
  const columns = [
    {
      title: 'Số',
      dataIndex: 'number',
      key: 'number',
      render: (num: number) => (
        <Text strong className="text-blue-400">
          {num.toString().padStart(2, '0')}
        </Text>
      ),
    },
    {
      title: 'Ngày cuối về',
      dataIndex: 'lastDate',
      key: 'lastDate',
      render: (text: string) => <Text type="secondary">{text}</Text>,
    },
    {
      title: 'Số ngày vắng',
      dataIndex: 'daysSince',
      key: 'daysSince',
      render: (val: number) => <Tag color="orange">{val} ngày</Tag>,
      align: 'right' as const,
    },
  ];

  return (
    <Card
      title={
        <Space>
          <ClockCircleOutlined className="text-orange-500" />
          <span>Top 10 số "Gan" (Chưa về)</span>
        </Space>
      }
      className="glass"
      loading={loading}
    >
      <Table
        columns={columns}
        dataSource={data.slice(0, 10)}
        rowKey="number"
        pagination={false}
        size="small"
        className="bg-transparent"
      />
    </Card>
  );
};
