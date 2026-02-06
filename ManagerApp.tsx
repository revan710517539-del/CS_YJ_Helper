import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ICONS, COLORS } from './constants';
import { OpportunityItem } from './types';

// 模拟数据 - 所有客户经理信息
const MOCK_RM_LIST = [
  { id: '1', name: '王静', avatar: 'https://picsum.photos/seed/rm1/100', role: '财富经理', region: '常熟中心区', wealthIncome: '￥3.6M', wealthIncomeRate: 96, wealthNetIncrease: '￥1.1M', wealthNetIncreaseRate: 88, wealthCustomerNetIncrease: '18户', wealthCustomerNetIncreaseRate: 92, completionRate: 92, predictedRate: 105, status: 'normal', rank: 1, tags: ['高产', '稳健'], recentPerformance: '财富中收表现卓越，存量转化率全行第一，建议作为标杆推广经验。', yearTargetRate: 88, monthTargetRate: 94, yearSignal: 'yellow', monthSignal: 'yellow', totalScore: 92 },
  { id: '2', name: '李强', avatar: 'https://picsum.photos/seed/rm2/100', role: '资深客户经理', region: '常熟新区', wealthIncome: '￥2.4M', wealthIncomeRate: 74, wealthNetIncrease: '￥0.6M', wealthNetIncreaseRate: 68, wealthCustomerNetIncrease: '9户', wealthCustomerNetIncreaseRate: 62, completionRate: 78, predictedRate: 85, status: 'warning', rank: 4, tags: ['资深', '大户型'], recentPerformance: '核心客户数净增遇颈瓶，近期拓客动作偏少，需关注流失预警。', yearTargetRate: 67, monthTargetRate: 72, yearSignal: 'red', monthSignal: 'yellow', totalScore: 78 },
  { id: '3', name: '陈思', avatar: 'https://picsum.photos/seed/rm3/100', role: '财富顾问', region: '常熟城西', wealthIncome: '￥1.1M', wealthIncomeRate: 45, wealthNetIncrease: '￥0.2M', wealthNetIncreaseRate: 39, wealthCustomerNetIncrease: '4户', wealthCustomerNetIncreaseRate: 41, completionRate: 45, predictedRate: 65, status: 'critical', rank: 8, tags: ['潜力', '新人'], recentPerformance: '理财日均大幅回吐，存续产品到期流失严重，急需总对总面谈支持。', yearTargetRate: 52, monthTargetRate: 58, yearSignal: 'red', monthSignal: 'red', totalScore: 45 },
];

// 模拟数据
const MOCK_TASKS = [
  { 
    id: '1', 
    title: '理财到期精准挽留', 
    description: '检测到本周网点存续理财到期规模 1.2亿，流失风险评级为"极高"',
    relatedCustomers: '42户', 
    priority: 'high', 
    status: 'pending',
    executionStrategy: '明天10:00前完成3个重点客户的电话回访，建议使用"资产保卫"话术演练中的技巧'
  },
  { 
    id: '2', 
    title: '核心客户私行升级', 
    description: '识别出156名高潜力升级客户，AUM(月)集中在500w-600w区间',
    relatedCustomers: '156户', 
    priority: 'medium',
    status: 'pending',
    executionStrategy: '择机对AUM(月)>500w的客户发起私行产品推介，预计转化率35%'
  },
  { 
    id: '3', 
    title: '睡眠客户激活行动', 
    description: '本周睡眠客户数增加12户，需要进行针对性激活',
    relatedCustomers: '28户', 
    priority: 'medium',
    status: 'pending',
    executionStrategy: '发起定向营销活动，准备权益兑换清单和新产品推介材料'
  },
];

const MOCK_CUSTOMERS = [
  { 
    id: '1', 
    name: '张先生', 
    aum: 2450, 
    activity: 85, 
    monthlyTxnCount: 26,
    level: '金燕',
    called: true,
    visited: true,
    location: 'local',
    assetChange: '+12%', 
    productPenetration: 68,
    lastInteraction: '2天前'
  },
  { 
    id: '001234567', 
    name: '郭家豪', 
    aum: 300, 
    activity: 85, 
    monthlyTxnCount: 26,
    level: '钻燕',
    called: true,
    visited: true,
    location: 'local',
    assetChange: '+45%', 
    productPenetration: 68,
    lastInteraction: '2天前'
  },
  { 
    id: '2', 
    name: '李女士', 
    aum: 1680, 
    activity: 62, 
    monthlyTxnCount: 14,
    level: '银燕',
    called: true,
    visited: false,
    location: 'remote',
    assetChange: '-3%', 
    productPenetration: 45,
    lastInteraction: '5天前'
  },
  { 
    id: '3', 
    name: '王总', 
    aum: 3200, 
    activity: 92, 
    monthlyTxnCount: 31,
    level: '尊燕',
    called: true,
    visited: true,
    location: 'local',
    assetChange: '+28%', 
    productPenetration: 82,
    lastInteraction: '昨日'
  },
  { 
    id: '4', 
    name: '陈女士', 
    aum: 950, 
    activity: 38, 
    monthlyTxnCount: 8,
    level: '小燕',
    called: false,
    visited: false,
    location: 'remote',
    assetChange: '-8%', 
    productPenetration: 25,
    lastInteraction: '10天前'
  },
  { 
    id: '5', 
    name: '孙先生', 
    aum: 5100, 
    activity: 78, 
    monthlyTxnCount: 22,
    level: '钻燕',
    called: true,
    visited: true,
    location: 'local',
    assetChange: '+45%', 
    productPenetration: 91,
    lastInteraction: '1天前'
  },
];

const TOUCH_HISTORY_MAP: Record<string, { count: number; managers: { name: string; tag: string; time: string }[] }> = {
  '1': {
    count: 5,
    managers: [
      { name: '王静', tag: '重点维护', time: '2026-01-18' },
      { name: '李强', tag: '高净值', time: '2026-01-12' },
    ],
  },
  '001234567': {
    count: 3,
    managers: [
      { name: '陈思', tag: '到期续作', time: '2026-01-09' },
    ],
  },
  '2': {
    count: 2,
    managers: [
      { name: '王静', tag: '潜力提升', time: '2026-01-06' },
    ],
  },
  '3': {
    count: 4,
    managers: [
      { name: '李强', tag: '流失预警', time: '2026-01-11' },
      { name: '王静', tag: '自定义标签', time: '2026-01-04' },
    ],
  },
  '4': {
    count: 1,
    managers: [
      { name: '陈思', tag: '重点维护', time: '2026-01-02' },
    ],
  },
};

const OPPORTUNITY_MAP: Record<string, { items: { id: string; name: string; createdAt: string; url: string }[] }> = {
  '1': {
    items: [
      { id: 'opp-101', name: '高净值续作提醒', createdAt: '2026-01-28', url: '/opportunity/opp-101' },
      { id: 'opp-102', name: '资产增配推进', createdAt: '2026-01-30', url: '/opportunity/opp-102' },
    ],
  },
  '001234567': {
    items: [
      { id: 'opp-201', name: '到期续作关怀', createdAt: '2026-01-26', url: '/opportunity/opp-201' },
    ],
  },
  '2': {
    items: [
      { id: 'opp-301', name: '流动性补强方案', createdAt: '2026-01-24', url: '/opportunity/opp-301' },
      { id: 'opp-302', name: '现金管理组合升级', createdAt: '2026-01-29', url: '/opportunity/opp-302' },
      { id: 'opp-303', name: '短持产品续投', createdAt: '2026-01-31', url: '/opportunity/opp-303' },
    ],
  },
  '3': {
    items: [
      { id: 'opp-401', name: '私行升级沟通', createdAt: '2026-01-27', url: '/opportunity/opp-401' },
      { id: 'opp-402', name: '高端理财续作', createdAt: '2026-01-30', url: '/opportunity/opp-402' },
    ],
  },
  '5': {
    items: [
      { id: 'opp-501', name: '资产增配推进', createdAt: '2026-01-25', url: '/opportunity/opp-501' },
    ],
  },
};

