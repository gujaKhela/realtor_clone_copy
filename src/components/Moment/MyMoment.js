export function formatTimestamp(timestamp) {
  const currentDate = new Date();
  const dataFromDataBase = timestamp.toDate(); 


  const timeDifference = currentDate - dataFromDataBase;
  // Calculate different time units
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(seconds / 3600); // Corrected line
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  // Determine the most appropriate time unit
  if (years > 0) {
    return `${years} ${years === 1 ? "year" : "years"} ago`;
  } else if (months > 0) {
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  } else if (days > 0) {
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  } else if (hours > 0) {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else {
    return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
  }

  
}
