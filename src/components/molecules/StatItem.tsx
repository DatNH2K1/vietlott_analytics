import React from 'react';
import { Card, Statistic } from 'antd';

interface StatItemProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  loading?: boolean;
}

export const StatItem: React.FC<StatItemProps> = ({ title, value, icon, loading }) => {
  return (
    <Card hoverable loading={loading} className="glass stat-card">
      <Statistic
        title={
          <span className="text-slate-500 font-medium uppercase tracking-wider text-xs">
            {title}
          </span>
        }
        value={value}
        prefix={<div className="mr-3 p-2 stat-icon">{icon}</div>}
        styles={{
          content: { color: '#0f172a', fontSize: '1.6rem', fontWeight: 700 },
        }}
      />
    </Card>
  );
};
