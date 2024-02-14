import { DateTime } from 'luxon';

function toRelativeTimeLuxon(utcTime) {
  const targetTime = DateTime.fromISO(utcTime, { zone: 'utc' }); // Target time in UTC
  const currentTime = DateTime.utc();

  return targetTime.toRelative({ base: currentTime });
}

export default toRelativeTimeLuxon;
