import React from 'react';
import { Card, Space, Badge, Typography } from 'antd';
import { HistoryOutlined, CalendarOutlined } from '@ant-design/icons';
import { NumberBall } from '../atoms/NumberBall';
import type { LotteryRecord, ProductConfig } from '../../types/lottery';
import { normalizeResult } from '../../lib/utils';

const { Text } = Typography;

interface RecentResultsProps {
  records: LotteryRecord[];
  product: ProductConfig;
  loading: boolean;
}

export const RecentResults: React.FC<RecentResultsProps> = ({ records, product, loading }) => {
  const latestDate = records.length > 0 ? records[0].date : null;

  return (
    <Card
      title={
        <Space>
          <HistoryOutlined className="text-blue-500" />
          <span>Kết quả gần nhất ({latestDate || '...'})</span>
        </Space>
      }
      className="glass"
      loading={loading}
    >
      <div className="flex flex-col gap-6">
        {records.map((item) => {
          const balls = normalizeResult(item.result);
          return (
            <div
              key={item.id}
              className="flex flex-col items-start gap-3 border-b border-white/10 pb-6 last:border-0 last:pb-0"
            >
              <div className="flex items-center justify-between w-full">
                <Space>
                  <CalendarOutlined className="text-slate-500" />
                  <Text type="secondary">{item.date}</Text>
                </Space>
                <Badge status="processing" text={`Kỳ quay #${item.id}`} />
              </div>
              <div className="flex flex-wrap gap-2">
                {balls.map((num, idx) => (
                  <NumberBall
                    key={`${item.id}-${idx}`}
                    number={num}
                    color={product.color}
                    size="sm"
                    isSpecial={product.id === 'power_655' && idx === 6}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
