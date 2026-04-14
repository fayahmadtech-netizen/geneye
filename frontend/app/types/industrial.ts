export interface FabMetricDaily {
  metric_type: string;
  value: number;
  timestamp: string;
}

export interface FabSite {
  id: string;
  location_flag: string;
  status: string; // active, maintenance, warning
  metrics: FabMetricDaily[];
}

export interface IpBlockItem {
  id: string;
  point: string;
  status: string;
}

export interface IpBlockMetric {
  id: string;
  label: string;
  value: string;
}

export interface SiliconIpBlock {
  id: string;
  title: string;
  description: string;
  items: IpBlockItem[];
  metrics: IpBlockMetric[];
}

export interface PhysicalAiOutcome {
  id: string;
  metric_name: string;
  current_value: string;
  baseline: string;
  summary: string;
  driver_tags: string[];
}
