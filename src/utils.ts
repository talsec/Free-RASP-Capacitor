import { Threat } from './definitions';

export const getThreatCount = (): number => {
  return Threat.getValues().length;
};

export const itemsHaveType = (data: any[], desiredType: string): boolean => {
  return data.every(item => typeof item === desiredType);
};
