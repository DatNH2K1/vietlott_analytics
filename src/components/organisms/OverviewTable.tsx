import React from 'react';
import { Table, Button, Space, Tag, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ClockCircleOutlined } from '@ant-design/icons';
import type { DataOverviewStat } from '../../types/lottery';
import { PRODUCTS } from '../../types/lottery';

const { Text } = Typography;

interface OverviewTableProps {
  data: DataOverviewStat[];
  loading: boolean;
}

export const OverviewTable: React.FC<OverviewTableProps> = ({ data, loading }) => {
  const navigate = useNavigate();

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: DataOverviewStat) => {
        const product = PRODUCTS.find((p) => p.id === record.productId);
        return (
          <Space>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: product?.color }} />
            <span className="font-bold">{text}</span>
            <Text type="secondary">
              <ClockCircleOutlined /> {record.startDate}
            </Text>
          </Space>
        );
      },
    },
    {
      title: 'Tổng kỳ quay',
      dataIndex: 'totalDraws',
      key: 'totalDraws',
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'Ngày gần nhất',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Tổng bản ghi',
      dataIndex: 'totalRecords',
      key: 'totalRecords',
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: unknown, record: DataOverviewStat) => (
        <Button
          type="link"
          icon={<ClockCircleOutlined />}
          onClick={() => navigate(`/product/${record.productId}`)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="glass rounded-xl overflow-hidden p-4">
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="productId"
        pagination={false}
        className="bg-transparent"
        rowClassName="hover:bg-white/5"
        onRow={(record) => ({
          onClick: () => navigate(`/product/${record.productId}`),
          style: { cursor: 'pointer' },
        })}
      />
    </div>
  );
};
