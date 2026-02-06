
import React, { useEffect, useState } from 'react';
import { OpportunityItem, RelationshipManager } from './types';
import { ICONS, COLORS } from './constants';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ManagerApp from './ManagerApp';

// Mock Data
const MOCK_RM_LIST: RelationshipManager[] = [
  { id: '1', name: '王静', avatar: 'https://picsum.photos/seed/rm1/100', role: '财富经理', region: '常熟中心区', wealthIncome: '￥3.6M', wealthIncomeRate: 96, wealthNetIncrease: '￥1.1M', wealthNetIncreaseRate: 88, wealthCustomerNetIncrease: '18户', wealthCustomerNetIncreaseRate: 92, completionRate: 92, predictedRate: 105, status: 'normal', rank: 1, tags: ['高产', '稳健'], recentPerformance: '财富中收表现卓越，存量转化率全行第一，建议作为标杆推广经验。', yearTargetRate: 88, monthTargetRate: 94, yearSignal: 'yellow', monthSignal: 'yellow', totalScore: 92 },
  { id: '2', name: '李强', avatar: 'https://picsum.photos/seed/rm2/100', role: '资深客户经理', region: '常熟新区', wealthIncome: '￥2.4M', wealthIncomeRate: 74, wealthNetIncrease: '￥0.6M', wealthNetIncreaseRate: 68, wealthCustomerNetIncrease: '9户', wealthCustomerNetIncreaseRate: 62, completionRate: 78, predictedRate: 85, status: 'warning', rank: 4, tags: ['资深', '大户型'], recentPerformance: '核心客户数净增遇颈瓶，近期拓客动作偏少，需关注流失预警。', yearTargetRate: 67, monthTargetRate: 72, yearSignal: 'red', monthSignal: 'yellow', totalScore: 78 },
  { id: '3', name: '陈思', avatar: 'https://picsum.photos/seed/rm3/100', role: '财富顾问', region: '常熟城西', wealthIncome: '￥1.1M', wealthIncomeRate: 45, wealthNetIncrease: '￥0.2M', wealthNetIncreaseRate: 39, wealthCustomerNetIncrease: '4户', wealthCustomerNetIncreaseRate: 41, completionRate: 45, predictedRate: 65, status: 'critical', rank: 8, tags: ['潜力', '新人'], recentPerformance: '理财日均大幅回吐，存续产品到期流失严重，急需总对总面谈支持。', yearTargetRate: 52, monthTargetRate: 58, yearSignal: 'red', monthSignal: 'red', totalScore: 45 },
];

// 核心指标趋势数据（当日粒度：本月截至昨日）
const CORE_METRICS_TREND_DAY = [
  { day: '1日', '财富中收': 3.2, '理财日均净增': 0.6, '财富客户数净增': 8, '资产余额': 84.2, '新开卡客户数': 18 },
  { day: '3日', '财富中收': 3.5, '理财日均净增': 0.7, '财富客户数净增': 9, '资产余额': 84.8, '新开卡客户数': 21 },
  { day: '5日', '财富中收': 3.8, '理财日均净增': 1.1, '财富客户数净增': 12, '资产余额': 85.6, '新开卡客户数': 26 },
  { day: '7日', '财富中收': 3.9, '理财日均净增': 0.5, '财富客户数净增': 10, '资产余额': 85.2, '新开卡客户数': 24 },
  { day: '9日', '财富中收': 4.0, '理财日均净增': 0.9, '财富客户数净增': 13, '资产余额': 86.1, '新开卡客户数': 28 },
  { day: '11日', '财富中收': 4.1, '理财日均净增': 1.0, '财富客户数净增': 14, '资产余额': 86.8, '新开卡客户数': 31 },
  { day: '昨日', '财富中收': 4.2, '理财日均净增': 0.8, '财富客户数净增': 12, '资产余额': 86.5, '新开卡客户数': 29 },
];

const CORE_METRICS_TREND_WEEK = [
  { day: '周一', '财富中收': 3.6, '理财日均净增': 0.7, '财富客户数净增': 9, '资产余额': 85.1, '新开卡客户数': 22 },
  { day: '周二', '财富中收': 3.8, '理财日均净增': 0.8, '财富客户数净增': 10, '资产余额': 85.7, '新开卡客户数': 24 },
  { day: '周三', '财富中收': 4.0, '理财日均净增': 0.9, '财富客户数净增': 12, '资产余额': 86.0, '新开卡客户数': 27 },
  { day: '周四', '财富中收': 4.1, '理财日均净增': 0.8, '财富客户数净增': 11, '资产余额': 86.3, '新开卡客户数': 26 },
  { day: '周五', '财富中收': 4.2, '理财日均净增': 0.9, '财富客户数净增': 13, '资产余额': 86.7, '新开卡客户数': 30 },
  { day: '周六', '财富中收': 4.1, '理财日均净增': 0.7, '财富客户数净增': 10, '资产余额': 86.5, '新开卡客户数': 21 },
  { day: '周日', '财富中收': 4.0, '理财日均净增': 0.6, '财富客户数净增': 9, '资产余额': 86.2, '新开卡客户数': 18 },
];

// 核心指标趋势数据（月度粒度：本年截至本月；年粒度同月度）
const CORE_METRICS_TREND_MONTH = [
  { day: '1月', '财富中收': 12.4, '理财日均净增': 9.8, '财富客户数净增': 120, '资产余额': 82.1, '新开卡客户数': 210 },
  { day: '2月', '财富中收': 22.9, '理财日均净增': 11.2, '财富客户数净增': 240, '资产余额': 82.9, '新开卡客户数': 390 },
  { day: '3月', '财富中收': 34.1, '理财日均净增': 13.5, '财富客户数净增': 360, '资产余额': 83.7, '新开卡客户数': 520 },
  { day: '4月', '财富中收': 45.6, '理财日均净增': 12.6, '财富客户数净增': 470, '资产余额': 84.6, '新开卡客户数': 660 },
  { day: '5月', '财富中收': 58.2, '理财日均净增': 14.3, '财富客户数净增': 620, '资产余额': 85.4, '新开卡客户数': 780 },
  { day: '6月', '财富中收': 70.4, '理财日均净增': 13.1, '财富客户数净增': 760, '资产余额': 85.9, '新开卡客户数': 910 },
  { day: '7月', '财富中收': 82.9, '理财日均净增': 15.2, '财富客户数净增': 890, '资产余额': 86.3, '新开卡客户数': 1040 },
  { day: '8月', '财富中收': 95.6, '理财日均净增': 14.7, '财富客户数净增': 940, '资产余额': 86.8, '新开卡客户数': 1120 },
  { day: '9月', '财富中收': 108.2, '理财日均净增': 12.8, '财富客户数净增': 980, '资产余额': 87.2, '新开卡客户数': 1210 },
];

const BASE_METRICS_TREND_DAY = [
  { day: '1日', '零售客户数': 120.2, '理财余额': 3.1, '储蓄余额': 12.2, '新开卡客户数': 18 },
  { day: '3日', '零售客户数': 120.6, '理财余额': 3.2, '储蓄余额': 12.3, '新开卡客户数': 21 },
  { day: '5日', '零售客户数': 121.1, '理财余额': 3.3, '储蓄余额': 12.4, '新开卡客户数': 26 },
  { day: '7日', '零售客户数': 121.4, '理财余额': 3.2, '储蓄余额': 12.5, '新开卡客户数': 24 },
  { day: '9日', '零售客户数': 121.8, '理财余额': 3.4, '储蓄余额': 12.6, '新开卡客户数': 28 },
  { day: '11日', '零售客户数': 122.1, '理财余额': 3.5, '储蓄余额': 12.7, '新开卡客户数': 31 },
  { day: '昨日', '零售客户数': 122.4, '理财余额': 3.4, '储蓄余额': 12.8, '新开卡客户数': 29 },
];

const BASE_METRICS_TREND_WEEK = [
  { day: '周一', '零售客户数': 120.6, '理财余额': 3.2, '储蓄余额': 12.4, '新开卡客户数': 22 },
  { day: '周二', '零售客户数': 120.9, '理财余额': 3.3, '储蓄余额': 12.5, '新开卡客户数': 24 },
  { day: '周三', '零售客户数': 121.3, '理财余额': 3.4, '储蓄余额': 12.6, '新开卡客户数': 27 },
  { day: '周四', '零售客户数': 121.7, '理财余额': 3.4, '储蓄余额': 12.6, '新开卡客户数': 26 },
  { day: '周五', '零售客户数': 122.0, '理财余额': 3.5, '储蓄余额': 12.7, '新开卡客户数': 30 },
  { day: '周六', '零售客户数': 121.8, '理财余额': 3.3, '储蓄余额': 12.6, '新开卡客户数': 21 },
  { day: '周日', '零售客户数': 121.5, '理财余额': 3.2, '储蓄余额': 12.5, '新开卡客户数': 18 },
];

const BASE_METRICS_TREND_MONTH = [
  { day: '1月', '零售客户数': 118.5, '理财余额': 3.0, '储蓄余额': 12.1, '新开卡客户数': 210 },
  { day: '2月', '零售客户数': 119.4, '理财余额': 3.3, '储蓄余额': 12.4, '新开卡客户数': 390 },
  { day: '3月', '零售客户数': 120.2, '理财余额': 3.6, '储蓄余额': 12.7, '新开卡客户数': 520 },
  { day: '4月', '零售客户数': 121.0, '理财余额': 3.9, '储蓄余额': 13.0, '新开卡客户数': 660 },
  { day: '5月', '零售客户数': 121.8, '理财余额': 4.2, '储蓄余额': 13.3, '新开卡客户数': 780 },
  { day: '6月', '零售客户数': 122.6, '理财余额': 4.5, '储蓄余额': 13.6, '新开卡客户数': 910 },
  { day: '7月', '零售客户数': 123.2, '理财余额': 4.7, '储蓄余额': 13.8, '新开卡客户数': 1040 },
  { day: '8月', '零售客户数': 124.1, '理财余额': 4.9, '储蓄余额': 14.0, '新开卡客户数': 1120 },
  { day: '9月', '零售客户数': 124.8, '理财余额': 5.1, '储蓄余额': 14.2, '新开卡客户数': 1210 },
];

// 其他指标趋势数据
const OTHER_METRICS_TREND_DAY = [
  { day: '1月1日', '储蓄存款': 1.12, '个贷余额': 5.8, 'AUM(月)总额': 8.0, '资产日均净增': 2.1, '机构储蓄日均净增': 1.05, '客户触达数': 60, '常银周周乐': 1 },
  { day: '1月3日', '储蓄存款': 1.14, '个贷余额': 5.95, 'AUM(月)总额': 8.15, '资产日均净增': 2.3, '机构储蓄日均净增': 1.08, '客户触达数': 62, '常银周周乐': 1 },
  { day: '1月5日', '储蓄存款': 1.17, '个贷余额': 6.05, 'AUM(月)总额': 8.30, '资产日均净增': 2.5, '机构储蓄日均净增': 1.10, '客户触达数': 63, '常银周周乐': 2 },
  { day: '1月7日', '储蓄存款': 1.19, '个贷余额': 6.15, 'AUM(月)总额': 8.42, '资产日均净增': 2.2, '机构储蓄日均净增': 1.12, '客户触达数': 61, '常银周周乐': 2 },
  { day: '1月9日', '储蓄存款': 1.21, '个贷余额': 6.18, 'AUM(月)总额': 8.48, '资产日均净增': 2.4, '机构储蓄日均净增': 1.15, '客户触达数': 64, '常银周周乐': 3 },
  { day: '1月11日', '储蓄存款': 1.23, '个贷余额': 6.22, 'AUM(月)总额': 8.52, '资产日均净增': 2.6, '机构储蓄日均净增': 1.18, '客户触达数': 66, '常银周周乐': 3 },
  { day: '1月15日', '储蓄存款': 1.24, '个贷余额': 6.24, 'AUM(月)总额': 8.50, '资产日均净增': 2.8, '机构储蓄日均净增': 1.20, '客户触达数': 68, '常银周周乐': 4 },
];

