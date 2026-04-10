export const formatOrderDate = (dateString: string): string => {
  const orderDate = new Date(dateString);
  const now = new Date();
  
  const diffInDays = Math.floor(
    (new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() - 
     new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate()).getTime()) 
    / (1000 * 60 * 60 * 24)
  );

  let dayLabel = '';
  if (diffInDays === 0) dayLabel = 'Сегодня';
  else if (diffInDays === 1) dayLabel = 'Вчера';
  else if (diffInDays > 1 && diffInDays < 5) dayLabel = `${diffInDays} дня назад`;
  else dayLabel = `${diffInDays} дней назад`;

  const hours = orderDate.getHours().toString().padStart(2, '0');
  const minutes = orderDate.getMinutes().toString().padStart(2, '0');
  const gmt = `i-GMT${orderDate.getTimezoneOffset() > 0 ? '-' : '+'}${Math.abs(orderDate.getTimezoneOffset() / 60)}`;

  return `${dayLabel}, ${hours}:${minutes} ${gmt}`;
};
