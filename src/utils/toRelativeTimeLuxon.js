import { DateTime } from 'luxon';

export function toRelativeTimeLuxon(utcTime) {
  const targetTime = DateTime.fromISO(utcTime, { zone: 'utc' }); // Target time in UTC
  const currentTime = DateTime.utc();

  return targetTime.toRelative({ base: currentTime });
}
