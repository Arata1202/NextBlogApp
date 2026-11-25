import { formatInTimeZone } from 'date-fns-tz';

export const DISPLAY_TIME_ZONE = 'Asia/Tokyo';

export const formatDate = (date: string) => {
  const timestamp = Date.parse(/^\d{4}-\d{2}-\d{2}T[\d:.]+$/.test(date) ? date + 'Z' : date);
  return Number.isFinite(timestamp)
    ? formatInTimeZone(timestamp, DISPLAY_TIME_ZONE, 'yyyy年M月d日')
    : '';
};
