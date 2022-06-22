const fs = require('fs');
const f = fs.readFileSync('./worktime.txt');
const str = f.toString();

const intervals = str.split(/\r\n/).map(e => e.replace(/\s+/gim, '').replace(/h+/gim, ':').replace(/00:/gim, '24:').split('-'));

const [, , hprice, brl] = process.argv;


const inMins = intervals.map(interval => {
    const o = interval.map((time) => {
        return time.split(':');
    })

    const firstH = o[0][0] * 60;
    const secondH = o[1][0] * 60;
    const firstMin = o[0][1]
    const secondMin = o[1][1]

    const first = +firstH + +firstMin;
    const second = +secondH + +secondMin;

    return second - first;
})


const _totals = inMins.reduce((a, b) => a + b, 0);
console.log(_totals)
const totals = _totals / 60;
console.log(totals)
function getMoney(a, b, hour, brl = 1) {
    const v = +(((+a * 60 + +b) / 60) * +hour).toFixed(2)
    return `$ ${v}, R$ ${v * brl}`
}

function getTotals() {
    let [a, b] = String(totals.toFixed(2)).split('.');
    let mins = (60 * (+(b ?? 0) / 100)).toFixed(0);
    +mins >= 60 ? (a++, mins = +mins - 60) : null;
    const totalInHour = `${a} hours and ${String(mins).substring(0, 2)} minutes (${getMoney(a, String(mins).substring(0, 2), hprice ?? 25, brl ?? 4.75)})`;
    return totalInHour;
}

console.log('Worked a total of', getTotals());