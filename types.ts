export type IndicatorStatus = 'good' | 'neutral' | 'bad';
export type VisualType = 'range' | 'nupl' | 'comparison';

export interface BaseVisual {
  type: VisualType;
  min: number;
  max: number;
}

export interface RangeVisual extends BaseVisual {
  type: 'range';
  style: 'gradient' | 'blocks';
  buyMin: number;
  buyMax: number;
  sellMin: number;
  sellMax: number;
  intermediateLabels?: { value: number; text: string }[];
  dateLabels?: number[];
}

export interface NuplVisual extends BaseVisual {
  type: 'nupl';
}

export interface ComparisonVisual {
  type: 'comparison';
  value1Label: string;
  value2Label: string;
}


export type VisualData = RangeVisual | NuplVisual | ComparisonVisual;

export interface IndicatorData {
  id: string;
  title: string;
  concept: string;
  value: number;
  value2?: number;
  unit: string;
  status: IndicatorStatus;
  description: string;
  details: string;
  buyZoneLabel: string;
  sellZoneLabel:string;
  visual: VisualData;
  cycleStartDate?: string;
  nextCycleEstimateDate?: string;
  sourceUrl?: string;
}