const OPPORTUNITY_REWARD_MAP: Record<string, number> = {
  'branch-1': 300,
  'branch-2': 300,
  'branch-4': 300,
  'opt-fixed-1': 300,
  'opt-1': 300,
  'opp-1': 300,
  'opp-2': 300,
};

const TAG_OPTIONS = ['重点维护', '潜力提升', '到期续作', '高净值', '流失预警'];

const ACTIVITY_TREND = [
  { day: '本周一', value: 58 },
  { day: '本周二', value: 65 },
  { day: '本周三', value: 72 },
  { day: '本周四', value: 68 },
  { day: '本周五', value: 82 },
  { day: '本周六', value: 75 },
  { day: '昨日', value: 88 },
];

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
  { day: '本周一', '零售客户数': 120.2, '理财余额': 3.1, '储蓄余额': 12.2, '新开卡客户数': 18 },
  { day: '本周二', '零售客户数': 120.6, '理财余额': 3.2, '储蓄余额': 12.3, '新开卡客户数': 21 },
  { day: '本周三', '零售客户数': 121.1, '理财余额': 3.3, '储蓄余额': 12.4, '新开卡客户数': 26 },
  { day: '本周四', '零售客户数': 121.4, '理财余额': 3.2, '储蓄余额': 12.5, '新开卡客户数': 24 },
  { day: '本周五', '零售客户数': 121.8, '理财余额': 3.4, '储蓄余额': 12.6, '新开卡客户数': 28 },
  { day: '本周六', '零售客户数': 122.1, '理财余额': 3.5, '储蓄余额': 12.7, '新开卡客户数': 31 },
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

const OTHER_METRICS_TREND_DAY = [
  { day: '本周一', '资产日均净增': 2.1, '机构储蓄日均净增': 1.05, '客户触达': 60, '常银周周乐': 1, '储蓄存款': 1.12, '个贷余额': 5.8, 'AUM(月)总额': 8.0 },
  { day: '本周二', '资产日均净增': 2.3, '机构储蓄日均净增': 1.08, '客户触达': 62, '常银周周乐': 1, '储蓄存款': 1.14, '个贷余额': 5.95, 'AUM(月)总额': 8.15 },
  { day: '本周三', '资产日均净增': 2.5, '机构储蓄日均净增': 1.1, '客户触达': 63, '常银周周乐': 2, '储蓄存款': 1.17, '个贷余额': 6.05, 'AUM(月)总额': 8.3 },
  { day: '本周四', '资产日均净增': 2.2, '机构储蓄日均净增': 1.12, '客户触达': 61, '常银周周乐': 2, '储蓄存款': 1.19, '个贷余额': 6.15, 'AUM(月)总额': 8.42 },
  { day: '本周五', '资产日均净增': 2.4, '机构储蓄日均净增': 1.15, '客户触达': 64, '常银周周乐': 3, '储蓄存款': 1.21, '个贷余额': 6.18, 'AUM(月)总额': 8.48 },
  { day: '本周六', '资产日均净增': 2.6, '机构储蓄日均净增': 1.18, '客户触达': 66, '常银周周乐': 3, '储蓄存款': 1.23, '个贷余额': 6.22, 'AUM(月)总额': 8.52 },
  { day: '昨日', '资产日均净增': 2.8, '机构储蓄日均净增': 1.2, '客户触达': 68, '常银周周乐': 4, '储蓄存款': 1.24, '个贷余额': 6.24, 'AUM(月)总额': 8.5 },
];

const OTHER_METRICS_TREND_WEEK = [
  { day: '周一', '资产日均净增': 2.3, '机构储蓄日均净增': 1.08, '客户触达': 62, '常银周周乐': 1, '储蓄存款': 1.18, '个贷余额': 6.05, 'AUM(月)总额': 8.22 },
  { day: '周二', '资产日均净增': 2.4, '机构储蓄日均净增': 1.1, '客户触达': 64, '常银周周乐': 1, '储蓄存款': 1.19, '个贷余额': 6.12, 'AUM(月)总额': 8.30 },
  { day: '周三', '资产日均净增': 2.5, '机构储蓄日均净增': 1.12, '客户触达': 66, '常银周周乐': 2, '储蓄存款': 1.20, '个贷余额': 6.18, 'AUM(月)总额': 8.36 },
  { day: '周四', '资产日均净增': 2.6, '机构储蓄日均净增': 1.14, '客户触达': 67, '常银周周乐': 2, '储蓄存款': 1.21, '个贷余额': 6.20, 'AUM(月)总额': 8.40 },
  { day: '周五', '资产日均净增': 2.7, '机构储蓄日均净增': 1.16, '客户触达': 68, '常银周周乐': 3, '储蓄存款': 1.22, '个贷余额': 6.22, 'AUM(月)总额': 8.45 },
  { day: '周六', '资产日均净增': 2.4, '机构储蓄日均净增': 1.12, '客户触达': 61, '常银周周乐': 1, '储蓄存款': 1.20, '个贷余额': 6.16, 'AUM(月)总额': 8.38 },
  { day: '周日', '资产日均净增': 2.2, '机构储蓄日均净增': 1.08, '客户触达': 58, '常银周周乐': 1, '储蓄存款': 1.18, '个贷余额': 6.10, 'AUM(月)总额': 8.32 },
];

const OTHER_METRICS_TREND_MONTH = [
  { day: '1月', '资产日均净增': 21.3, '机构储蓄日均净增': 10.5, '客户触达': 1860, '常银周周乐': 6, '储蓄存款': 12.8, '个贷余额': 54.2, 'AUM(月)总额': 85.1 },
  { day: '2月', '资产日均净增': 22.1, '机构储蓄日均净增': 11.2, '客户触达': 2010, '常银周周乐': 7, '储蓄存款': 24.3, '个贷余额': 58.6, 'AUM(月)总额': 92.4 },
  { day: '3月', '资产日均净增': 23.8, '机构储蓄日均净增': 12.0, '客户触达': 2180, '常银周周乐': 8, '储蓄存款': 36.9, '个贷余额': 62.4, 'AUM(月)总额': 101.6 },
  { day: '4月', '资产日均净增': 24.6, '机构储蓄日均净增': 12.6, '客户触达': 2320, '常银周周乐': 9, '储蓄存款': 49.1, '个贷余额': 66.8, 'AUM(月)总额': 110.8 },
  { day: '5月', '资产日均净增': 25.4, '机构储蓄日均净增': 13.1, '客户触达': 2460, '常银周周乐': 10, '储蓄存款': 61.7, '个贷余额': 70.4, 'AUM(月)总额': 118.9 },
  { day: '6月', '资产日均净增': 26.0, '机构储蓄日均净增': 13.7, '客户触达': 2620, '常银周周乐': 11, '储蓄存款': 74.3, '个贷余额': 74.9, 'AUM(月)总额': 126.7 },
];

