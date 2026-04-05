import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Space, Segmented } from 'antd';
import { useLotteryWorker } from '../hooks/useLotteryWorker';
import { PRODUCTS } from '../types/lottery';
import { MainLayout } from '../components/templates/MainLayout';
import { FrequencyChart } from '../components/Analysis/FrequencyChart';
import { RecentResults } from '../components/organisms/RecentResults';
import { DaysSinceAnalysis } from '../components/organisms/DaysSinceAnalysis';
import { ChartWrapper } from '../components/molecules/ChartWrapper';

export const ProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const product = useMemo(() => PRODUCTS.find((p) => p.id === productId), [productId]);
  const [freqDays, setFreqDays] = useState<number | undefined>(undefined);
  const { records, freqData, daysSinceData, loading, error } = useLotteryWorker(
    product?.id || '',
    freqDays,
  );

  if (!product) return <div className="p-8 text-center text-red-500">Sản phẩm không tồn tại.</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-bold">Lỗi: {error}</div>;

  return (
    <MainLayout pageTitle={product.displayName}>
      <Space orientation="vertical" size="large" style={{ display: 'flex' }}>
        <Row gutter={[24, 24]}>
          {/* Left: Results & Days Since */}
          <Col xs={24} lg={8}>
            <Space orientation="vertical" size="large" style={{ display: 'flex' }}>
              <RecentResults records={records} product={product} loading={loading} />
              <DaysSinceAnalysis data={daysSinceData} loading={loading} />
            </Space>
          </Col>

          {/* Right: Charts & Table */}
          <Col xs={24} lg={16}>
            <Space orientation="vertical" size="large" style={{ display: 'flex' }}>
              <ChartWrapper
                title="Tần suất xuất hiện"
                extra={
                  <Segmented
                    options={[
                      { label: 'Tất cả', value: 'all' },
                      { label: '30 ngày', value: '30' },
                      { label: '90 ngày', value: '90' },
                    ]}
                    onChange={(val) =>
                      setFreqDays(val === 'all' ? undefined : parseInt(val as string, 10))
                    }
                  />
                }
              >
                <FrequencyChart data={freqData} color={product.color} />
              </ChartWrapper>
            </Space>
          </Col>
        </Row>
      </Space>
    </MainLayout>
  );
};
