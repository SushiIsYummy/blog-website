import { DateTime } from 'luxon';

function formatUTCDateToLocal(dateString, format) {
  if (!dateString) {
    return null;
  }

  const dateTime = DateTime.fromISO(dateString, { zone: 'utc' });
  const localDate = dateTime.toLocal();
  const formattedDate = localDate.toFormat(format);

  return formattedDate;
}

export default formatUTCDateToLocal;
