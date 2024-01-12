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