const OTHER_METRICS_TREND_WEEK = [
  { day: '周一', '储蓄存款': 1.18, '个贷余额': 6.05, 'AUM(月)总额': 8.22, '资产日均净增': 2.3, '机构储蓄日均净增': 1.08, '客户触达数': 62, '常银周周乐': 1 },
  { day: '周二', '储蓄存款': 1.19, '个贷余额': 6.12, 'AUM(月)总额': 8.30, '资产日均净增': 2.4, '机构储蓄日均净增': 1.10, '客户触达数': 64, '常银周周乐': 1 },
  { day: '周三', '储蓄存款': 1.20, '个贷余额': 6.18, 'AUM(月)总额': 8.36, '资产日均净增': 2.5, '机构储蓄日均净增': 1.12, '客户触达数': 66, '常银周周乐': 2 },
  { day: '周四', '储蓄存款': 1.21, '个贷余额': 6.20, 'AUM(月)总额': 8.40, '资产日均净增': 2.6, '机构储蓄日均净增': 1.14, '客户触达数': 67, '常银周周乐': 2 },
  { day: '周五', '储蓄存款': 1.22, '个贷余额': 6.22, 'AUM(月)总额': 8.45, '资产日均净增': 2.7, '机构储蓄日均净增': 1.16, '客户触达数': 68, '常银周周乐': 3 },
  { day: '周六', '储蓄存款': 1.20, '个贷余额': 6.16, 'AUM(月)总额': 8.38, '资产日均净增': 2.4, '机构储蓄日均净增': 1.12, '客户触达数': 61, '常银周周乐': 1 },
  { day: '周日', '储蓄存款': 1.18, '个贷余额': 6.10, 'AUM(月)总额': 8.32, '资产日均净增': 2.2, '机构储蓄日均净增': 1.08, '客户触达数': 58, '常银周周乐': 1 },
];

const OTHER_METRICS_TREND_MONTH = [
  { day: '1月', '储蓄存款': 12.8, '个贷余额': 54.2, 'AUM(月)总额': 85.1, '资产日均净增': 21.3, '机构储蓄日均净增': 10.5, '客户触达数': 1860, '常银周周乐': 6 },
  { day: '2月', '储蓄存款': 24.3, '个贷余额': 58.6, 'AUM(月)总额': 92.4, '资产日均净增': 22.1, '机构储蓄日均净增': 11.2, '客户触达数': 2010, '常银周周乐': 7 },
  { day: '3月', '储蓄存款': 36.9, '个贷余额': 62.4, 'AUM(月)总额': 101.6, '资产日均净增': 23.8, '机构储蓄日均净增': 12.0, '客户触达数': 2180, '常银周周乐': 8 },
  { day: '4月', '储蓄存款': 49.1, '个贷余额': 66.8, 'AUM(月)总额': 110.8, '资产日均净增': 24.6, '机构储蓄日均净增': 12.6, '客户触达数': 2320, '常银周周乐': 9 },
  { day: '5月', '储蓄存款': 61.7, '个贷余额': 70.4, 'AUM(月)总额': 118.9, '资产日均净增': 25.4, '机构储蓄日均净增': 13.1, '客户触达数': 2460, '常银周周乐': 10 },
  { day: '6月', '储蓄存款': 74.3, '个贷余额': 74.9, 'AUM(月)总额': 126.7, '资产日均净增': 26.0, '机构储蓄日均净增': 13.7, '客户触达数': 2620, '常银周周乐': 11 },
];

const OTHER_METRICS_TREND_YEAR = [
  { day: '2022', '储蓄存款': 210.5, '个贷余额': 520.8, 'AUM(月)总额': 860.0, '资产日均净增': 180.2, '机构储蓄日均净增': 98.6, '客户触达数': 15200, '常银周周乐': 36 },
  { day: '2023', '储蓄存款': 238.7, '个贷余额': 566.2, 'AUM(月)总额': 930.4, '资产日均净增': 192.4, '机构储蓄日均净增': 104.3, '客户触达数': 16850, '常银周周乐': 41 },
  { day: '2024', '储蓄存款': 265.9, '个贷余额': 612.1, 'AUM(月)总额': 1002.8, '资产日均净增': 208.6, '机构储蓄日均净增': 112.9, '客户触达数': 18520, '常银周周乐': 46 },
];

const CORE_METRIC_VALUES = {
  '财富中收': {
    day: '￥4.2M',
    week: '￥16.4M',
    month: '￥4.2M',
    year: '￥4.2M',
  },
  '理财日均净增': {
    day: '￥0.8M',
    week: '￥5.6M',
    month: '￥12.8M',
    year: '￥98.6M',
  },
  '财富客户数净增': {
    day: '12户',
    week: '76户',
    month: '142户',
    year: '980户',
  },
  '资产余额': {
    day: '￥86.5亿',
    week: '￥86.2亿',
    month: '￥87.2亿',
    year: '￥92.8亿',
  },
  '新开卡客户数': {
    day: '29户',
    week: '178户',
    month: '1,210户',
    year: '8,640户',
  },
} as const;

const CORE_METRIC_TARGETS = {
  month: {
    '财富中收': '￥5.1M',
    '理财日均净增': '￥19.6M',
    '财富客户数净增': '310户',
    '资产余额': '￥88.0亿',
    '新开卡客户数': '1,500户',
  },
  year: {
    '财富中收': '￥120M',
    '理财日均净增': '￥210M',
    '财富客户数净增': '4200户',
    '资产余额': '￥95.0亿',
    '新开卡客户数': '12,000户',
  },
} as const;

const CORE_METRIC_RATES = {
  month: {
    '财富中收': 82.5,
    '理财日均净增': 65.2,
    '财富客户数净增': 45.8,
    '资产余额': 98.3,
    '新开卡客户数': 80.7,
  },
  year: {
    '财富中收': 68.4,
    '理财日均净增': 52.7,
    '财富客户数净增': 41.3,
    '资产余额': 97.6,
    '新开卡客户数': 72.0,
  },
} as const;

