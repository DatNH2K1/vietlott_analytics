import React, { useMemo } from 'react';
import { Row, Col, Space, Typography, Card } from 'antd';
import { useAllLotteryData } from '../hooks/useLotteryData';
import { MainLayout } from '../components/templates/MainLayout';
import { StatItem } from '../components/molecules/StatItem';
import { OverviewTable } from '../components/organisms/OverviewTable';
import { Activity, Hash, Layers } from 'lucide-react';

const { Title } = Typography;

export const HomePage: React.FC = () => {
  const { results, loading } = useAllLotteryData();

  const summaries = useMemo(() => {
    return Object.values(results);
  }, [results]);

  const totalDraws = summaries.reduce((acc, s) => acc + s.totalDraws, 0);
  const totalNumbers = summaries.reduce((acc, s) => acc + s.totalRecords, 0);

  return (
    <MainLayout pageTitle="Dashboard Tổng quan">
      <Space orientation="vertical" size="large" style={{ display: 'flex' }}>
        {/* Stat Cards */}
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={8}>
            <StatItem
              title="Tổng kỳ quay"
              value={totalDraws.toLocaleString()}
              icon={<Layers className="text-emerald-600" size={24} />}
              loading={loading}
            />
          </Col>
          <Col xs={24} sm={8}>
            <StatItem
              title="Số lượng bản ghi"
              value={totalNumbers.toLocaleString()}
              icon={<Hash className="text-orange-500" size={24} />}
              loading={loading}
            />
          </Col>
          <Col xs={24} sm={8}>
            <StatItem
              title="Sản phẩm hoạt động"
              value="5"
              icon={<Activity className="text-emerald-500" size={24} />}
              loading={loading}
            />
          </Col>
        </Row>

        {/* Overview Table */}
        <Card
          title={
            <Title level={5} style={{ margin: 0 }}>
              Dữ liệu chi tiết sản phẩm
            </Title>
          }
          className="glass"
          style={{ borderRadius: 12 }}
        >
          <OverviewTable data={summaries} loading={loading} />
        </Card>
      </Space>
    </MainLayout>
  );
};
