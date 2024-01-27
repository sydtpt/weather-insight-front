export function dalayEmit(chartOptions, array, time?) {
    let index = 0;
    if (!time) {
        time = 50;
    }

    chartOptions.series.push({name: array.name, data: []});
    function emitNext() {
      if (index < array.data.length) {
        chartOptions.series.find(item => item.name === array.name).data.push(array.data[index]);
        index++;
        setTimeout(emitNext, time); // 10000 milissegundos = 10 segundos
    }
}
emitNext();
}


/**
 * Checks if a given date is today.
 * @param date - The date to check.
 * @returns True if the date is today, false otherwise.
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return today.toDateString() === date.toDateString();
}