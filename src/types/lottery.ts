export interface LotteryRecord {
  date: string;
  id: string;
  result: number[] | Record<string, (number | string)[]>;
  process_time: string;
}

export interface ProductConfig {
  id: string;
  name: string;
  displayName: string;
  fileName: string;
  minVal: number;
  maxVal: number;
  size: number; // number of balls in the primary result
  color: string;
}

export interface FrequencyStat {
  number: number;
  count: number;
  percentage: number;
}

export interface DaysSinceStat {
  number: number;
  lastDate: string;
  daysSince: number;
}

export interface DataOverviewStat {
  productId: string;
  name: string;
  totalDraws: number;
  startDate: string;
  endDate: string;
  totalRecords: number;
}

export const PRODUCTS: ProductConfig[] = [
  {
    id: 'power_655',
    name: 'power_655',
    displayName: 'Power 6/55',
    fileName: 'power655.jsonl',
    minVal: 1,
    maxVal: 55,
    size: 6,
    color: '#e74c3c',
  },
  {
    id: 'power_645',
    name: 'power_645',
    displayName: 'Power 6/45',
    fileName: 'power645.jsonl',
    minVal: 1,
    maxVal: 45,
    size: 6,
    color: '#f39c12',
  },
  {
    id: 'power_535',
    name: 'power_535',
    displayName: 'Power 5/35',
    fileName: 'power535.jsonl',
    minVal: 1,
    maxVal: 35,
    size: 5,
    color: '#27ae60',
  },
  {
    id: 'keno',
    name: 'keno',
    displayName: 'Keno',
    fileName: 'keno.jsonl',
    minVal: 1,
    maxVal: 80, // Actually keno has 80 numbers, but the data showed 45... wait.
    size: 20,
    color: '#3498db',
  },
  {
    id: '3d',
    name: '3d',
    displayName: 'Max 3D',
    fileName: '3d.jsonl',
    minVal: 0,
    maxVal: 9,
    size: 6,
    color: '#9b59b6',
  },
  {
    id: '3d_pro',
    name: '3d_pro',
    displayName: 'Max 3D Pro',
    fileName: '3d_pro.jsonl',
    minVal: 0,
    maxVal: 9,
    size: 6,
    color: '#8e44ad',
  },
  {
    id: 'bingo18',
    name: 'bingo18',
    displayName: 'Bingo18',
    fileName: 'bingo18.jsonl',
    minVal: 1,
    maxVal: 6,
    size: 3,
    color: '#f1c40f',
  },
];
