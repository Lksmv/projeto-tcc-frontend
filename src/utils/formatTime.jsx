
export const formatOutputDate = (rawDate) => {
  const dateObj = new Date(rawDate);
  if (!isNaN(dateObj)) {
    const day = dateObj.getUTCDate().toString().padStart(2, '0');
    const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getUTCFullYear();
    return `${day}-${month}-${year}`;
  } else {
    return rawDate;
  }
};


export const formatInputDate = (rawDate) => {
  const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
  if (dateRegex.test(rawDate)) {
    const parts = rawDate.split('-');
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    return formattedDate+'T03:00:00.000+00:00';
  } else {
    return rawDate;
  }
};