const OTHER_METRICS_TREND_YEAR = [
  { day: '2022', '资产日均净增': 180.2, '机构储蓄日均净增': 98.6, '客户触达': 15200, '常银周周乐': 36, '储蓄存款': 210.5, '个贷余额': 520.8, 'AUM(月)总额': 860.0 },
  { day: '2023', '资产日均净增': 192.4, '机构储蓄日均净增': 104.3, '客户触达': 16850, '常银周周乐': 41, '储蓄存款': 238.7, '个贷余额': 566.2, 'AUM(月)总额': 930.4 },
  { day: '2024', '资产日均净增': 208.6, '机构储蓄日均净增': 112.9, '客户触达': 18520, '常银周周乐': 46, '储蓄存款': 265.9, '个贷余额': 612.1, 'AUM(月)总额': 1002.8 },
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

const BASE_METRIC_POOL = ['零售客户数', '理财余额', '储蓄余额', '新开卡客户数'] as const;

const OTHER_METRICS = [
  {
    id: 'asset-daily',
    name: '资产日均净增',
    value: { day: '￥0.23亿', month: '￥2.30亿', year: '￥18.40亿' },
    target: { day: '￥0.30亿', month: '￥3.00亿', year: '￥24.00亿' },
    rate: 78.1,
    score: 86,
    type: 'success',
  },
  {
    id: 'org-saving-daily',
    name: '机构储蓄日均净增',
    value: { day: '￥1.24亿', month: '￥12.40亿', year: '￥108.00亿' },
    target: { day: '￥1.36亿', month: '￥13.60亿', year: '￥120.00亿' },
    rate: 91.2,
    score: 95,
    type: 'success',
  },
  {
    id: 'touch',
    name: '客户触达',
    value: { day: '100人', month: '1,860人', year: '18,520人' },
    target: { day: '85人', month: '2,400人', year: '24,000人' },
    rate: 76.0,
    score: 80,
    type: 'warning',
    walkinCount: 42,
    callCount: 58,
  },
  {
    id: 'weekly-cy',
    name: '常银周周乐',
    value: { day: '2场', month: '6场', year: '38场' },
    target: { day: '4场/月', month: '8场', year: '48场' },
    rate: 59.2,
    score: 66,
    type: 'warning',
    birthdayCount: 1,
    birthdayTarget: '1场/月',
  },
];

const OTHER_METRIC_POOL = OTHER_METRICS.map((metric) => metric.name);

interface ManagerAppProps {
  managerName?: string;
  managerId?: string;
  managerRegion?: string;
  managerOpportunities?: OpportunityItem[];
  onOpenCustomerInsight?: (customerName: string) => void;
  onAbandonBranchOpportunity?: (supervisionId: string, managerName: string) => void;
}

const ManagerApp: React.FC<ManagerAppProps> = ({
  managerName = '客户经理',
  managerId,
  managerRegion,
  managerOpportunities = [],
  onOpenCustomerInsight,
  onAbandonBranchOpportunity,
}) => {
  const [optTask, oppTask, riskTask] = MOCK_TASKS;
  const recentOpportunities = managerOpportunities.slice(0, 4);
  const [metricTab, setMetricTab] = useState<'core' | 'base' | 'other'>('core');
  const [selectedCoreMetricKey, setSelectedCoreMetricKey] = useState<string>('财富中收');
  const [selectedBaseMetricKey, setSelectedBaseMetricKey] = useState<string>('零售客户数');
  const [selectedOtherMetricKey, setSelectedOtherMetricKey] = useState<string>(OTHER_METRICS[0].name);
  const [reportPeriod, setReportPeriod] = useState<'day' | 'week' | 'month' | 'year'>('day');
  const [touchLocationFilter, setTouchLocationFilter] = useState<'local' | 'remote'>('local');
  const [segmentLocationFilter, setSegmentLocationFilter] = useState<'local' | 'remote'>('local');
  const [listLocationFilter, setListLocationFilter] = useState<'local' | 'remote'>('local');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [customerTags, setCustomerTags] = useState<Record<string, string>>({});
  const [editingCustomTagId, setEditingCustomTagId] = useState<string | null>(null);
  const [customTagDraft, setCustomTagDraft] = useState<string>('');
  const [openTouchHistoryId, setOpenTouchHistoryId] = useState<string | null>(null);
  const [openOpportunityId, setOpenOpportunityId] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [showBaseMetricPool, setShowBaseMetricPool] = useState<boolean>(false);
  const [showOtherMetricPool, setShowOtherMetricPool] = useState<boolean>(false);
  const [baseMetricSelection, setBaseMetricSelection] = useState<string[]>([...BASE_METRIC_POOL]);
  const [otherMetricSelection, setOtherMetricSelection] = useState<string[]>([...OTHER_METRIC_POOL]);
  const [baseMetricDraft, setBaseMetricDraft] = useState<string[]>([...BASE_METRIC_POOL]);
  const [otherMetricDraft, setOtherMetricDraft] = useState<string[]>([...OTHER_METRIC_POOL]);
  const [branchDispatchRows, setBranchDispatchRows] = useState([
    { id: 'branch-1', name: '高净值续作跟进', source: '支行分派', customers: '16户', supervisionId: 'retention-1' },
    { id: 'branch-2', name: '重点到期提醒', source: '支行分派', customers: '12户', supervisionId: 'retention-2' },
    { id: 'branch-3', name: '核心客户回访', source: '支行分派', customers: '9户', supervisionId: 'upgrade-1' },
    { id: 'branch-4', name: '大额资金跟踪', source: '支行分派', customers: '6户', supervisionId: 'upgrade-2' },
  ]);
  const [optimizeRows, setOptimizeRows] = useState([
    { id: 'opt-fixed-1', name: '待跃迁商机', source: '系统推荐', customers: '18户' },
    { id: 'opt-fixed-2', name: '待流失商机', source: '系统推荐', customers: '9户' },
    { id: 'opt-1', name: optTask.title, source: '支行分派', customers: optTask.relatedCustomers },
    { id: 'opt-2', name: '重点客户跟进', source: '系统推荐', customers: '18户' },
  ]);
  const [opportunityRows, setOpportunityRows] = useState([
    { id: 'opp-1', name: oppTask.title, source: '系统推荐', customers: oppTask.relatedCustomers },
    { id: 'opp-2', name: '私行升级沟通', source: '系统推荐', customers: '24户' },
    { id: 'opp-3', name: '高潜客户升阶', source: '系统推荐', customers: '17户' },
    { id: 'opp-4', name: '资产增配推进', source: '系统推荐', customers: '11户' },
  ]);
  const [riskRows, setRiskRows] = useState([
    { id: 'risk-1', name: '风险预警：流失回访', source: '系统推荐', customers: '6户' },
  ]);
  const [abandonModal, setAbandonModal] = useState<{
    module: 'branch' | 'opt' | 'opp' | 'risk';
    id: string;
    name: string;
    supervisionId?: string;
  } | null>(null);
  const [abandonReason, setAbandonReason] = useState<string>('');
  const coreTargetScope = reportPeriod === 'day' || reportPeriod === 'week' ? 'month' : 'year';
  const reportPeriodLabel = reportPeriod === 'day' ? '当日' : reportPeriod === 'week' ? '本周' : reportPeriod === 'month' ? '本月' : '本年';
  const rateLabel = reportPeriod === 'day' || reportPeriod === 'week' ? '月目标达成率' : '年目标达成率';
  const metricSelectionStorageKey = `manager-metric-pool-${managerId ?? managerName}`;
  const managerSelectionKey = managerId ?? managerName;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(metricSelectionStorageKey);
      if (!saved) {
        return;
      }
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        const savedBase = Array.isArray(parsed.base) ? parsed.base : [];
        const savedOther = Array.isArray(parsed.other) ? parsed.other : [];
        const normalizedBase = savedBase.filter((label) => BASE_METRIC_POOL.includes(label));
        const normalizedOther = savedOther.filter((label) => OTHER_METRIC_POOL.includes(label));
        const dedupedOther = normalizedOther.filter((label) => !normalizedBase.includes(label));
        if (normalizedBase.length > 0) {
          setBaseMetricSelection(normalizedBase);
          setBaseMetricDraft(normalizedBase);
        }
        if (dedupedOther.length > 0) {
          setOtherMetricSelection(dedupedOther);
          setOtherMetricDraft(dedupedOther);
        }
      }
    } catch {
      // Ignore invalid saved data.
    }
  }, [metricSelectionStorageKey]);

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
  const allOtherMetrics = OTHER_METRICS.map((metric) => ({
    label: metric.name,
    current: metric.value[reportPeriod] ?? metric.value.day,
    target: metric.target[reportPeriod] ?? metric.target.day,
    score: metric.score,
    type: metric.type,
    walkinCount: metric.walkinCount,
    callCount: metric.callCount,
    birthdayCount: metric.birthdayCount,
    birthdayTarget: metric.birthdayTarget,
  }));
  const baseMetrics = allBaseMetrics.filter((metric) => baseMetricSelection.includes(metric.label));
  const otherMetrics = allOtherMetrics.filter((metric) => otherMetricSelection.includes(metric.label));
  const currentMetrics = metricTab === 'core' ? coreMetrics : metricTab === 'base' ? baseMetrics : otherMetrics;
  const findCoreMetric = (label: string) => coreMetrics.find((metric) => metric.label === label);
  const formatCoreSummaryValue = (label: string) => {
    const metric = findCoreMetric(label);
    if (!metric) return '—';
    return `${metric.current}（达成率${metric.rate}%）`;
  };
  const updateManagerMetricSelections = (nextBase: string[], nextOther: string[]) => {
    try {
      const raw = localStorage.getItem('manager-metric-selections');
      const parsed = raw ? JSON.parse(raw) : {};
      const nextMap = parsed && typeof parsed === 'object' ? parsed : {};
      nextMap[managerSelectionKey] = {
        name: managerName,
        region: managerRegion ?? '未知',
        base: nextBase,
        other: nextOther,
      };
      localStorage.setItem('manager-metric-selections', JSON.stringify(nextMap));
      window.dispatchEvent(new Event('manager-metric-updated'));
    } catch {
      // ignore
    }
  };
  const handleSaveBaseMetricPool = () => {
    if (baseMetricDraft.length === 0) {
      return;
    }
    setBaseMetricSelection(baseMetricDraft);
    localStorage.setItem(metricSelectionStorageKey, JSON.stringify({ base: baseMetricDraft, other: otherMetricSelection }));
    updateManagerMetricSelections(baseMetricDraft, otherMetricSelection);
    if (!baseMetricDraft.includes(selectedBaseMetricKey)) {
      setSelectedBaseMetricKey(baseMetricDraft[0]);
    }
    setShowBaseMetricPool(false);
  };
  const handleSaveOtherMetricPool = () => {
    if (otherMetricDraft.length === 0) {
      return;
    }
    setOtherMetricSelection(otherMetricDraft);
    localStorage.setItem(metricSelectionStorageKey, JSON.stringify({ base: baseMetricSelection, other: otherMetricDraft }));
    updateManagerMetricSelections(baseMetricSelection, otherMetricDraft);
    if (!otherMetricDraft.includes(selectedOtherMetricKey)) {
      setSelectedOtherMetricKey(otherMetricDraft[0]);
    }
    setShowOtherMetricPool(false);
  };
  const getTouchRateText = (customers: string) => {
    const total = Number(customers.replace(/[^0-9]/g, '')) || 0;
    if (!total) return '--';
    const touched = Math.max(1, Math.round(total * 0.6));
    return `${touched}/${total}`;
  };
  const getOpportunityRewardText = (id: string) => {
    const reward = OPPORTUNITY_REWARD_MAP[id];
    if (!reward) {
      return null;
    }
    return `完成增加${reward}奖金`;
  };
  const getTrendUnit = (label: string) => {
    if (label.includes('客户') || label.includes('户')) return '户';
    if (label.includes('资产') || label.includes('AUM(月)') || label.includes('储蓄') || label.includes('个贷')) return '亿';
    if (label.includes('中收') || label.includes('理财')) return 'M';
    return '';
  };
  const anomalyCoreMetrics = coreMetrics.filter((metric) => metric.type !== 'success');
  const bestCoreMetric = [...coreMetrics].sort((a, b) => b.rate - a.rate)[0];
  const trendSeries = metricTab === 'core' ? coreTrendData : metricTab === 'base' ? baseTrendData : otherTrendData;
  const trendKey = selectedMetricKey;
  const trendDelta = trendSeries.length >= 2
    ? Number(trendSeries[trendSeries.length - 1][trendKey]) - Number(trendSeries[trendSeries.length - 2][trendKey])
    : 0;
  const trendDirection = trendDelta >= 0 ? '上行' : '回落';
  const trendMagnitude = `${Math.abs(trendDelta).toFixed(1)}${getTrendUnit(trendKey)}`;
  const handleTabClick = (tab: 'core' | 'base' | 'other') => {
    setMetricTab(tab);
  };
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
    const metricLabel = selectedCoreMetricKey;
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
  const todayTouchedCustomers = MOCK_CUSTOMERS.filter((customer) => customer.lastInteraction === '昨日');
  const touchedPool = todayTouchedCustomers.length > 0 ? todayTouchedCustomers : MOCK_CUSTOMERS.slice(0, 2);
  const managedSegments = [
    { id: 'small', label: '小燕', customers: '285,701户', aum: '150.69亿元', calls: '8,920次', visits: '3,120次', tone: 'indigo' },
    { id: 'silver', label: '银燕', customers: '19,224户', aum: '717.11亿元', calls: '4,150次', visits: '1,740次', tone: 'cyan' },
    { id: 'gold', label: '金燕', customers: '56,353户', aum: '782.68亿元', calls: '6,820次', visits: '2,350次', tone: 'emerald' },
    { id: 'diamond', label: '钻燕', customers: '7,879户', aum: '239.18亿元', calls: '1,285次', visits: '420次', tone: 'rose' },
    { id: 'honor', label: '尊燕', customers: '1,385户', aum: '184.95亿元', calls: '326次', visits: '98次', tone: 'amber' },
  ];
  const formatSegmentValue = (value: string, factor: number) => {
    const match = value.match(/^([0-9,]+)(.*)$/);
    if (!match) {
      return value;
    }
    const [, raw, unit] = match;
    const scaled = Math.max(1, Math.round(parseInt(raw.replace(/,/g, ''), 10) * factor));
    return `${scaled.toLocaleString()}${unit}`;
  };
  const localSegments = managedSegments;
  const remoteSegments = managedSegments.map((segment) => ({
    ...segment,
    customers: formatSegmentValue(segment.customers, 0.55),
    calls: formatSegmentValue(segment.calls, 0.6),
    visits: formatSegmentValue(segment.visits, 0.6),
    aum: segment.aum,
  }));
  const activeSegments = segmentLocationFilter === 'local' ? localSegments : remoteSegments;
  const segmentGuidelines: Record<string, string> = {
    honor: '尊燕客户：每月至少一次管户经理电访，每半年一次管户经理面访，每年至少一次机构负责人面访，每年至少一次总行协管面访。',
    diamond: '钻燕客户：每月至少一次管户经理电访，每半年一次管户经理面访，每年至少一次机构负责人面访。',
    gold: '金燕客户：每月至少一次管户经理电访，每半年至少一次管户经理面访；',
    silver: '银燕客户：每季度至少一次触达，结合产品到期、市场波动等时机提供商机服务；',
    small: '小燕客户：每半年至少一次覆盖，重点推送适合其风险偏好的产品资讯与活动邀请。',
  };
  const renderSegmentHelp = (segmentId: string) => (
    <span className="relative group">
      <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 text-[9px] font-black text-slate-500 bg-white cursor-default">?</span>
      <span className="pointer-events-none absolute z-10 hidden group-hover:block -top-3 left-6 w-[260px] rounded-lg bg-slate-800 text-white text-[10px] font-bold leading-relaxed px-3 py-2 shadow-lg">
        {segmentGuidelines[segmentId]}
      </span>
    </span>
  );
  const renderMetricHelp = (label: string) => (
    <span
      className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 text-[9px] font-black text-slate-500 bg-white cursor-pointer"
      title={`${label}口径：${reportPeriodLabel}口径统计，指标以报表期数据为准`}
    >
      ?
    </span>
  );
  const touchedSegments = activeSegments.map((segment) => ({
    ...segment,
    customers: `${Math.max(120, Math.round(parseInt(segment.customers.replace(/,/g, ''), 10) * 0.12))}户`,
    calls: `${Math.max(80, Math.round(parseInt(segment.calls.replace(/,/g, ''), 10) * 0.15))}次`,
    visits: `${Math.max(30, Math.round(parseInt(segment.visits.replace(/,/g, ''), 10) * 0.12))}次`,
    aum: segment.aum,
  }));
  const touchCustomers = MOCK_CUSTOMERS.filter((customer) => customer.location === touchLocationFilter);
  const toggleFavorite = (customerId: string) => {
    setFavoriteIds((prev) =>
      prev.includes(customerId) ? prev.filter((id) => id !== customerId) : [...prev, customerId]
    );
  };
  const saveCustomTag = (customerId: string) => {
    const trimmed = customTagDraft.trim();
    setEditingCustomTagId(null);
    setCustomTagDraft('');
    if (!trimmed) {
      return;
    }
    setCustomerTags((prev) => ({ ...prev, [customerId]: trimmed }));
  };
  const handleTagChange = (customerId: string, tagValue: string) => {
    if (tagValue === '__custom__') {
      setEditingCustomTagId(customerId);
      setCustomTagDraft('');
      return;
    }
    setEditingCustomTagId(null);
    setCustomerTags((prev) => ({ ...prev, [customerId]: tagValue }));
  };
  const handleConfirmAbandon = () => {
    if (!abandonModal || !abandonReason.trim()) {
      return;
    }
    if (abandonModal.module === 'branch') {
      setBranchDispatchRows((prev) => prev.filter((row) => row.id !== abandonModal.id));
      if (abandonModal.supervisionId) {
        onAbandonBranchOpportunity?.(abandonModal.supervisionId, managerName);
      }
    } else if (abandonModal.module === 'opt') {
      setOptimizeRows((prev) => prev.filter((row) => row.id !== abandonModal.id));
    } else if (abandonModal.module === 'opp') {
      setOpportunityRows((prev) => prev.filter((row) => row.id !== abandonModal.id));
    } else if (abandonModal.module === 'risk') {
      setRiskRows((prev) => prev.filter((row) => row.id !== abandonModal.id));
    }
    setAbandonModal(null);
    setAbandonReason('');
  };
  const tagFilterOptions = Array.from(new Set(Object.values(customerTags).filter(Boolean)));
  const filteredCustomers = MOCK_CUSTOMERS.filter((customer) => customer.location === listLocationFilter)
    .filter((customer) => (showFavoritesOnly ? favoriteIds.includes(customer.id) : true))
    .filter((customer) => (tagFilter === 'all' ? true : customerTags[customer.id] === tagFilter));

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f7fa]">
      {/* 页面头 */}
      <div className="flex items-center justify-between h-16 px-[22px] pl-[18px] bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M7 16c2 1 4 1 6 0 2-1 3-3 3-5 0-2-1-4-3-5-2-1-4-1-6 0 2 0 4 2 4 5s-2 5-4 5Z" fill="#FFD55E" opacity="0.9"/>
            </svg>
          </div>
          <div className="flex flex-col leading-tight">
            <h2 className="text-lg font-black text-slate-900">{managerName}每日早报</h2>
            <p className="text-xs font-semibold text-slate-500">DAILY REPORT</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <img 
            src="https://picsum.photos/seed/manager/48" 
            alt="用户头像" 
            className="w-10 h-10 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer" 
          />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="px-5 py-[18px] space-y-6">
        
        {/* 获取当前经理的排名和信息 */}
        {(() => {
          const currentManager = MOCK_RM_LIST.find(m => m.name === managerName) || MOCK_RM_LIST[0];
          const topCustomers = touchCustomers
            .map((customer, index) => ({
              ...customer,
              reason: index === 0 ? '活跃度最高，近期资产增长45%' : index === 1 ? 'AUM(月)最大户，持有高端理财产品' : '产品渗透率最高，跨境理财需求强',
              followupHistory: '近两次沟通均已完成到期提醒与产品复盘',
              followupCount30d: index === 0 ? 4 : index === 1 ? 2 : 1,
            }))
            .filter((customer) => customer.followupCount30d <= 3)
            .slice(0, 3);

          return (
            <>
            {/* 昨日业绩汇总 */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="flex items-center gap-4 px-4 py-3">
                {/* 左块：经理信息 */}
                <div className="flex flex-col items-start justify-center gap-1 shrink-0 border-r border-slate-200 pr-4">
                  <img src={currentManager.avatar} alt={currentManager.name} className="w-11 h-11 rounded-lg object-cover border border-slate-200" />
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-slate-900 leading-tight">{currentManager.name}</h4>
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{currentManager.role}</p>
                  </div>
                </div>

                {/* 中块：业绩描述 */}
                <div className="flex-1">
                  <div className="space-y-1">
                    <p className="text-sm text-slate-700 leading-relaxed font-semibold">
                      保持向上心态，稳住节奏、主动出击，把每一次沟通都变成增长机会。
                    </p>
                    <p className="text-xs text-slate-600 leading-snug font-medium">
                      昨日完成率<span className="text-blue-600 font-black">{currentManager.completionRate}%</span>，排名#{currentManager.rank}；主账号迁移新增<span className="text-slate-900 font-black mx-1">12个</span>，以本地高活跃客户为主。财富中收与资产余额贡献突出，但理财日均净增与财富客户净增偏弱，部分到期客户续作不足。<br />
                      <span className="font-black text-amber-600">优化建议：</span>优先从主账号迁移切入，重点锁定高AUM(月)、活跃度&gt;70%、本地且已电访/面访客户，迁移概率更高。
                    </p>
                  </div>
                </div>

                {/* 右块：得分和指标 */}
                <div className="flex flex-col items-end justify-center gap-2 shrink-0 border-l border-slate-200 pl-4">
                  <div className="flex gap-3 text-center">
                    <div>
                      <p className="text-[7px] text-slate-500 font-bold uppercase tracking-tight">排名</p>
                      <p className="text-base font-black text-emerald-600">#{currentManager.rank}</p>
                    </div>
                    <div>
                      <p className="text-[7px] text-slate-500 font-bold uppercase tracking-tight">达成率</p>
                      <p className="text-base font-black text-blue-600">{currentManager.completionRate}%</p>
                    </div>
                    <div>
                      <p className="text-[7px] text-slate-500 font-bold uppercase tracking-tight">总得分</p>
                      <p className="text-base font-black text-slate-900">{currentManager.totalScore}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 高优触达客户 */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-3 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">高优触达客户</h3>
                </div>
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-full p-1 text-[9px] font-black uppercase tracking-widest">
                  <button
                    onClick={() => setTouchLocationFilter('local')}
                    className={`px-2 py-0.5 rounded-full transition-colors ${
                      touchLocationFilter === 'local'
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    本地
                  </button>
                  <button
                    onClick={() => setTouchLocationFilter('remote')}
                    className={`px-2 py-0.5 rounded-full transition-colors ${
                      touchLocationFilter === 'remote'
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    异地
                  </button>
                </div>
              </div>
              <div className="p-2 grid grid-cols-1 lg:grid-cols-3 gap-3">
                {topCustomers.map((customer) => {
                  const status = customer.assetChange.startsWith('-') ? 'warning' : 'normal';

                  return (
                    <div
                      key={customer.id}
                      className={`flex-shrink-0 p-2 rounded-lg border-l-3 flex items-start space-x-2 min-w-[280px] transition-all hover:shadow-lg ${
                        status === 'warning' ? 'bg-amber-50 border-amber-500' : 'bg-rose-50 border-rose-500'
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={`https://picsum.photos/seed/customer-${customer.id}/80`}
                          alt={customer.name}
                          className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                        />
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-white ${
                          status === 'warning' ? 'bg-amber-500' : 'bg-rose-500'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1.5 mb-0.5">
                          <p className="text-xs font-black text-slate-900">{customer.name}</p>
                          <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0 rounded bg-slate-100 text-slate-600">
                            {customer.location === 'local' ? '本地' : '异地'}
                          </span>
                          <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0 rounded ${
                            status === 'warning' ? 'bg-amber-200 text-amber-700' : 'bg-rose-200 text-rose-700'
                          }`}>
                            {status === 'warning' ? '预警' : '高优'}
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-500 font-bold mb-1">AUM(月) ￥{(customer.aum / 100).toFixed(2)}万 · 最近互动 {customer.lastInteraction}</p>
                        <p className="text-[9px] text-slate-500 font-bold mb-1">历史跟进：{customer.followupHistory}</p>
                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] font-black ${
                            status === 'warning' ? 'text-amber-600' : 'text-rose-600'
                          }`}>
                            近30天跟进次数 {customer.followupCount30d}次
                          </span>
                          {onOpenCustomerInsight ? (
                            <button
                              type="button"
                              onClick={() => onOpenCustomerInsight(customer.name)}
                              className="text-[9px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest"
                            >
                              详情 →
                            </button>
                          ) : (
                            <a
                              href={`AI_customer_insight.html?customerName=${encodeURIComponent(customer.name)}`}
                              className="text-[9px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest"
                            >
                              详情 →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
            </>
          );
        })()}
        
        {/* 两列布局：活跃度趋势 + AI智慧督导 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* 左侧：核心指标 + 趋势 */}
          <div className="lg:col-span-2 flex flex-col space-y-4 h-full">
            <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm flex items-start space-x-4">
              <div className="shrink-0 w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <div className="flex-2">
                <h3 className="text-xs font-black text-slate-1200 uppercase tracking-widest mb-3">指标总结</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  <span className="font-black text-slate-900">整体数据表现与异常原因：</span>
                  财富中收{formatCoreSummaryValue('财富中收')}、资产余额{formatCoreSummaryValue('资产余额')}、新开卡客户数{formatCoreSummaryValue('新开卡客户数')}；{anomalyCoreMetrics[0]?.label ?? '理财日均净增'}{anomalyCoreMetrics[0] ? formatCoreSummaryValue(anomalyCoreMetrics[0].label) : '—'}，主要集中在到期续作客户转化不足与睡眠客户回访偏弱（客户层面以张先生、李女士等存量客户为主）。<br />
                  <span className="font-black text-emerald-600">昨日表现亮眼：</span>
                  {bestCoreMetric?.label ?? '财富中收'}达成率居前，{trendKey}趋势{trendDirection}（近两期变动{trendMagnitude}）。
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="border-b border-slate-100">
                <div className="flex bg-slate-50">
                  <button
                    onClick={() => handleTabClick('core')}
                    className={`py-3 px-6 text-xs font-black tracking-widest uppercase transition-all whitespace-nowrap ${
                      metricTab === 'core'
                        ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    核心指标表现
                  </button>
                  <button
                    onClick={() => handleTabClick('base')}
                    className={`py-3 px-6 text-xs font-black tracking-widest uppercase transition-all whitespace-nowrap ${
                      metricTab === 'base'
                        ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    基础指标表现
                  </button>
                  <button
                    onClick={() => handleTabClick('other')}
                    className={`py-3 px-6 text-xs font-black tracking-widest uppercase transition-all whitespace-nowrap ${
                      metricTab === 'other'
                        ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
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
                              {[...BASE_METRIC_POOL, ...OTHER_METRIC_POOL].map((label) => {
                                const checked = baseMetricDraft.includes(label);
                                return (
                                  <label key={label} className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => {
                                        if (!checked && otherMetricSelection.includes(label)) {
                                          window.alert('指标重复');
                                          return;
                                        }
                                        setBaseMetricDraft((prev) =>
                                          checked ? prev.filter((item) => item !== label) : [...prev, label]
                                        );
                                      }}
                                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-200"
                                    />
                                    <span>{label}</span>
                                  </label>
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
                                  onClick={handleSaveBaseMetricPool}
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
                              {[...BASE_METRIC_POOL, ...OTHER_METRIC_POOL].map((label) => {
                                const checked = otherMetricDraft.includes(label);
                                return (
                                  <label key={label} className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => {
                                        if (!checked && baseMetricSelection.includes(label)) {
                                          window.alert('指标重复');
                                          return;
                                        }
                                        setOtherMetricDraft((prev) =>
                                          checked ? prev.filter((item) => item !== label) : [...prev, label]
                                        );
                                      }}
                                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-200"
                                    />
                                    <span>{label}</span>
                                  </label>
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
                                  onClick={handleSaveOtherMetricPool}
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
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
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
                          <div className="text-sm font-black text-slate-900 tracking-tight">{item.current}</div>
                          <div className="text-right text-[8px] font-bold text-slate-400 whitespace-nowrap">
                            <div>目标: {item.target}</div>
                            <div className="text-slate-600">得分: {item.score}分</div>
                          </div>
                        </div>
                        {item.label === '客户触达' && (
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
              <div className="h-[180px] min-h-[180px] w-full bg-slate-50 rounded-lg p-3 border border-slate-100 flex-1">
                <ResponsiveContainer width="100%" height="100%" minHeight={180} minWidth={0}>
                  <LineChart data={metricTab === 'core' ? coreTrendData : metricTab === 'base' ? baseTrendData : otherTrendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 9, fontWeight: '900'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 8, fontWeight: '900'}} />
                    <Tooltip 
                      cursor={{stroke: '#e2e8f0', strokeWidth: 1}} 
                      content={metricTab === 'core' ? renderCoreTooltip : undefined}
                      contentStyle={metricTab === 'core' ? undefined : {borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px -2px rgb(0 0 0 / 0.1)', fontSize: '11px', fontWeight: 'bold', backgroundColor: '#fff'}} 
                    />
                    <Line type="monotone" dataKey={selectedMetricKey} stroke="#3b82f6" strokeWidth={1.5} dot={{fill: '#3b82f6', r: 3}} activeDot={{r: 4}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 右侧：AI智慧建议 */}
          <div className="bg-[#1e293b] text-white rounded-2xl p-6 shadow-2xl flex flex-col relative overflow-hidden border border-white/10 h-full">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none transform rotate-12">
              <ICONS.AI />
            </div>
            
            <div className="relative z-10 flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <ICONS.AI />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight uppercase">AI 智慧建议</h2>
                <p className="text-[9px] text-blue-400 font-bold uppercase tracking-widest">Daily Assistant</p>
              </div>
            </div>

            <div className="space-y-4 flex-1 relative z-10">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">支行长推荐</p>
                 
                </div>
                <div className="bg-slate-900/50 border border-white/10 rounded-lg p-3 space-y-2">
                  <div className="grid grid-cols-[1.5fr_0.7fr_0.9fr_0.7fr] text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">
                    <span>商机名称</span>
                    <span className="text-center">客户数</span>
                    <span className="text-center">关联商机</span>
                    <span className="text-center">触达率</span>
                  </div>
                  {branchDispatchRows.map((item) => (
                    <div key={item.id} className="grid grid-cols-[1.5fr_0.7fr_0.9fr_0.7fr] items-center text-[10px] text-slate-300">
                      <div className="pr-2">
                        <span className="font-bold text-slate-100 block">{item.name}</span>
                        {getOpportunityRewardText(item.id) && (
                          <span className="mt-1 inline-flex text-[8px] font-black text-amber-300 bg-slate-800/70 px-2 py-0.5 rounded-full border border-white/10 whitespace-nowrap">
                            {getOpportunityRewardText(item.id)}
                          </span>
                        )}
                      </div>
                      <span className="text-center text-slate-200 font-bold">{item.customers}</span>
                      <a
                        href="manager-dashboard.html"
                        className="justify-self-end px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-[9px] font-black uppercase tracking-widest"
                      >
                        商机详情
                      </a>
                      <span className="justify-self-center text-[10px] font-black text-slate-200">
                        {getTouchRateText(item.customers)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">💡 管户经营</p>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">昨日重点关注3个高净值客户的理财产品续作，建议在下午14:00-16:00进行集中回访。1个客户30天未活跃，存在流失风险，建议主动联系并设置到期提醒。</p>
                {optTask && (
                  <div className="bg-slate-900/50 border border-white/10 rounded-lg p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">关联商机</p>
                      
                    </div>
                    <div className="grid grid-cols-[1.5fr_0.7fr_0.9fr_0.7fr] text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">
                      <span>商机名称</span>
                      <span className="text-center">客户数</span>
                      <span className="text-center">关联商机</span>
                      <span className="text-center">触达率</span>
                    </div>
                    {optimizeRows.map((item) => (
                      <div key={item.id} className="grid grid-cols-[1.5fr_0.7fr_0.9fr_0.7fr] items-center text-[10px] text-slate-300">
                        <div className="pr-2">
                          <span className="font-bold text-slate-100 block">{item.name}</span>
                          {getOpportunityRewardText(item.id) && (
                            <span className="mt-1 inline-flex text-[8px] font-black text-amber-300 bg-slate-800/70 px-2 py-0.5 rounded-full border border-white/10 whitespace-nowrap">
                              {getOpportunityRewardText(item.id)}
                            </span>
                          )}
                        </div>
                        <span className="text-center text-slate-200 font-bold">{item.customers}</span>
                        <a
                          href="manager-dashboard.html"
                          className="justify-self-end px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-[9px] font-black uppercase tracking-widest"
                        >
                          商机详情
                        </a>
                        <span className="justify-self-center text-[10px] font-black text-slate-200">
                          {getTouchRateText(item.customers)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">✨ 公共池机会</p>
                <p className="text-xs text-slate-200 leading-relaxed">检测到5个客户AUM(月)增长&gt;10%，可考虑升级私行服务等级。</p>
                {oppTask && (
                  <div className="bg-slate-900/50 border border-white/10 rounded-lg p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">关联商机</p>
                   
                    </div>
                    <div className="grid grid-cols-[1.5fr_0.7fr_0.9fr_0.7fr] text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">
                      <span>商机名称</span>
                      <span className="text-center">客户数</span>
                      <span className="text-center">关联商机</span>
                      <span className="text-center">触达率</span>
                    </div>
                    {opportunityRows.map((item) => (
                      <div key={item.id} className="grid grid-cols-[1.5fr_0.7fr_0.9fr_0.7fr] items-center text-[10px] text-slate-300">
                        <div className="pr-2">
                          <span className="font-bold text-slate-100 block">{item.name}</span>
                          {getOpportunityRewardText(item.id) && (
                            <span className="mt-1 inline-flex text-[8px] font-black text-amber-300 bg-slate-800/70 px-2 py-0.5 rounded-full border border-white/10 whitespace-nowrap">
                              {getOpportunityRewardText(item.id)}
                            </span>
                          )}
                        </div>
                        <span className="text-center text-slate-200 font-bold">{item.customers}</span>
                        <a
                          href="manager-dashboard.html"
                          className="justify-self-end px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-[9px] font-black uppercase tracking-widest"
                        >
                          商机详情
                        </a>
                        <span className="justify-self-center text-[10px] font-black text-slate-200">
                          {getTouchRateText(item.customers)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>


              {recentOpportunities.length > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">📌 AI派发商机</p>
                  <div className="space-y-3">
                    {recentOpportunities.map((opportunity) => (
                      <div key={opportunity.id} className="bg-slate-900/50 border border-white/10 rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">关联商机</p>
                          <span className="text-[9px] font-black text-blue-300">{opportunity.priority}</span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-100">{opportunity.title}</p>
                          {getOpportunityRewardText(opportunity.id) && (
                            <span className="mt-1 inline-flex text-[8px] font-black text-amber-300 bg-slate-800/70 px-2 py-0.5 rounded-full border border-white/10 whitespace-nowrap">
                              {getOpportunityRewardText(opportunity.id)}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">{opportunity.description}</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                          <span>来源 {opportunity.source}</span>
                          <span>{opportunity.sentAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 客群结构画像洞察 */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center">
              <span className="w-1.5 h-4 bg-indigo-500 rounded-full mr-2"></span>
              客群结构洞察
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-full p-1 text-[10px] font-black uppercase tracking-widest">
                <button
                  onClick={() => setSegmentLocationFilter('local')}
                  className={`px-3 py-1 rounded-full transition-colors ${
                    segmentLocationFilter === 'local'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  本地
                </button>
                <button
                  onClick={() => setSegmentLocationFilter('remote')}
                  className={`px-3 py-1 rounded-full transition-colors ${
                    segmentLocationFilter === 'remote'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  异地
                </button>
              </div>
              <span className="text-xs font-bold text-slate-500">管户客群与昨日触达对比</span>
            </div>
          </div>
          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">管户客群结构</h4>
                <span className="text-[10px] font-bold text-slate-500">共 {managedSegments.length} 层级</span>
              </div>
              <div className="grid grid-cols-[1fr_1fr_1fr_1fr] text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
                <span>层级</span>
                <span className="text-center">客户数</span>
                <span className="text-center">AUM(月)总额</span>
                <span className="text-center">电访/面访</span>
              </div>
              <div className="space-y-3">
                {activeSegments.map((segment) => {
                  const customerValue = parseInt(segment.customers.replace(/,/g, ''), 10);
                  const barWidth = Math.min(100, Math.max(8, (customerValue / 285701) * 100));
                  return (
                    <div key={segment.id} className="space-y-1">
                      <div className="grid grid-cols-[1fr_1fr_1fr_1fr] items-center text-[10px] text-slate-600">
                        <span className="font-black text-slate-800 flex items-center">
                          {segment.label}
                          {renderSegmentHelp(segment.id)}
                        </span>
                        <span className="text-center font-bold">{segment.customers}</span>
                        <span className="text-center font-bold">{segment.aum}</span>
                        <span className="text-center font-bold">{segment.calls}/{segment.visits}</span>
                      </div>
                      <div className="h-1.5 bg-white rounded-full overflow-hidden border border-slate-100">
                        <div
                          className={`h-full ${
                            segment.tone === 'emerald'
                              ? 'bg-emerald-500'
                              : segment.tone === 'amber'
                              ? 'bg-amber-500'
                              : segment.tone === 'rose'
                              ? 'bg-rose-500'
                              : segment.tone === 'cyan'
                              ? 'bg-cyan-500'
                              : 'bg-indigo-500'
                          }`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-[11px] text-slate-500 leading-relaxed">
                管户包以小燕与银燕为主，建议对金燕以上层级加密触达频次。
              </p>
            </div>

            <div className="border border-slate-200 rounded-2xl p-4 bg-white">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">昨日触达客群结构</h4>
              </div>
              <div className="grid grid-cols-[1fr_1fr_1fr_1fr] text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
                <span>层级</span>
                <span className="text-center">客户数</span>
                <span className="text-center">AUM(月)总额</span>
                <span className="text-center">电访/面访</span>
              </div>
              <div className="space-y-3">
                {touchedSegments.map((segment) => {
                  const customerValue = parseInt(segment.customers.replace(/,/g, ''), 10);
                  const barWidth = Math.min(100, Math.max(8, (customerValue / 285701) * 100));
                  return (
                    <div key={segment.id} className="space-y-1">
                      <div className="grid grid-cols-[1fr_1fr_1fr_1fr] items-center text-[10px] text-slate-600">
                        <span className="font-black text-slate-800 flex items-center">
                          {segment.label}
                          {renderSegmentHelp(segment.id)}
                        </span>
                        <span className="text-center font-bold">{segment.customers}</span>
                        <span className="text-center font-bold">{segment.aum}</span>
                        <span className="text-center font-bold">{segment.calls}/{segment.visits}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            segment.tone === 'emerald'
                              ? 'bg-emerald-500'
                              : segment.tone === 'amber'
                              ? 'bg-amber-500'
                              : segment.tone === 'rose'
                              ? 'bg-rose-500'
                              : segment.tone === 'cyan'
                              ? 'bg-cyan-500'
                              : 'bg-indigo-500'
                          }`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-[11px] text-slate-500 leading-relaxed">
                昨日触达主要集中在银燕与金燕层级，建议补充尊燕层级的深度拜访。
              </p>
            </div>
          </div>
        </section>

        {/* 客户画像洞察 */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center">
              <span className="w-1.5 h-4 bg-purple-500 rounded-full mr-2"></span>
              管户客户列表
            </h3>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowFavoritesOnly((prev) => !prev)}
                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${
                  showFavoritesOnly
                    ? 'bg-amber-500 text-white border-amber-400 shadow-sm'
                    : 'bg-white text-amber-600 border-amber-200 hover:bg-amber-50'
                }`}
              >
                已收藏
              </button>
              <select
                value={tagFilter}
                onChange={(event) => setTagFilter(event.target.value)}
                className="px-3 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="all">分组标签</option>
                {tagFilterOptions.map((tag) => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-full p-1 text-[10px] font-black uppercase tracking-widest">
                <button
                  onClick={() => setListLocationFilter('local')}
                  className={`px-3 py-1 rounded-full transition-colors ${
                    listLocationFilter === 'local'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  本地
                </button>
                <button
                  onClick={() => setListLocationFilter('remote')}
                  className={`px-3 py-1 rounded-full transition-colors ${
                    listLocationFilter === 'remote'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  异地
                </button>
              </div>
              <span className="text-xs font-bold text-slate-500">{filteredCustomers.length}位客户</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-fixed text-sm text-center">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">客户名称</th>
                  <th className="px-6 py-4">本异地</th>
                  <th className="px-6 py-4">AUM(月) (万元)</th>
                  <th className="px-6 py-4">是否电访</th>
                  <th className="px-6 py-4">是否面访</th>
                  <th className="px-6 py-4">近30日交易活跃次数</th>
                  <th className="px-6 py-4">资产变化</th>
                  <th className="px-6 py-4">最后互动</th>
                  <th className="px-6 py-4">待触达商机</th>
                  <th className="px-6 py-4">历史被触达次数</th>
                  <th className="px-6 py-4">是否收藏</th>
                  <th className="px-6 py-4">选择标签</th>
                  <th className="px-6 py-4">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredCustomers.map((customer) => {
                  const opportunityItems = OPPORTUNITY_MAP[customer.id]?.items ?? [];
                  const opportunityCount = opportunityItems.length;

                  return (
                    <tr key={customer.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                          <p className="font-bold text-slate-900 whitespace-nowrap">{customer.name}</p>
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[9px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">
                            {customer.level}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs font-black text-slate-600 whitespace-nowrap">
                          {customer.location === 'local' ? '本地' : '异地'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-base font-black text-blue-600 whitespace-nowrap">{customer.aum}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-xs font-black whitespace-nowrap ${customer.called ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {customer.called ? '是' : '否'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-xs font-black whitespace-nowrap ${customer.visited ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {customer.visited ? '是' : '否'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs font-bold text-slate-500 whitespace-nowrap">{customer.monthlyTxnCount}次</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`font-bold text-sm whitespace-nowrap ${
                          customer.assetChange.startsWith('+')
                            ? 'text-emerald-600'
                            : 'text-rose-600'
                        }`}>
                          {customer.assetChange}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs text-slate-500 font-bold whitespace-nowrap">{customer.lastInteraction}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative inline-flex whitespace-nowrap">
                          <button
                            type="button"
                            disabled={opportunityCount === 0}
                            onClick={() => {
                              if (!opportunityCount) {
                                return;
                              }
                              setOpenOpportunityId(openOpportunityId === customer.id ? null : customer.id);
                            }}
                            className={`px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${
                              opportunityCount
                                ? 'border-blue-200 bg-white text-blue-600 hover:bg-blue-50'
                                : 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed'
                            }`}
                          >
                            {opportunityCount}个
                          </button>
                          {openOpportunityId === customer.id && (
                            <div className="absolute top-7 left-0 z-10 w-56 rounded-lg border border-slate-200 bg-white p-3 shadow-lg text-left">
                              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">待触达商机</div>
                              <div className="space-y-2">
                                {opportunityItems.map((item) => (
                                  <div key={item.id} className="flex items-center justify-between gap-2">
                                    <a
                                      href={item.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-[11px] font-bold text-blue-600 hover:text-blue-800 truncate"
                                    >
                                      {item.name}
                                    </a>
                                    <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">{item.createdAt}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative inline-flex whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setOpenTouchHistoryId(openTouchHistoryId === customer.id ? null : customer.id)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 whitespace-nowrap"
                          >
                            {(TOUCH_HISTORY_MAP[customer.id]?.count ?? 0)}次
                          </button>
                          {openTouchHistoryId === customer.id && (
                            <div className="absolute top-7 left-0 z-10 w-48 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
                              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">触达客户经理</div>
                              {(TOUCH_HISTORY_MAP[customer.id]?.managers ?? []).map((manager) => (
                                <div key={manager.name} className="flex items-center justify-between text-[10px] font-bold text-slate-600">
                                  <span className="flex items-center gap-1">
                                    <span>{manager.name}</span>
                                    <span className="text-[9px] text-slate-400">{manager.time}</span>
                                  </span>
                                  <span className="text-slate-400">{manager.tag}</span>
                                </div>
                              ))}
                              <div className="mt-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">自定义标签</div>
                              <div className="text-[10px] font-bold text-slate-600">{customerTags[customer.id] || '未设置'}</div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={favoriteIds.includes(customer.id)}
                            onChange={() => toggleFavorite(customer.id)}
                            className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                          />
                        </label>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={editingCustomTagId === customer.id ? '__custom__' : customerTags[customer.id] || ''}
                          onChange={(event) => handleTagChange(customer.id, event.target.value)}
                          className="w-[80px] rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-200 whitespace-nowrap"
                        >
                          <option value="">选择标签</option>
                          <option value="__custom__">+自定义标签</option>
                          {TAG_OPTIONS.map((tag) => (
                            <option key={tag} value={tag}>{tag}</option>
                          ))}
                        </select>
                        {editingCustomTagId === customer.id && (
                          <div
                            className="relative mt-2"
                            onMouseLeave={() => saveCustomTag(customer.id)}
                          >
                            <input
                              type="text"
                              value={customTagDraft}
                              onChange={(event) => setCustomTagDraft(event.target.value)}
                              onBlur={() => saveCustomTag(customer.id)}
                              placeholder="输入自定义标签"
                              className="w-[80px] rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-200 whitespace-nowrap"
                            />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onOpenCustomerInsight?.(customer.name)}
                          className="text-blue-600 hover:text-blue-800 text-[10px] font-black uppercase tracking-widest border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-all whitespace-nowrap"
                        >
                          客户洞察 →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
        </div>
      </main>
      {abandonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">商机舍弃原因</h3>
            <p className="text-xs text-slate-500 mb-4">商机：<span className="font-bold text-slate-800">{abandonModal.name}</span></p>
            <textarea
              value={abandonReason}
              onChange={(event) => setAbandonReason(event.target.value)}
              placeholder="请填写舍弃原因（必填）"
              className="w-full h-28 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setAbandonModal(null);
                  setAbandonReason('');
                }}
                className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-200 text-slate-500 hover:bg-slate-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmAbandon}
                disabled={!abandonReason.trim()}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                  abandonReason.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                提交
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Internal Components
const NavItem: React.FC<{ icon: React.ReactNode, label: string, active?: boolean }> = ({ icon, label, active }) => (
  <button className={`w-full flex items-center space-x-4 p-4 rounded-[1.25rem] transition-all group ${
    active ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/50 scale-105' : 'text-slate-500 hover:bg-white/5 hover:text-white'
  }`}>
    <div className={`shrink-0 transition-transform group-hover:scale-110`}>{icon}</div>
    <span className="hidden lg:block text-[11px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default ManagerApp;