const App: React.FC = () => {
  const otherMetrics = [
    {
      label: '资产日均净增',
      rate: 78.1,
      current: { day: '￥0.23亿', month: '￥2.30亿', year: '￥18.40亿' },
      target: { day: '￥0.30亿', month: '￥3.00亿', year: '￥24.00亿' },
      score: 86,
      type: 'success',
    },
    {
      label: '机构储蓄日均净增',
      rate: 91.2,
      current: { day: '￥1.24亿', month: '￥12.40亿', year: '￥108.00亿' },
      target: { day: '￥1.36亿', month: '￥13.60亿', year: '￥120.00亿' },
      score: 95,
      type: 'success',
    },
    {
      label: '客户触达数',
      rate: 76.0,
      current: { day: `${42 + 58}人`, month: '1,860人', year: '18,520人' },
      target: { day: '85人', month: '2,400人', year: '24,000人' },
      score: 80,
      type: 'warning',
      walkinCount: 42,
      callCount: 58,
    },
    {
      label: '常银周周乐',
      rate: 59.2,
      current: { day: '2场', month: '6场', year: '38场' },
      target: { day: '4场/月', month: '8场', year: '48场' },
      score: 66,
      type: 'warning',
      birthdayCount: 1,
      birthdayTarget: '1场/月',
    },
  ];
  const baseMetricPool = ['零售客户数', '理财余额', '储蓄余额', '新开卡客户数'];
  const otherMetricPool = otherMetrics.map((metric) => metric.label);

  const [metricTab, setMetricTab] = useState<'core' | 'base' | 'other'>('core');
  const [selectedCoreMetricKey, setSelectedCoreMetricKey] = useState<string>('财富中收');
  const [selectedBaseMetricKey, setSelectedBaseMetricKey] = useState<string>('零售客户数');
  const [selectedOtherMetricKey, setSelectedOtherMetricKey] = useState<string>(otherMetrics[0].label);
  const [selectedRM, setSelectedRM] = useState<RelationshipManager | null>(null);
  const [reportPeriod, setReportPeriod] = useState<'day' | 'week' | 'month' | 'year'>('day');
  const [rankScope, setRankScope] = useState<'region' | 'bank'>('region');
  const [rankStatusFilter, setRankStatusFilter] = useState<'all' | 'normal' | 'warning' | 'critical'>('all');
  const [currentPage, setCurrentPage] = useState<'overview' | 'manager' | 'customer'>('overview');
  const [selectedManager, setSelectedManager] = useState<RelationshipManager | null>(MOCK_RM_LIST[0]);
  const [selectedCustomerName, setSelectedCustomerName] = useState<string | null>(null);
  const [managerOpportunities, setManagerOpportunities] = useState<Record<string, OpportunityItem[]>>({});
  const [priorityOverrides, setPriorityOverrides] = useState<Record<string, 'important' | 'nonimportant'>>({});
  const [cooldownUntilMap, setCooldownUntilMap] = useState<Record<string, number>>({});
  const [openTouchRateId, setOpenTouchRateId] = useState<string | null>(null);
  const [rankSortKey, setRankSortKey] = useState<'wealthIncome' | 'wealthNetIncrease' | null>(null);
  const [showBaseMetricPool, setShowBaseMetricPool] = useState<boolean>(false);
  const [showOtherMetricPool, setShowOtherMetricPool] = useState<boolean>(false);
  const [baseMetricSelection, setBaseMetricSelection] = useState<string[]>([...baseMetricPool]);
  const [otherMetricSelection, setOtherMetricSelection] = useState<string[]>([...otherMetricPool]);
  const [baseMetricDraft, setBaseMetricDraft] = useState<string[]>([...baseMetricPool]);
  const [otherMetricDraft, setOtherMetricDraft] = useState<string[]>([...otherMetricPool]);
  const [managerMetricSelections, setManagerMetricSelections] = useState<Record<string, { name: string; region: string; base: string[]; other: string[] }>>({});
  const [openMetricSelectionLabel, setOpenMetricSelectionLabel] = useState<string | null>(null);
  const [openMigrationInfo, setOpenMigrationInfo] = useState<{ label: string; type: 'upgrade' | 'downgrade' } | null>(null);

  const parseMetricNumber = (value: string) => Number(value.replace(/[^0-9.]/g, '')) || 0;
  const filteredRankList = MOCK_RM_LIST
    .filter((rm) => (rankStatusFilter === 'all' ? true : rm.status === rankStatusFilter))
    .slice()
    .sort((a, b) => {
      if (rankSortKey === 'wealthIncome') {
        return parseMetricNumber(b.wealthIncome) - parseMetricNumber(a.wealthIncome);
      }
      if (rankSortKey === 'wealthNetIncrease') {
        return parseMetricNumber(b.wealthNetIncrease) - parseMetricNumber(a.wealthNetIncrease);
      }
      return a.rank - b.rank;
    });
  const warningIndicatorPriority = ['财富中收', '理财日均净增', '财富客户数净增'] as const;
  const getWarningSignal = (rm: RelationshipManager) => {
    const indicators = [
      { key: '财富中收', rate: rm.wealthIncomeRate },
      { key: '理财日均净增', rate: rm.wealthNetIncreaseRate },
      { key: '财富客户数净增', rate: rm.wealthCustomerNetIncreaseRate },
    ];
    const worst = indicators
      .slice()
      .sort((a, b) => a.rate - b.rate)[0];
    const severity = worst.rate < 60 ? 'critical' : worst.rate < 80 ? 'warning' : 'normal';
    return { indicator: worst.key, severity, rate: worst.rate };
  };
  const prewarningList = MOCK_RM_LIST
    .map((rm) => ({ ...rm, warning: getWarningSignal(rm) }))
    .filter((rm) => rm.warning.severity !== 'normal')
    .sort((a, b) => {
      const pa = warningIndicatorPriority.indexOf(a.warning.indicator as (typeof warningIndicatorPriority)[number]);
      const pb = warningIndicatorPriority.indexOf(b.warning.indicator as (typeof warningIndicatorPriority)[number]);
      if (pa !== pb) return pa - pb;
      if (a.warning.severity !== b.warning.severity) {
        return a.warning.severity === 'critical' ? -1 : 1;
      }
      return a.warning.rate - b.warning.rate;
    });
  const loggedInManager = selectedManager ?? MOCK_RM_LIST[0];
  const loggedInManagerId = loggedInManager.id;
  const branchMetricStorageKey = `branch-metric-pool-${loggedInManagerId}`;
  const refreshManagerMetricSelections = () => {
    try {
      const raw = localStorage.getItem('manager-metric-selections');
      const parsed = raw ? JSON.parse(raw) : {};
      if (parsed && typeof parsed === 'object') {
        setManagerMetricSelections(parsed);
      } else {
        setManagerMetricSelections({});
      }
    } catch {
      setManagerMetricSelections({});
    }
  };
  useEffect(() => {
    refreshManagerMetricSelections();
    const handler = () => refreshManagerMetricSelections();
    window.addEventListener('manager-metric-updated', handler);
    return () => window.removeEventListener('manager-metric-updated', handler);
  }, []);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(branchMetricStorageKey);
      if (!saved) {
        return;
      }
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        const savedBase = Array.isArray(parsed.base) ? parsed.base : [];
        const savedOther = Array.isArray(parsed.other) ? parsed.other : [];
        const normalizedBase = savedBase.filter((label) => baseMetricPool.includes(label));
        const normalizedOther = savedOther.filter((label) => otherMetricPool.includes(label));
        if (normalizedBase.length > 0) {
          setBaseMetricSelection(normalizedBase);
          setBaseMetricDraft(normalizedBase);
        }
        if (normalizedOther.length > 0) {
          setOtherMetricSelection(normalizedOther);
          setOtherMetricDraft(normalizedOther);
        }
      }
    } catch {
      // ignore
    }
  }, [branchMetricStorageKey, baseMetricPool, otherMetricPool]);

  useEffect(() => {
    if (baseMetricSelection.length > 0 && !baseMetricSelection.includes(selectedBaseMetricKey)) {
      setSelectedBaseMetricKey(baseMetricSelection[0]);
    }
  }, [baseMetricSelection, selectedBaseMetricKey]);

  useEffect(() => {
    if (otherMetricSelection.length > 0 && !otherMetricSelection.includes(selectedOtherMetricKey)) {
      setSelectedOtherMetricKey(otherMetricSelection[0]);
    }
  }, [otherMetricSelection, selectedOtherMetricKey]);
  const isLoggedInTopThree = filteredRankList.slice(0, 3).some((rm) => rm.id === loggedInManager.id);
  const rankListWithoutLoggedIn = isLoggedInTopThree
    ? filteredRankList
    : filteredRankList.filter((rm) => rm.id !== loggedInManager.id);
  const displayRankList = isLoggedInTopThree
    ? rankListWithoutLoggedIn
    : [...rankListWithoutLoggedIn, loggedInManager];
  const reportPeriodLabel = reportPeriod === 'day' ? '当日' : reportPeriod === 'week' ? '本周' : reportPeriod === 'month' ? '本月' : '本年';
  const rateLabel = reportPeriod === 'day' || reportPeriod === 'week' ? '月目标达成率' : '年目标达成率';
  const selectedMetricKey = metricTab === 'core'
    ? selectedCoreMetricKey
    : metricTab === 'base'
    ? selectedBaseMetricKey
    : selectedOtherMetricKey;
  const coreTrendData = reportPeriod === 'day'
    ? CORE_METRICS_TREND_DAY
    : reportPeriod === 'week'
    ? CORE_METRICS_TREND_WEEK
    : CORE_METRICS_TREND_MONTH;
  const baseTrendData = reportPeriod === 'day'
    ? BASE_METRICS_TREND_DAY
    : reportPeriod === 'week'
    ? BASE_METRICS_TREND_WEEK
    : BASE_METRICS_TREND_MONTH;
  const otherTrendData = reportPeriod === 'day'
    ? OTHER_METRICS_TREND_DAY
    : reportPeriod === 'week'
    ? OTHER_METRICS_TREND_WEEK
    : reportPeriod === 'year'
    ? OTHER_METRICS_TREND_YEAR
    : OTHER_METRICS_TREND_MONTH;
  const coreTargetScope = reportPeriod === 'day' || reportPeriod === 'week' ? 'month' : 'year';
  const profileDeltaTooltip = [
    '较上月净增加33户',
    '其中新增95户（尊燕3户，金燕14户，钻燕78户）',
    '减少62户（小燕6户，银燕1户，金燕5户，钻燕50户）',
  ];
  const profileDeltaTooltipBank = [
    '较上月净增加70278户',
    '其中新增112430户（尊燕240户，金燕18640户，钻燕28750户）',
    '减少42152户（小燕8200户，银燕2940户，金燕5720户，钻燕25292户）',
  ];
  const supervisionOpportunities: Omit<OpportunityItem, 'sentAt'>[] = [
    {
      id: 'supervise-retention',
      title: '理财到期精准挽留',
      description: '检测到本周网点存续理财到期规模 1.2亿，流失风险评级为“极高”。',
      priority: '高优',
      source: 'AI智慧督导',
    },
    {
      id: 'supervise-upgrade',
      title: '核心客户私行升级',
      description: '识别出 156 名高潜力升级客户，AUM(月) 集中在 500w-600w 区间。',
      priority: '中优',
      source: 'AI智慧督导',
    },
  ];
  const retentionOpportunityRows = [
    { id: 'retention-1', name: '理财到期续作名单', customers: '42户' },
    { id: 'retention-2', name: 'A级潜在流失高净值', customers: '12户' },
    { id: 'retention-3', name: '高净值到期回访', customers: '28户' },
    { id: 'retention-4', name: '重点资金回流跟进', customers: '16户' },
  ];
  const upgradeOpportunityRows = [
    { id: 'upgrade-1', name: '可升级白名单客户', customers: '156户' },
    { id: 'upgrade-2', name: '高潜私行候选', customers: '48户' },
    { id: 'upgrade-3', name: '高AUM(月)沉淀客户', customers: '72户' },
    { id: 'upgrade-4', name: '高粘性增配客户', customers: '35户' },
  ];
  const profileRows = [
    { label: '尊燕', count: '1385户', countDelta: '较上月 +33户', allocationLocal: '98%', callLocal: '326次', callLocalDelta: '较上月 +18次', visitLocal: '98次', countBank: '6420户', countBankDelta: '较上月 +168户', allocationBank: '96%', callBank: '1520次', callBankDelta: '较上月 +96次', visitBank: '412次', aumLocal: 'AUM(月):184.95亿元', aumLocalDelta: '较上月 ↑7.15亿元', aumBank: 'AUM(月):512.40亿元', aumBankDelta: '较上月 ↑18.26亿元', width: 120, tone: 'from-amber-200 to-amber-400 text-slate-800', pendingUpgrade: 0, pendingDowngrade: 18, upgradeTop: ['王慧', '赵敏', '孙丽'], downgradeTop: ['李强', '陈思', '周琪'] },
    { label: '钻燕', count: '7879户', countDelta: '较上月 +263户', allocationLocal: '92%', callLocal: '1,285次', callLocalDelta: '较上月 +84次', visitLocal: '420次', countBank: '30210户', countBankDelta: '较上月 +1240户', allocationBank: '90%', callBank: '6,480次', callBankDelta: '较上月 +312次', visitBank: '1,980次', aumLocal: 'AUM(月):239.18亿元', aumLocalDelta: '较上月 ↑8.17亿元', aumBank: 'AUM(月):684.30亿元', aumBankDelta: '较上月 ↑22.74亿元', width: 160, tone: 'from-rose-200 to-rose-400 text-rose-700', pendingUpgrade: 96, pendingDowngrade: 35, upgradeTop: ['郭家豪', '王国强', '孙世诚'], downgradeTop: ['陈婉清', '李诗涵', '周文静'] },
    { label: '金燕', count: '56353户', countDelta: '较上月 +1996户', allocationLocal: '88%', callLocal: '6,820次', callLocalDelta: '较上月 +410次', visitLocal: '2,350次', countBank: '198640户', countBankDelta: '较上月 +8120户', allocationBank: '86%', callBank: '21,400次', callBankDelta: '较上月 +1,250次', visitBank: '7,560次', aumLocal: 'AUM(月):782.68亿元', aumLocalDelta: '较上月 ↑15.45亿元', aumBank: 'AUM(月):2198.50亿元', aumBankDelta: '较上月 ↑61.35亿元', width: 220, tone: 'from-emerald-200 to-emerald-400 text-emerald-700', pendingUpgrade: 420, pendingDowngrade: 80, upgradeTop: ['杨浩然', '许子墨', '林子涵'], downgradeTop: ['董浩宇', '赵文涛', '周欣怡'] },
    { label: '银燕', count: '19224户', countDelta: '较上月 +7227户', allocationLocal: '82%', callLocal: '4,150次', callLocalDelta: '较上月 +220次', visitLocal: '1,740次', countBank: '73580户', countBankDelta: '较上月 +26540户', allocationBank: '80%', callBank: '13,280次', callBankDelta: '较上月 +760次', visitBank: '4,980次', aumLocal: 'AUM(月):717.11亿元', aumLocalDelta: '较上月 ↑16.53亿元', aumBank: 'AUM(月):1987.20亿元', aumBankDelta: '较上月 ↑58.10亿元', width: 280, tone: 'from-cyan-200 to-cyan-400 text-cyan-700', pendingUpgrade: 860, pendingDowngrade: 120, upgradeTop: ['沈雨桐', '何景深', '邓若琳'], downgradeTop: ['朱俊豪', '徐安然', '周逸晨'] },
    { label: '小燕', count: '285701户', countDelta: '较上月 +5701户', allocationLocal: '71%', callLocal: '8,920次', callLocalDelta: '较上月 +520次', visitLocal: '3,120次', countBank: '1285400户', countBankDelta: '较上月 +34210户', allocationBank: '68%', callBank: '32,600次', callBankDelta: '较上月 +1,920次', visitBank: '11,240次', aumLocal: 'AUM(月):150.69亿元', aumLocalDelta: '较上月 ↓-27217.91万元', aumBank: 'AUM(月):458.90亿元', aumBankDelta: '较上月 ↓-8012.40万元', width: 320, tone: 'from-indigo-200 to-indigo-400 text-indigo-700', pendingUpgrade: 1280, pendingDowngrade: 240, upgradeTop: ['吴嘉怡', '叶梓轩', '宋雅琪'], downgradeTop: ['梁子轩', '杜若曦', '蒋雨辰'] },
  ];
  const migrationLinks: Record<string, { to: string; count: string }> = {
    '钻燕': { to: '尊燕', count: '96人' },
    '金燕': { to: '钻燕', count: '420人' },
    '银燕': { to: '金燕', count: '860人' },
    '小燕': { to: '银燕', count: '1,280人' },
  };
  const formatNumberWithUnit = (value: string) => {
    const match = value.match(/^([0-9]+(?:\.[0-9]+)?)(.*)$/);
    if (!match) {
      return value;
    }
    const [, num, unit] = match;
    const [intPart, decimalPart] = num.split('.');
    const withComma = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return decimalPart ? `${withComma}.${decimalPart}${unit}` : `${withComma}${unit}`;
  };
  const renderDeltaHelp = (lines: string[]) => (
    <span className="relative group">
      <span className="w-4 h-4 rounded-full border border-slate-300 text-slate-500 text-[9px] font-black flex items-center justify-center bg-white cursor-default">?</span>
      <span className="pointer-events-none absolute z-10 hidden group-hover:block -top-3 left-6 w-[260px] rounded-lg bg-slate-800 text-white text-[10px] font-bold leading-relaxed px-3 py-2 shadow-lg">
        {lines.map((line) => (
          <span key={line} className="block">{line}</span>
        ))}
      </span>
    </span>
  );
  const createOpportunityPayload = (opportunity: Omit<OpportunityItem, 'sentAt'>): OpportunityItem => ({
    ...opportunity,
    id: `${opportunity.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    sentAt: new Date().toLocaleString('zh-CN', { hour12: false }),
  });
  const handleDispatchOpportunity = (opportunity: Omit<OpportunityItem, 'sentAt'>, targetIds: string[]) => {
    setManagerOpportunities((prev) => {
      const next = { ...prev };
      targetIds.forEach((targetId) => {
        const payload = createOpportunityPayload(opportunity);
        next[targetId] = [payload, ...(next[targetId] ?? [])];
      });
      return next;
    });
  };
  const handleOpenCustomerInsight = (customerName: string) => {
    setSelectedCustomerName(customerName);
    setCurrentPage('customer');
  };
  const retentionOpportunity = supervisionOpportunities[0];
  const upgradeOpportunity = supervisionOpportunities[1];
  const getCustomersCount = (value: string) => Number(value.replace(/[^0-9]/g, '')) || 0;
  const getPriorityValue = (id: string) => priorityOverrides[id] ?? 'important';
  const handlePriorityChange = (id: string, value: 'important' | 'nonimportant') => {
    if (value === 'nonimportant') {
      setCooldownUntilMap((prev) => ({ ...prev, [id]: Date.now() + 14 * 24 * 60 * 60 * 1000 }));
    }
    setPriorityOverrides((prev) => ({ ...prev, [id]: value }));
  };
  const getSortedOpportunityRows = (rows: { id: string; customers: string }[]) => {
    const now = Date.now();
    return rows
      .filter((row) => !cooldownUntilMap[row.id] || cooldownUntilMap[row.id] <= now)
      .slice()
      .sort((a, b) => {
        const pa = getPriorityValue(a.id);
        const pb = getPriorityValue(b.id);
        if (pa !== pb) {
          return pa === 'important' ? -1 : 1;
        }
        return getCustomersCount(b.customers) - getCustomersCount(a.customers);
      });
  };
  const getTouchRateDetail = (rowId: string, totalCustomers: number) => {
    const managers = MOCK_RM_LIST;
    return managers.map((manager, index) => {
      const managedTotal = 120 + index * 60;
      const touched = Math.max(1, Math.min(managedTotal, Math.round(totalCustomers * (0.18 + index * 0.08))));
      return { name: manager.name, progress: `${touched}/${managedTotal}` };
    });
  };
  const getTouchRateSummary = (rowId: string, customers: string) => {
    const total = Math.max(1, getCustomersCount(customers));
    const touched = Math.max(1, Math.round(total * 0.6));
    return { total, text: `${touched}/${total}` };
  };
  const getMetricSelectionManagers = (label: string) =>
    Object.values(managerMetricSelections).filter(
      (manager) => manager.base.includes(label) || manager.other.includes(label)
    );
  const getMetricSelectionCount = (label: string) => getMetricSelectionManagers(label).length;

  const coreMetrics = [
    { label: '财富中收', rate: CORE_METRIC_RATES[coreTargetScope]['财富中收'], current: CORE_METRIC_VALUES['财富中收'][reportPeriod], target: CORE_METRIC_TARGETS[coreTargetScope]['财富中收'], score: 92, type: 'success' },
    { label: '理财日均净增', rate: CORE_METRIC_RATES[coreTargetScope]['理财日均净增'], current: CORE_METRIC_VALUES['理财日均净增'][reportPeriod], target: CORE_METRIC_TARGETS[coreTargetScope]['理财日均净增'], score: 78, type: 'warning' },
    { label: '财富客户数净增', rate: CORE_METRIC_RATES[coreTargetScope]['财富客户数净增'], current: CORE_METRIC_VALUES['财富客户数净增'][reportPeriod], target: CORE_METRIC_TARGETS[coreTargetScope]['财富客户数净增'], score: 64, type: 'danger' },
  ];
  const allBaseMetrics = [
    { label: '零售客户数', current: { day: '120万户', week: '122万户', month: '125万户', year: '150万户' }[reportPeriod], target: { day: '121万户', week: '123万户', month: '130万户', year: '160万户' }[reportPeriod], score: 86, type: 'success' },
    { label: '理财余额', current: { day: '￥3.2亿', week: '￥3.6亿', month: '￥4.8亿', year: '￥20.6亿' }[reportPeriod], target: { day: '￥3.4亿', week: '￥3.8亿', month: '￥5.2亿', year: '￥22.0亿' }[reportPeriod], score: 80, type: 'warning' },
    { label: '储蓄余额', current: { day: '￥12.4亿', week: '￥12.6亿', month: '￥13.2亿', year: '￥86.0亿' }[reportPeriod], target: { day: '￥12.6亿', week: '￥12.8亿', month: '￥13.6亿', year: '￥88.0亿' }[reportPeriod], score: 84, type: 'success' },
    { label: '新开卡客户数', current: { day: '29户', week: '178户', month: '1,210户', year: '8,640户' }[reportPeriod], target: { day: '36户', week: '190户', month: '1,300户', year: '9,200户' }[reportPeriod], score: 78, type: 'warning' },
  ];
  const baseMetrics = allBaseMetrics.filter((metric) => baseMetricSelection.includes(metric.label));
  const filteredOtherMetrics = otherMetrics.filter((metric) => otherMetricSelection.includes(metric.label));
  const currentMetrics = metricTab === 'core'
    ? coreMetrics
    : metricTab === 'base'
    ? baseMetrics
    : filteredOtherMetrics.map((item) => ({
        ...item,
        current: item.current[reportPeriod] ?? item.current.day,
        target: item.target[reportPeriod] ?? item.target.day,
      }));
  const renderMetricHelp = (label: string) => (
    <span
      className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 text-[9px] font-black text-slate-500 bg-white cursor-pointer"
      title={`口径：${reportPeriodLabel}口径统计，指标以报表期数据为准`}
    >
      ?
    </span>
  );

  const formatCoreMetricValue = (label: string, value: number) => {
    if (label === '财富客户数净增' || label === '新开卡客户数') {
      return `${value}户`;
    }
    if (label === '资产余额') {
      return `￥${value}亿`;
    }
    return `￥${value}M`;
  };

  const renderCoreTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) {
      return null;
    }
    const metricLabel = selectedMetricKey;
    const metricValue = payload[0]?.value;
    const target = CORE_METRIC_TARGETS[coreTargetScope][metricLabel as keyof typeof CORE_METRIC_TARGETS.month];
    const rate = CORE_METRIC_RATES[coreTargetScope][metricLabel as keyof typeof CORE_METRIC_RATES.month];

    return (
      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg text-[11px] font-bold text-slate-700">
        <div className="mb-1 text-[10px] font-black text-slate-500">{label}</div>
        <div className="flex items-center justify-between gap-3">
          <span>具体值</span>
          <span className="text-slate-900">{formatCoreMetricValue(metricLabel, metricValue)}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span>{coreTargetScope === 'month' ? '月目标值' : '年目标值'}</span>
          <span className="text-slate-900">{target}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span>{coreTargetScope === 'month' ? '月目标达成率' : '年目标达成率'}</span>
          <span className="text-slate-900">{rate}%</span>
        </div>
      </div>
    );
  };


  // 当切换 tab 时清空已选指标，避免残留导致趋势图空白
  const handleTabClick = (tab: 'core' | 'base' | 'other') => {
    setMetricTab(tab);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f7fa]">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-[#001529] text-white flex flex-col transition-all shrink-0 sticky top-0 h-screen">
        <div className="p-6 flex items-center space-x-3 border-b border-white/10">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <ICONS.Dashboard />
          </div>
          <span className="hidden lg:block text-lg font-bold tracking-tight">常熟支行理财助手</span>
        </div>
        <nav className="flex-1 px-3 py-6 space-y-2">
          <NavItem icon={<ICONS.Dashboard />} label="支行每日早报" active={currentPage === 'overview'} onClick={() => setCurrentPage('overview')} />
          <div className="my-2 border-t border-white/10"></div>
          <NavItem 
            icon={<ICONS.Users />} 
            label="家金每日早报" 
            active={currentPage === 'manager'} 
            onClick={() => {
              setCurrentPage('manager');
              setSelectedManager(MOCK_RM_LIST[0]);
            }}
          />
          <NavItem icon={<ICONS.Users />} label="智能客户洞察" active={currentPage === 'customer'} onClick={() => setCurrentPage('customer')} />
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        {/* 页面1: 支行每日早报 (经营总览) */}
        {currentPage === 'overview' && (
          <>
        <div className="flex items-center justify-between h-16 px-[22px] pl-[18px] bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M7 16c2 1 4 1 6 0 2-1 3-3 3-5 0-2-1-4-3-5-2-1-4-1-6 0 2 0 4 2 4 5s-2 5-4 5Z" fill="#FFD55E" opacity="0.9"/>
              </svg>
            </div>
            <div className="flex flex-col leading-tight">
              <h2 className="text-lg font-black text-slate-900">常熟农商银行</h2>
              <p className="text-xs font-semibold text-slate-500">CHANGSHU RURAL COMMERCIAL BANK</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* 用户头像 */}
            <img 
              src="https://picsum.photos/seed/user/48" 
              alt="用户头像" 
              className="w-10 h-10 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer" 
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 py-[18px] space-y-6">
        
        {/* 1. 昨日机构经营综述 (顶部全宽) */}
        <header className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-xl font-extrabold text-slate-900">昨日机构经营综述</h1>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
              <span className="text-[9px] font-bold text-slate-400">主账户净增</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">昨日 +18</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">本周 +76</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">本月 +312</span>
            </div>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black rounded uppercase tracking-wider">Branch Insight</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed max-w-5xl">
            <span className="font-bold text-slate-900">机构经营情况：</span>总体平稳向好，客群活跃度提升，本周新增高净值潜力客户 <span className="font-bold text-slate-900 underline decoration-blue-400">42户</span>；<span className="font-bold text-blue-600">关键指标表现</span>上财富中收领先、新客开户环比+18%、触达率升至79%，但理财日均净增小幅回吐；<span className="font-bold text-amber-600">变化原因</span>主要来自王静团队拉升开户30%，中收提升24%、李强/陈思存量到期续作偏弱，约1.2%。<br />
            <span className="font-bold text-emerald-600">经营策略建议：</span>保持高潜客户精准触达，强化到期续作与结构性配置引导，优先修复低效客户经理的转化动作。
          </p>
        </header>

        {/* 预警客户经理滚动条 */}
        <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-200 overflow-hidden">
          <div className="mb-2 px-2 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">预警客户经理</h3>
            <span className="text-[10px] font-bold text-rose-600 ml-auto">{prewarningList.length} 人需要关注</span>
          </div>
          <div className="flex overflow-x-auto space-x-2 px-2 custom-scrollbar">
            {prewarningList.map((rm) => (
              <div 
                key={rm.id}
                className={`flex-shrink-0 p-2 rounded-lg border-l-3 flex items-start space-x-2 min-w-[280px] transition-all hover:shadow-lg ${
                  rm.warning.severity === 'critical' 
                    ? 'bg-rose-50 border-rose-500' 
                    : 'bg-amber-50 border-amber-500'
                }`}
              >
                <div className="relative">
                  <img 
                    src={rm.avatar} 
                    alt={rm.name}
                    className="w-8 h-8 rounded-lg object-cover border border-slate-200" 
                  />
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-white ${
                    rm.warning.severity === 'critical' ? 'bg-rose-500' : 'bg-amber-500'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-0.5">
                  <p className="text-xs font-black text-slate-900">{rm.name}</p>
                  <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">余额净增 +0.6亿</span>
                  <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">新开卡净增 +6户</span>
                  </div>
                  <p className="text-[9px] text-slate-500 font-bold mb-1">{rm.role}</p>
                  <div className="text-[8px] font-bold text-slate-500">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="whitespace-nowrap">目标达成率：</span>
                      <span className="flex items-center gap-1">
                        <span className="text-slate-600">今年 {rm.yearTargetRate}%</span>
                      </span>
                      <span className="text-slate-400">|</span>
                      <span className="flex items-center gap-1">
                        <span className="text-slate-600">本月 {rm.monthTargetRate}%</span>
                      </span>
                      <span className="text-slate-400">|</span>
                      <span className="flex items-center gap-1">
                        <span className="text-slate-600">昨日 {Math.max(30, rm.monthTargetRate - 18)}%</span>
                        <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                          rm.warning.severity === 'critical'
                            ? 'bg-rose-100 text-rose-600'
                            : 'bg-amber-100 text-amber-600'
                        }`}>
                          {rm.warning.severity === 'critical' ? '红灯' : '黄灯'}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="mt-1 flex justify-end">
                    <button
                      onClick={() => setSelectedRM(rm)}
                      className="text-[9px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest"
                    >
                      详情 →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. 中间行：指标表现 (左) 与 AI智慧督导建议 (右) 并列 */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
          
          {/* 左侧：指标卡片及数据总结 (2/3 宽度) */}
          <div className="xl:col-span-2 flex flex-col space-y-4 h-full">
            {/* 核心指标总结 */}
            <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm flex items-start space-x-4">
              <div className="shrink-0 w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-1">指标总结</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  <span className="font-bold text-slate-900">整体数据表现与异常原因：</span>财富中收¥4.2M（达成82.5%）与储蓄日均¥1.24亿（达成91.2%）稳健，但财富客户净增仅142户（完成率45.8%），主要因李强、陈思名下存量客户到期续作偏弱（1.2%），转化节奏滞后。<br />
                  <span className="font-bold text-emerald-600">昨日表现亮眼：</span>财富中收单日新增¥210万，客户触达率提升至79%，新客开户环比+18%。
                </p>
              </div>
            </div>

            {/* 指标卡片 */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              {/* 选项卡切换 + 指标卡片 */}
              <div className="border-b border-slate-100">
                {/* 选项卡按钮 */}
                <div className="flex bg-slate-50">
                  <button 
                    onClick={() => handleTabClick('core')}
                    className={`py-3 px-6 text-xs font-black tracking-widest uppercase transition-all whitespace-nowrap ${metricTab === 'core' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    核心指标表现
                  </button>
                  <button 
                    onClick={() => handleTabClick('base')}
                    className={`py-3 px-6 text-xs font-black tracking-widest uppercase transition-all whitespace-nowrap ${metricTab === 'base' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    基础指标表现
                  </button>
                  <button 
                    onClick={() => handleTabClick('other')}
                    className={`py-3 px-6 text-xs font-black tracking-widest uppercase transition-all whitespace-nowrap ${metricTab === 'other' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    其他关键指标表现
                  </button>
                  <div className="flex-1"></div>
                  <div className="flex items-center pr-4">
                    <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-full">
                      {[
                        { key: 'day', label: '当日' },
                        { key: 'week', label: '本周' },
                        { key: 'month', label: '本月' },
                        { key: 'year', label: '本年' },
                      ].map((option) => (
                        <button
                          key={option.key}
                          onClick={() => setReportPeriod(option.key as 'day' | 'week' | 'month' | 'year')}
                          className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${
                            reportPeriod === option.key
                              ? 'bg-white text-slate-900 shadow-sm'
                              : 'text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                    {metricTab !== 'core' && (
                      <div className="relative ml-3">
                        <button
                          type="button"
                          onClick={() => {
                            if (metricTab === 'base') {
                              setBaseMetricDraft(baseMetricSelection);
                              setShowBaseMetricPool((prev) => !prev);
                            } else {
                              setOtherMetricDraft(otherMetricSelection);
                              setShowOtherMetricPool((prev) => !prev);
                            }
                          }}
                          className="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-200 text-blue-600 hover:bg-blue-50 transition-all"
                        >
                          指标池
                        </button>
                        {metricTab === 'base' && showBaseMetricPool && (
                          <div className="absolute right-0 mt-2 w-60 rounded-xl border border-slate-200 bg-white p-3 shadow-xl z-20">
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">选择指标</div>
                            <div className="space-y-2">
                              {baseMetricPool.map((label) => {
                                const checked = baseMetricDraft.includes(label);
                                const count = getMetricSelectionCount(label);
                                return (
                                  <div key={label} className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                                    <label className="flex items-center gap-2">
                                      <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => {
                                          setBaseMetricDraft((prev) =>
                                            checked ? prev.filter((item) => item !== label) : [...prev, label]
                                          );
                                        }}
                                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-200"
                                      />
                                      <span>{label}</span>
                                    </label>
                                    <div className="relative">
                                      <button
                                        type="button"
                                        onClick={() => setOpenMetricSelectionLabel(openMetricSelectionLabel === label ? null : label)}
                                        className="text-[9px] font-black text-slate-400 hover:text-blue-600"
                                      >
                                        {count}个家金选择
                                      </button>
                                      {openMetricSelectionLabel === label && (
                                        <div className="absolute right-0 mt-2 w-44 rounded-lg border border-slate-200 bg-white p-2 shadow-lg text-[10px] font-bold text-slate-600">
                                          {count === 0 ? (
                                            <div className="text-slate-400">暂无选择</div>
                                          ) : (
                                            getMetricSelectionManagers(label).map((manager) => (
                                              <div key={`${manager.name}-${manager.region}`} className="flex items-center justify-between">
                                                <span>{manager.name}</span>
                                                <span className="text-slate-400">{manager.region}</span>
                                              </div>
                                            ))
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-[10px] text-slate-400 font-bold">
                                已选 {baseMetricDraft.length} 项
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setShowBaseMetricPool(false)}
                                  className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-200 text-slate-500 hover:bg-slate-50"
                                >
                                  取消
                                </button>
                                <button
                                  type="button"
                                  disabled={baseMetricDraft.length === 0}
                                  onClick={() => {
                                    if (baseMetricDraft.length === 0) return;
                                    setBaseMetricSelection(baseMetricDraft);
                                    localStorage.setItem(branchMetricStorageKey, JSON.stringify({ base: baseMetricDraft, other: otherMetricSelection }));
                                    if (!baseMetricDraft.includes(selectedBaseMetricKey)) {
                                      setSelectedBaseMetricKey(baseMetricDraft[0]);
                                    }
                                    setShowBaseMetricPool(false);
                                  }}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                    baseMetricDraft.length === 0
                                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                      : 'bg-blue-600 text-white hover:bg-blue-700'
                                  }`}
                                >
                                  一键保存
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                        {metricTab === 'other' && showOtherMetricPool && (
                          <div className="absolute right-0 mt-2 w-60 rounded-xl border border-slate-200 bg-white p-3 shadow-xl z-20">
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">选择指标</div>
                            <div className="space-y-2">
                              {otherMetricPool.map((label) => {
                                const checked = otherMetricDraft.includes(label);
                                const count = getMetricSelectionCount(label);
                                return (
                                  <div key={label} className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                                    <label className="flex items-center gap-2">
                                      <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => {
                                          setOtherMetricDraft((prev) =>
                                            checked ? prev.filter((item) => item !== label) : [...prev, label]
                                          );
                                        }}
                                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-200"
                                      />
                                      <span>{label}</span>
                                    </label>
                                    <div className="relative">
                                      <button
                                        type="button"
                                        onClick={() => setOpenMetricSelectionLabel(openMetricSelectionLabel === label ? null : label)}
                                        className="text-[9px] font-black text-slate-400 hover:text-blue-600"
                                      >
                                        {count}个家金选择
                                      </button>
                                      {openMetricSelectionLabel === label && (
                                        <div className="absolute right-0 mt-2 w-44 rounded-lg border border-slate-200 bg-white p-2 shadow-lg text-[10px] font-bold text-slate-600">
                                          {count === 0 ? (
                                            <div className="text-slate-400">暂无选择</div>
                                          ) : (
                                            getMetricSelectionManagers(label).map((manager) => (
                                              <div key={`${manager.name}-${manager.region}`} className="flex items-center justify-between">
                                                <span>{manager.name}</span>
                                                <span className="text-slate-400">{manager.region}</span>
                                              </div>
                                            ))
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-[10px] text-slate-400 font-bold">
                                已选 {otherMetricDraft.length} 项
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setShowOtherMetricPool(false)}
                                  className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-200 text-slate-500 hover:bg-slate-50"
                                >
                                  取消
                                </button>
                                <button
                                  type="button"
                                  disabled={otherMetricDraft.length === 0}
                                  onClick={() => {
                                    if (otherMetricDraft.length === 0) return;
                                    setOtherMetricSelection(otherMetricDraft);
                                    localStorage.setItem(branchMetricStorageKey, JSON.stringify({ base: baseMetricSelection, other: otherMetricDraft }));
                                    if (!otherMetricDraft.includes(selectedOtherMetricKey)) {
                                      setSelectedOtherMetricKey(otherMetricDraft[0]);
                                    }
                                    setShowOtherMetricPool(false);
                                  }}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                    otherMetricDraft.length === 0
                                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                      : 'bg-blue-600 text-white hover:bg-blue-700'
                                  }`}
                                >
                                  一键保存
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* 指标卡片 (收缩在左上角) */}
                <div className="p-4 bg-white">
                  <div className={`grid gap-3 ${metricTab === 'other' ? 'grid-cols-3' : 'grid-cols-2 lg:grid-cols-3'}`}>
                    {currentMetrics.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => {
                          if (metricTab === 'core') {
                            setSelectedCoreMetricKey(item.label);
                          } else if (metricTab === 'base') {
                            setSelectedBaseMetricKey(item.label);
                          } else {
                            setSelectedOtherMetricKey(item.label);
                          }
                        }}
                        className={`text-left p-3 rounded-xl border transition-colors bg-white/80 hover:shadow-md flex flex-col gap-2 ${selectedMetricKey === item.label ? 'ring-2 ring-blue-300' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                            {item.label}
                            {renderMetricHelp(item.label)}
                          </span>
                          <div className={`w-2 h-2 rounded-full ${
                            item.type === 'success' ? 'bg-emerald-500' : 
                            item.type === 'warning' ? 'bg-amber-500' : 
                            'bg-rose-500'
                          }`} />
                        </div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-sm font-black text-slate-900 tracking-tight">{item.current}</div>
                            {metricTab !== 'core' && (
                              <div className="relative inline-flex mt-1">
                                <button
                                  type="button"
                                  onClick={() => setOpenMetricSelectionLabel(openMetricSelectionLabel === item.label ? null : item.label)}
                                  className="text-[9px] font-black text-slate-400 hover:text-blue-600"
                                >
                                  {getMetricSelectionCount(item.label)}个家金选择
                                </button>
                                {openMetricSelectionLabel === item.label && (
                                  <div className="absolute left-0 mt-2 w-44 rounded-lg border border-slate-200 bg-white p-2 shadow-lg text-[10px] font-bold text-slate-600 z-20">
                                    {getMetricSelectionCount(item.label) === 0 ? (
                                      <div className="text-slate-400">暂无选择</div>
                                    ) : (
                                      getMetricSelectionManagers(item.label).map((manager) => (
                                        <div key={`${manager.name}-${manager.region}`} className="flex items-center justify-between">
                                          <span>{manager.name}</span>
                                          <span className="text-slate-400">{manager.region}</span>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="text-right text-[8px] font-bold text-slate-400 whitespace-nowrap">
                            <div>目标: {item.target}</div>
                            <div className="text-slate-600">得分: {item.score}分</div>
                          </div>
                        </div>
                        {item.label === '客户触达数' && (
                          <div className="text-[8px] font-bold text-slate-500 flex items-center gap-2">
                            <span>实地走访客户数: {item.walkinCount}</span>
                            <span className="text-slate-300">|</span>
                            <span>电话客户数: {item.callCount}</span>
                          </div>
                        )}
                        {item.label === '常银周周乐' && (
                          <div className="text-[8px] font-bold text-slate-500">
                            生日活动数: {item.birthdayCount}（目标 {item.birthdayTarget}）
                          </div>
                        )}
                        {metricTab === 'core' && (
                          <div>
                            <div className="flex items-center justify-between text-[8px] font-bold text-slate-400 mb-1">
                              <span>{rateLabel}</span>
                              <span>{item.rate}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  item.type === 'success'
                                    ? 'bg-emerald-500'
                                    : item.type === 'warning'
                                    ? 'bg-amber-500'
                                    : 'bg-rose-500'
                                }`}
                                style={{ width: `${item.rate}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 趋势图 */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col flex-1">
              <div className="mb-3">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center">
                  <span className="w-1.5 h-2.5 bg-blue-600 rounded-full mr-2"></span>
                  {metricTab === 'core' ? '核心指标趋势' : metricTab === 'base' ? '基础指标趋势' : '其他指标趋势'}
                  <span className="ml-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    {reportPeriodLabel}
                  </span>
                </h4>
              </div>
              <div className="h-[220px] min-h-[260px] w-full bg-slate-50 rounded-lg p-3 border border-slate-100 flex-1">
                <ResponsiveContainer width="100%" height="100%" minHeight={260} minWidth={0}>
                  <LineChart data={metricTab === 'core' ? coreTrendData : metricTab === 'base' ? baseTrendData : otherTrendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 9, fontWeight: '900'}} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 8, fontWeight: '900'}} 
                    />
                    <Tooltip 
                      cursor={{stroke: '#e2e8f0', strokeWidth: 1}} 
                      content={metricTab === 'core' ? renderCoreTooltip : undefined}
                      contentStyle={metricTab === 'core' ? undefined : {borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px -2px rgb(0 0 0 / 0.1)', fontSize: '11px', fontWeight: 'bold', backgroundColor: '#fff'}} 
                    />
                    <Line
                      type="monotone"
                      dataKey={selectedMetricKey}
                      stroke="#3b82f6"
                      strokeWidth={1.5}
                      dot={{fill: '#3b82f6', r: 3}}
                      activeDot={{r: 4}}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* 右侧：AI智慧督导建议 (1/3 宽度) */}
          <div className="xl:col-span-1">
            <div className="bg-[#1e293b] text-white rounded-2xl p-6 shadow-2xl h-full flex flex-col relative overflow-hidden border border-white/10">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none transform rotate-12 scale-150">
                <ICONS.AI />
              </div>
              
              <div className="relative z-10 flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <ICONS.AI />
                </div>
                <div>
                  <h2 className="text-lg font-black tracking-tight uppercase">AI 智慧督导</h2>
                  <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Supervisor System</p>
                </div>
              </div>

              <div className="space-y-6 flex-1 relative z-10 overflow-y-auto pr-2 custom-scrollbar">
                {/* 督导建议 1 */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4 hover:bg-white/10 transition-colors">
                  <div className="flex justify-between items-center" />
                  <h4 className="text-sm font-bold text-slate-100">重点督导：产品(理财/储蓄)到期精准挽留</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">检测到本周网点存续理财到期规模 1.2亿，流失风险评级为“极高”。建议优先处理高优先级商机。</p>
                  
                  {/* 关联商机 */}
                  <div className="bg-slate-900/50 rounded-xl p-3 border border-white/5">
                    <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-3 flex items-center">
                      <span className="w-1 h-3 bg-blue-500 rounded-full mr-1.5"></span>
                      关联商机 (商机平台)
                    </div>
                    <div className="grid grid-cols-[1.4fr_0.8fr_0.8fr_0.9fr] text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">
                      <span>商机名称</span>
                      <span className="text-center">客户数</span>
                      <span className="text-center">优先级调整</span>
                      <span className="text-center">触达率</span>
                    </div>
                    <div className="space-y-2">
                      {getSortedOpportunityRows(retentionOpportunityRows).map((row) => {
                        const touchSummary = getTouchRateSummary(row.id, row.customers);
                        const touchDetails = getTouchRateDetail(row.id, touchSummary.total);
                        return (
                        <div key={row.id} className="grid grid-cols-[1.4fr_0.8fr_0.8fr_0.9fr] items-center text-[10px] text-slate-300">
                          <span className="font-bold text-slate-100">{row.name}</span>
                          <span className="text-center text-slate-200 font-bold">{row.customers}</span>
                          <div className="flex items-center justify-center">
                            <select
                              value={getPriorityValue(row.id)}
                              onChange={(event) => handlePriorityChange(row.id, event.target.value as 'important' | 'nonimportant')}
                              className="px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/10 bg-white/10 text-slate-100 focus:outline-none"
                            >
                              <option value="important">重要</option>
                              <option value="nonimportant">非重要</option>
                            </select>
                          </div>
                          <div className="relative flex justify-center">
                            <button
                              type="button"
                              onClick={() => setOpenTouchRateId(openTouchRateId === row.id ? null : row.id)}
                              className="px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/10 bg-white/10 hover:bg-white/15"
                            >
                              {touchSummary.text}
                            </button>
                            {openTouchRateId === row.id && (
                              <div className="absolute top-7 z-10 w-56 rounded-lg bg-slate-900/95 border border-white/10 p-2 shadow-lg text-left">
                                <div className="grid grid-cols-[1fr_1fr] text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                  <span>客户经理</span>
                                  <span className="text-right">进度</span>
                                </div>
                                {touchDetails.map((detail) => (
                                  <div key={detail.name} className="grid grid-cols-[1fr_1fr] text-[10px] font-bold text-slate-200">
                                    <span>{detail.name}</span>
                                    <span className="text-right">{detail.progress}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )})}
                    </div>
                  </div>
                </div>

                {/* 督导建议 2 */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4 opacity-70 hover:opacity-100 transition-all">
                  <div className="flex justify-between items-center" />
                  <h4 className="text-sm font-bold text-slate-100">客群拓深：价值客户升级跃迁(银燕升金燕)</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">识别出 156 名银燕客户升级到金燕，AUM(月) 集中在 500w-600w 区间。</p>
                  
                  <div className="bg-slate-900/50 rounded-xl p-3 border border-white/5">
                    <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-3 flex items-center">
                      <span className="w-1 h-3 bg-blue-500 rounded-full mr-1.5"></span>
                      关联商机 (商机平台)
                    </div>
                  <div className="grid grid-cols-[1.4fr_0.8fr_0.8fr_0.9fr] text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">
                    <span>商机名称</span>
                    <span className="text-center">客户数</span>
                    <span className="text-center">优先级调整</span>
                    <span className="text-center">触达率</span>
                  </div>
                  <div className="space-y-2">
                    {getSortedOpportunityRows(upgradeOpportunityRows).map((row) => {
                      const touchSummary = getTouchRateSummary(row.id, row.customers);
                      const touchDetails = getTouchRateDetail(row.id, touchSummary.total);
                      return (
                      <div key={row.id} className="grid grid-cols-[1.4fr_0.8fr_0.8fr_0.9fr] items-center text-[10px] text-slate-300">
                        <span className="font-bold text-slate-100">{row.name}</span>
                        <span className="text-center text-emerald-300 font-bold">{row.customers}</span>
                        <div className="flex items-center justify-center">
                          <select
                            value={getPriorityValue(row.id)}
                            onChange={(event) => handlePriorityChange(row.id, event.target.value as 'important' | 'nonimportant')}
                            className="px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/10 bg-white/10 text-slate-100 focus:outline-none"
                          >
                            <option value="important">重要</option>
                            <option value="nonimportant">非重要</option>
                          </select>
                        </div>
                        <div className="relative flex justify-center">
                          <button
                            type="button"
                            onClick={() => setOpenTouchRateId(openTouchRateId === row.id ? null : row.id)}
                            className="px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/10 bg-white/10 hover:bg-white/15"
                          >
                            {touchSummary.text}
                          </button>
                          {openTouchRateId === row.id && (
                            <div className="absolute top-7 z-10 w-56 rounded-lg bg-slate-900/95 border border-white/10 p-2 shadow-lg text-left">
                              <div className="grid grid-cols-[1fr_1fr] text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                <span>客户经理</span>
                                <span className="text-right">进度</span>
                              </div>
                              {touchDetails.map((detail) => (
                                <div key={detail.name} className="grid grid-cols-[1fr_1fr] text-[10px] font-bold text-slate-200">
                                  <span>{detail.name}</span>
                                  <span className="text-right">{detail.progress}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )})}
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. 客户经理排名、预警 (全宽) */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center">
              <span className="w-1.5 h-4 bg-amber-500 rounded-full mr-2"></span>
              家金经理效能排名 & 预警
            </h3>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full p-1 text-[10px] font-black uppercase tracking-widest">
                <button
                  onClick={() => setReportPeriod('day')}
                  className={`px-3 py-1 rounded-full transition-colors ${
                    reportPeriod === 'day'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  昨日
                </button>
                <button
                  onClick={() => setReportPeriod('week')}
                  className={`px-3 py-1 rounded-full transition-colors ${
                    reportPeriod === 'week'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  本周
                </button>
                <button
                  onClick={() => setReportPeriod('month')}
                  className={`px-3 py-1 rounded-full transition-colors ${
                    reportPeriod === 'month'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  本月
                </button>
              </div>
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full p-1 text-[10px] font-black uppercase tracking-widest">
                <button
                  onClick={() => setRankScope('region')}
                  className={`px-3 py-1 rounded-full transition-colors ${
                    rankScope === 'region'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  所在地区排名
                </button>
                <button
                  onClick={() => setRankScope('bank')}
                  className={`px-3 py-1 rounded-full transition-colors ${
                    rankScope === 'bank'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  全行排名
                </button>
              </div>
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full p-1 text-[10px] font-black uppercase tracking-widest">
                <button
                  onClick={() => setRankStatusFilter('all')}
                  className={`px-3 py-1 rounded-full transition-colors ${
                    rankStatusFilter === 'all'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  全部
                </button>
                <button
                  onClick={() => setRankStatusFilter('normal')}
                  className={`px-3 py-1 rounded-full transition-colors ${
                    rankStatusFilter === 'normal'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  正常
                </button>
                <button
                  onClick={() => setRankStatusFilter('warning')}
                  className={`px-3 py-1 rounded-full transition-colors ${
                    rankStatusFilter === 'warning'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  黄灯
                </button>
                <button
                  onClick={() => setRankStatusFilter('critical')}
                  className={`px-3 py-1 rounded-full transition-colors ${
                    rankStatusFilter === 'critical'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  红灯
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto overflow-y-auto max-h-[360px]">
            <table className="w-full min-w-[1200px] text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] border-b border-slate-100">
                <tr>
                  <th className="px-6 py-5">Rank</th>
                  <th className="px-6 py-5">红黄灯</th>
                  <th className="px-6 py-5">客户经理</th>
                  <th className="px-6 py-5">所在地区</th>
                  <th className="px-6 py-5">
                    <button
                      type="button"
                      onClick={() => setRankSortKey('wealthIncome')}
                      className={`flex items-center gap-1 text-left ${
                        rankSortKey === 'wealthIncome' ? 'text-slate-700' : 'text-slate-400'
                      }`}
                    >
                      财富中收
                      <span className="text-[9px]">↓</span>
                    </button>
                  </th>
                  <th className="px-6 py-5">
                    <button
                      type="button"
                      onClick={() => setRankSortKey('wealthNetIncrease')}
                      className={`flex items-center gap-1 text-left ${
                        rankSortKey === 'wealthNetIncrease' ? 'text-slate-700' : 'text-slate-400'
                      }`}
                    >
                      理财日均净增
                      <span className="text-[9px]">↓</span>
                    </button>
                  </th>
                  <th className="px-6 py-5">
                    <span className="inline-flex items-center gap-1">
                      余额净增
                      <span className="text-[9px]">↓</span>
                    </span>
                  </th>
                  <th className="px-6 py-5">
                    <span className="inline-flex items-center gap-1">
                      新开卡净增
                      <span className="text-[9px]">↓</span>
                    </span>
                  </th>
                  <th className="px-6 py-5">
                    <span className="inline-flex items-center gap-1">
                      财富客户数净增
                      <span className="text-[9px]">↓</span>
                    </span>
                  </th>
                  <th className="px-6 py-5">总得分</th>
                  <th className="px-6 py-5">AI 画像描述 (Performance Portrait)</th>
                  <th className="px-6 py-5 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 whitespace-nowrap">
                {displayRankList.map((rm) => (
                  <tr key={rm.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-5 text-center whitespace-nowrap">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black shadow-sm mx-auto ${
                        rm.rank === 1 ? 'bg-amber-100 text-amber-700 border border-amber-200' : 
                        rm.rank === 2 ? 'bg-slate-100 text-slate-600 border border-slate-200' :
                        'text-slate-400 border border-slate-100'
                      }`}>
                        {rm.rank}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          rm.status === 'critical' ? 'bg-rose-500' : 
                          rm.status === 'warning' ? 'bg-amber-500' : 
                          'bg-emerald-500'
                        }`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                          rm.status === 'critical' ? 'text-rose-600' : 
                          rm.status === 'warning' ? 'text-amber-600' : 
                          'text-emerald-600'
                        }`}>
                          {rm.status === 'critical' ? '红灯' : rm.status === 'warning' ? '黄灯' : '正常'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center space-x-4">
                        <img src={rm.avatar} className="w-10 h-10 rounded-2xl shadow-sm group-hover:scale-105 transition-transform border border-slate-100" alt="" />
                        <div>
                          <p className="text-sm font-bold text-slate-900 leading-none mb-1">{rm.name}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{rm.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center whitespace-nowrap">
                      <span className="text-[11px] font-bold text-slate-600">{rm.region}</span>
                    </td>
                    <td className="px-6 py-5 text-center whitespace-nowrap">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-black text-slate-900">{rm.wealthIncome}</span>
                        <span className="text-[9px] text-slate-400">达成率 {rm.wealthIncomeRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center whitespace-nowrap">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-black text-slate-900">{rm.wealthNetIncrease}</span>
                        <span className="text-[9px] text-slate-400">达成率 {rm.wealthNetIncreaseRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center whitespace-nowrap">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-black text-slate-900">￥{(rm.wealthNetIncreaseRate * 0.08).toFixed(1)}亿</span>
                        <span className="text-[9px] text-slate-400">达成率 {rm.wealthNetIncreaseRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center whitespace-nowrap">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-black text-slate-900">{rm.wealthCustomerNetIncrease}</span>
                        <span className="text-[9px] text-slate-400">达成率 {rm.wealthCustomerNetIncreaseRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center whitespace-nowrap">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-black text-slate-900">{rm.wealthCustomerNetIncrease}</span>
                        <span className="text-[9px] text-slate-400">达成率 {rm.wealthCustomerNetIncreaseRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center whitespace-nowrap">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-black text-slate-900">{rm.totalScore}</span>
                        <span className="text-[9px] text-slate-400">/ 100</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-normal">
                      <p className="text-[11px] text-slate-500 leading-relaxed max-w-sm font-medium">
                        {rm.recentPerformance}
                      </p>
                    </td>
                    <td className="px-6 py-5 text-right whitespace-nowrap">
                      <button 
                        onClick={() => setSelectedRM(rm)}
                        className="text-blue-600 hover:text-blue-800 text-[10px] font-black uppercase tracking-widest border border-blue-200 px-4 py-2 rounded-xl hover:bg-blue-50 transition-all shadow-sm active:scale-95"
                      >
                        Deep Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. 客群结构画像洞察 (底部全宽) */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center">
                <span className="w-1.5 h-4 bg-indigo-500 rounded-full mr-2"></span>
                客群结构洞察
                <span className="relative group ml-2">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 text-[9px] font-black text-slate-500 bg-white cursor-default">?</span>
                  <span className="pointer-events-none absolute z-10 hidden group-hover:block -top-3 left-6 w-[360px] rounded-lg bg-slate-800 text-white text-[10px] font-bold leading-relaxed px-3 py-2 shadow-lg">
                    <span className="block">一是金燕及以上的非存客户管户经理分配率务必达到100%，并按季针对机构公共池的新客户进行二次分配；</span>
                    <span className="block">二是银燕非存客户力争管户经理分配率80%以上；</span>
                    <span className="block">三是人均非存管户常熟地区力争200户以上，非常熟地区力争100户以上，村改支机构力争50户以上；</span>
                    <span className="block">四是针对不同层级的非存客户，定期做好客户触达工作。</span>
                  </span>
                </span>
              </h3>
              <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">Customer Base Structure</p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentPage('customer')}
              className="text-[10px] font-black uppercase tracking-widest text-blue-600 border border-blue-200 px-3 py-1.5 rounded-full hover:bg-blue-50 transition-all"
            >
              详细客户洞察 →
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-[1fr_2.4fr] gap-6 items-end">
              <div></div>
              <div className="w-full">
                <div className="border-y border-slate-200 bg-slate-50/70 px-4 py-3">
                  <div className="grid grid-cols-[repeat(10,1fr)] gap-x-2 text-[12px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    <div className="text-center col-span-5">本机构</div>
                    <div className="text-center col-span-5">全行</div>
                  </div>
                </div>
                <div className="border-b border-slate-200 bg-white/80 px-4 py-2">
                  <div className="grid grid-cols-[repeat(10,1fr)] gap-x-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <div className="text-center leading-tight">客户数</div>
                    <div className="text-center leading-tight">AUM(月)</div>
                    <div className="text-center leading-tight">客户经理分配率</div>
                    <div className="text-center leading-tight">客户经理当月电访数</div>
                    <div className="text-center leading-tight">客户经理近半年面访数</div>
                    <div className="text-center leading-tight">客户数</div>
                    <div className="text-center leading-tight">AUM(月)</div>
                    <div className="text-center leading-tight">客户经理分配率</div>
                    <div className="text-center leading-tight">客户经理当月电访数</div>
                    <div className="text-center leading-tight">客户经理近半年面访数</div>
                  </div>
                </div>
              </div>
            </div>

            {profileRows.map((row, index) => (
              <div key={row.label} className="relative grid grid-cols-[1fr_2.4fr] gap-6 items-center overflow-visible">
                {index > 0 && (
                  <span className="absolute left-0 right-0 top-0 border-t border-dashed border-slate-200"></span>
                )}
                <div className="h-16 flex items-center relative overflow-visible">
                  <div className="flex items-center gap-3 w-full">
                    <div
                      className={`h-10 border border-slate-200 bg-gradient-to-r ${row.tone} flex items-center justify-between text-[11px] font-black shadow-sm px-2`}
                      style={{ width: `${row.width}px`, clipPath: 'polygon(0 0, 88% 0, 100% 100%, 0 100%)' }}
                    >
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMigrationInfo(
                              openMigrationInfo?.label === row.label && openMigrationInfo?.type === 'upgrade'
                                ? null
                                : { label: row.label, type: 'upgrade' }
                            )
                          }
                          className="text-[10px] font-black text-slate-700 hover:text-blue-600"
                        >
                          （待{row.label === '尊燕' ? '降级' : '跃迁'}{row.pendingUpgrade}人）
                        </button>
                      </div>
                      <span className={row.label === '小燕' ? 'mx-auto' : ''}>{row.label}</span>
                      {!['尊燕', '小燕'].includes(row.label) && (
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenMigrationInfo(
                                openMigrationInfo?.label === row.label && openMigrationInfo?.type === 'downgrade'
                                  ? null
                                  : { label: row.label, type: 'downgrade' }
                              )
                            }
                            className="text-[10px] font-black text-slate-700 hover:text-rose-600"
                          >
                            （待降级{row.pendingDowngrade}人）
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {openMigrationInfo?.label === row.label && openMigrationInfo?.type === 'upgrade' && (
                    <div className="absolute left-2 top-12 w-44 rounded-lg border border-slate-200 bg-white p-2 shadow-lg text-[10px] font-bold text-slate-600 z-30">
                      <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">高优推荐</div>
                      {row.upgradeTop.map((name) => (
                        <div key={name} className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCustomerName(name);
                              setCurrentPage('customer');
                              setOpenMigrationInfo(null);
                            }}
                            className="text-blue-600 hover:text-blue-800 text-[10px] font-black"
                          >
                            {name}
                          </button>
                          <span className="text-slate-400">高潜</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {openMigrationInfo?.label === row.label && openMigrationInfo?.type === 'downgrade' && (
                    <div className="absolute right-2 top-12 w-44 rounded-lg border border-slate-200 bg-white p-2 shadow-lg text-[10px] font-bold text-slate-600 z-30">
                      <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">高优推荐</div>
                      {row.downgradeTop.map((name) => (
                        <div key={name} className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCustomerName(name);
                              setCurrentPage('customer');
                              setOpenMigrationInfo(null);
                            }}
                            className="text-blue-600 hover:text-blue-800 text-[10px] font-black"
                          >
                            {name}
                          </button>
                          <span className="text-slate-400">预警</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {migrationLinks[row.label] && (
                    <div className="absolute -top-3 left-6 flex items-center gap-2 text-[10px] font-bold text-slate-500">
                      <svg width="56" height="18" viewBox="0 0 56 18" fill="none">
                        <path d="M2 16 L40 2" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M40 2 L35 2 M40 2 L40 7" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <span>跃迁 {migrationLinks[row.label].count}</span>
                    </div>
                  )}
                </div>
                <div className="h-16 px-2 flex items-center">
                <div className="grid grid-cols-[repeat(10,1fr)] gap-x-2 items-center w-full text-[11px]">
                    <div className="text-center whitespace-nowrap">
                      <div className="font-bold text-slate-700 whitespace-nowrap">{formatNumberWithUnit(row.count)}</div>
                      <div className="flex items-center justify-center gap-1 text-[10px] text-rose-500 whitespace-nowrap">
                        {row.countDelta}
                        {renderDeltaHelp(profileDeltaTooltip)}
                      </div>
                    </div>
                    <div className="text-center whitespace-nowrap">
                      <div className="font-bold text-slate-700 whitespace-nowrap">{formatNumberWithUnit(row.aumLocal.replace('AUM(月):', '').trim())}</div>
                      <div className={`text-[10px] whitespace-nowrap ${row.aumLocalDelta.includes('↓') ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {row.aumLocalDelta}
                      </div>
                    </div>
                    <div className="text-center whitespace-nowrap">
                      <div className="font-bold text-slate-700 whitespace-nowrap">{row.allocationLocal}</div>
                    </div>
                    <div className="text-center whitespace-nowrap">
                      <div className="font-bold text-slate-700 whitespace-nowrap">{formatNumberWithUnit(row.callLocal)}</div>
                      <div className="flex items-center justify-center gap-1 text-[10px] text-rose-500 whitespace-nowrap">
                        {row.callLocalDelta}
                        {renderDeltaHelp(profileDeltaTooltip)}
                      </div>
                    </div>
                    <div className="text-center whitespace-nowrap">
                      <div className="font-bold text-slate-700 whitespace-nowrap">{formatNumberWithUnit(row.visitLocal)}</div>
                    </div>
                    <div className="text-center whitespace-nowrap">
                      <div className="font-bold text-slate-700 whitespace-nowrap">{formatNumberWithUnit(row.countBank)}</div>
                      <div className="flex items-center justify-center gap-1 text-[10px] text-rose-500 whitespace-nowrap">
                        {row.countBankDelta}
                        {renderDeltaHelp(profileDeltaTooltipBank)}
                      </div>
                    </div>
                    <div className="text-center whitespace-nowrap">
                      <div className="font-bold text-slate-700 whitespace-nowrap">{formatNumberWithUnit(row.aumBank.replace('AUM(月):', '').trim())}</div>
                      <div className={`text-[10px] whitespace-nowrap ${row.aumBankDelta.includes('↓') ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {row.aumBankDelta}
                      </div>
                    </div>
                    <div className="text-center whitespace-nowrap">
                      <div className="font-bold text-slate-700 whitespace-nowrap">{row.allocationBank}</div>
                    </div>
                    <div className="text-center whitespace-nowrap">
                      <div className="font-bold text-slate-700 whitespace-nowrap">{formatNumberWithUnit(row.callBank)}</div>
                      <div className="flex items-center justify-center gap-1 text-[10px] text-rose-500 whitespace-nowrap">
                        {row.callBankDelta}
                        {renderDeltaHelp(profileDeltaTooltipBank)}
                      </div>
                    </div>
                    <div className="text-center whitespace-nowrap">
                      <div className="font-bold text-slate-700 whitespace-nowrap">{formatNumberWithUnit(row.visitBank)}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        </div>
          </div>
          </>
        )}

        {/* 页面2: 家金每日早报 (客户经理工作台) */}
        {currentPage === 'manager' && (
          <div className="p-0">
            <ManagerApp
              managerName={selectedManager?.name || '客户经理'}
              managerId={loggedInManagerId}
              managerRegion={selectedManager?.region}
              managerOpportunities={managerOpportunities[loggedInManagerId] ?? []}
              onOpenCustomerInsight={handleOpenCustomerInsight}
            />
          </div>
        )}

        {/* 页面3: 智能客户洞察 */}
        {currentPage === 'customer' && (
          <div className="p-0">
            <iframe 
              src={`AI_customer_insight.html${selectedCustomerName ? `?customerName=${encodeURIComponent(selectedCustomerName)}` : ''}`} 
              style={{
                width: '100%',
                height: '100vh',
                border: 'none',
                display: 'block'
              }}
              title="AI Customer Insight"
            />
          </div>
        )}

      </main>

      {/* RM Profile Drawer (Modal) */}
      {selectedRM && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-md transition-opacity duration-300">
          <div className="w-full max-w-md h-full bg-white shadow-2xl p-10 overflow-y-auto animate-fade-in-right border-l border-slate-200">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest underline decoration-blue-500 decoration-4 underline-offset-8">RM DEEP ANALYSIS</h2>
              <button onClick={() => setSelectedRM(null)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 hover:text-slate-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex flex-col items-center text-center space-y-6 mb-12">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{selectedRM.name}</h3>
                <p className="text-xs text-blue-600 font-black uppercase tracking-[0.4em] mt-2">{selectedRM.role}</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {selectedRM.tags.map(tag => (
                  <span key={tag} className="px-5 py-1.5 bg-slate-50 border border-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest">{tag}</span>
                ))}
              </div>
            </div>

            <div className="space-y-10">
              <div className="space-y-4">
                <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.3em] px-2 flex items-center">
                  <span className="w-1 h-4 bg-blue-600 rounded mr-3"></span>
                  核心指标表现
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {coreMetrics.map((metric) => {
                    const tone = metric.type === 'success' ? 'emerald' : metric.type === 'warning' ? 'amber' : 'rose';
                    return (
                      <div
                        key={metric.label}
                        className="text-left p-3 rounded-xl border bg-white/80 flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{metric.label}</span>
                          <div className={`w-2 h-2 rounded-full ${
                            tone === 'emerald'
                              ? 'bg-emerald-500'
                              : tone === 'amber'
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`} />
                        </div>
                        <div className="flex items-baseline justify-between gap-2">
                          <div className="text-sm font-black text-slate-900 tracking-tight">{metric.current}</div>
                          <div className="text-[8px] text-slate-400 font-bold whitespace-nowrap">目标: {metric.target}</div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-[8px] font-bold text-slate-400 mb-1">
                            <span>完成率</span>
                            <span>{metric.rate}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                tone === 'emerald'
                                  ? 'bg-emerald-500'
                                  : tone === 'amber'
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${metric.rate}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Performance Diagnostic */}
              <div className="bg-[#1e293b] p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 transform scale-150 rotate-12 group-hover:scale-175 transition-transform duration-700">
                  <ICONS.AI />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-6 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></span>
                  AI PERFORMANCE DIAGNOSTIC
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed font-bold italic relative z-10">
                  “{selectedRM.recentPerformance}”
                </p>
              </div>

              {/* Action Plan */}
              <div className="space-y-6">
                <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.3em] px-2 flex items-center">
                  <span className="w-1 h-4 bg-blue-600 rounded mr-3"></span>
                  支行长督导计划 (Action Plan)
                </h4>
                <div className="grid grid-cols-1 gap-5">
                  <div className="p-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] hover:bg-white hover:shadow-xl transition-all duration-300 group">
                    <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-2 group-hover:text-blue-600 transition-colors">技能赋能：话术演练</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">针对陈思的理财规模回吐，安排本周四进行针对性‘资产保卫’话术模拟。</p>
                  </div>
                  <div className="p-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] hover:bg-white hover:shadow-xl transition-all duration-300 group">
                    <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-2 group-hover:text-amber-500 transition-colors">管理支撑：陪同面谈</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">该经理手中有多笔高净值理财到期，建议支行长于下周二陪同走访核心客户。</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Internal Components
const NavItem: React.FC<{ icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-4 p-4 rounded-[1.25rem] transition-all group ${
    active ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/50 scale-105' : 'text-slate-500 hover:bg-white/5 hover:text-white'
  }`}>
    <div className={`shrink-0 transition-transform group-hover:scale-110`}>{icon}</div>
    <span className="hidden lg:block text-[11px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default App;
