import { DateTime } from 'luxon';

function formatUTCDate(dateString, format) {
  const dateTime = DateTime.fromISO(dateString, { zone: 'utc' });
  const formattedDate = dateTime.toFormat(format);

  return formattedDate;
}

export default formatUTCDate;
