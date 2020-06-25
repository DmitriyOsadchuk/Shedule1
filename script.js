
let matrix = [
    [0, 300, 700, 400, 500],
    [300, 0, 1300, 800, 450],
    [700, 1300, 0, 1000, 1100],
    [400, 800, 1000, 0, 550],
    [500, 450, 1100, 550, 0]
];
cities = ['Kiev', 'Kharkiv', 'Lviv', 'Odessa', 'Dnepr'];
days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];


randomNumber = function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
};
randABC = function (n) {
    let s = '', abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', aL = abc.length;
    while (s.length < n)
        s += abc[Math.random() * aL | 0];
    return s;
};
resIdexs = [];

randomNumbersFromArray = function randNFA(max, min, length) {
    let result = [];
    for(let j = 0; j < length; j++){
        random = randomNumber(min, max);
        let index = result.indexOf(random);
        while (index != -1) {
            random = randomNumber(min, max);
            index = result.indexOf(random);
        }
        result.push(random);
    }
    return result;
};


const getScedule = function() {
    let num = document.getElementById('number').value;
    result = randomNumbersFromArray(19,0, num);
    resWrite = [];
    res = [];
    alert("You entered " + num);

    cities.forEach(function (item1, i1, cities) {
        cities.forEach(function (item2, i2) {
            if (i1 != i2) {
            let datNow = new Date();
            yearNow = datNow.getFullYear();
            monthNow = datNow.getMonth();
            dayNow = datNow.getDate();
            let date = new Date(yearNow, monthNow, randomNumber(dayNow+1, dayNow+8), randomNumber(0, 23), randomNumber(0, 59), 0);
            dayIndex = date.getDay();
            dayTitle = days[dayIndex];
            hours = date.getHours();
            minutes = date.getMinutes();

                if (minutes < 10 && hours < 10) {
                    departureTime = dayTitle + " " + '0' + hours + ":" + 0 + minutes;
                } else if (minutes < 10 && hours > 10) {
                    departureTime = dayTitle + " " +  hours + ":" + 0 + minutes;
                } else if (hours < 10 && minutes > 10) {
                    departureTime = dayTitle + " " + '0' + hours + ":" + minutes;
                } else if (hours > 10 && minutes > 10) {
                    departureTime = dayTitle + " " + hours + ":" + minutes;
                }

            distance = matrix[i1][i2];
            number = randomNumber(100, 999);
            speed = randomNumber(80, 120);
            ABC = randABC(1);
            driving_time = (distance/speed).toFixed(2);
            driving_hours = (parseInt(driving_time));
            driving_minutes = (parseInt((driving_time - driving_hours)*60));

                if (driving_minutes < 10 && driving_hours < 10) {
                    driving_time = '0' + driving_hours + ":" + 0 + driving_minutes;
                } else if (driving_minutes < 10 && driving_hours > 10) {
                    driving_time = driving_hours + ":" + 0 + driving_minutes;
                } else if (driving_hours < 10 && driving_minutes > 10) {
                    driving_time = '0' + driving_hours + ":" + driving_minutes;
                } else if (driving_hours > 10 && driving_minutes > 10) {
                    driving_time = driving_hours + ":" + driving_minutes;
                }
            arrival_hours = hours + driving_hours;
            arrival_minutes = minutes + driving_minutes;

                if (arrival_minutes > 59) {
                    arrival_minutes = arrival_minutes - 60;
                    arrival_hours = arrival_hours + 1;
                }
                if (arrival_hours > 23) {
                    arrival_hours = arrival_hours - 24;
                    arrival_day = days[dayIndex+1];
                }else{
                    arrival_day = days[dayIndex];
                }

                if (arrival_minutes < 10 && arrival_hours < 10) {
                    arrival_time = arrival_day + " " + '0' + arrival_hours + ":" + 0 + arrival_minutes;
                }else if (arrival_minutes < 10 && arrival_hours > 10) {
                    arrival_time = arrival_day + " " + arrival_hours + ":" + 0 + arrival_minutes;
                }else if (arrival_minutes > 10 && arrival_hours < 10) {
                    arrival_time = arrival_day + " " + '0' + arrival_hours + ":" + arrival_minutes;
                }else if (arrival_minutes > 10 && arrival_hours > 10) {
                    arrival_time = arrival_day + " " + arrival_hours + ":" + arrival_minutes;
                }
            driving_time_for_price = driving_hours + (driving_minutes/100);
            price = driving_time_for_price*40,251;
            ticket_price = price.toFixed(2);

                obj = {
                    train_number: number + ABC,
                    departure_city: item1,
                    destination_city: item2,
                    departure_day: dayTitle,
                    departure_time: departureTime,
                    distance: distance+ ' '+ 'km',
                    speed: speed + ' ' + 'km/h',
                    driving_time: driving_time,
                    arrival_time: arrival_time,
                    ticket_price: ticket_price + ' '+ 'grn'
                };
                res.push(obj)
            }
        })
    });
    while (num) {
        i = result[num-1];
        item = res[i];
        resWrite.push(item);
        num--;
    }
    shceduleBody(resWrite)
};


//-----Convert Object to Excel

const objectToCsv = function (resWrite) {

    const csvRows = [];

    const headers = Object.keys(resWrite[0]);
    csvRows.push(headers.join(','));

    for (const row of resWrite) {
        const values = headers.map(header => {
            const escaped = (''+row[header]).replace(/"/g, '\\"');
            return escaped;
        });
        csvRows.push(values.join(','+'  '));
    }
    return csvRows.join('\n');
};

const download = function (resWrite) {
    const blob = new Blob([resWrite], {type:'text/csv'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'download.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

const getReport = async function() {
    const csvData = objectToCsv(resWrite);
    download(csvData);
};

(function () {
    const  button = document.getElementById('myButton');
    button.addEventListener('click', getReport);

})();

//-----Create schedule table----

function shceduleBody(res) {
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild)
    }
    res.forEach((row) => {
        const tr = document.createElement("tr");
        for (let cell in row) {
            const td = document.createElement("td");
            td.textContent = row[cell];
            tr.appendChild(td)
        }

        tableBody.appendChild(tr)
    })
}
const tableBody = document.querySelector( "#scedule > tbody");

//-----Clear schedule table----

function clearSchedule() {
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild)
    }
}

//----Validation form-----

function validNumber() {
    let x;
    x = document.getElementById("number").value;
    if (isNaN(x) || x < 1 || 20 < x) {
        alert("Input is not valid! Please enter valid number" )
    } else {
        getScedule()
    }
}

// -----Clock---
function showTime(){
    let date = new Date();
    let h = date.getHours(); // 0 - 23
    let m = date.getMinutes(); // 0 - 59
    let s = date.getSeconds(); // 0 - 59

    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;

    let time = h + ":" + m + ":" + s;
    document.getElementById("MyClockDisplay").innerText = time;
    document.getElementById("MyClockDisplay").textContent = time;

    setTimeout(showTime, 1000);
}
showTime();


document.addEventListener('DOMContentLoaded', () => {

    const getSort = ({ target }) => {
        const order = (target.dataset.order = -(target.dataset.order || -1));
        const index = [...target.parentNode.cells].indexOf(target);
        const collator = new Intl.Collator(['en', 'ru'], { numeric: true });
        const comparator = (index, order) => (a, b) => order * collator.compare(
            a.children[index].innerHTML,
            b.children[index].innerHTML
        );

        for(const tBody of target.closest('table').tBodies)
            tBody.append(...[...tBody.rows].sort(comparator(index, order)));

        for(const cell of target.parentNode.cells)
            cell.classList.toggle('sorted', cell === target);
    };

    document.querySelectorAll('.table_sort thead').forEach(tableTH => tableTH.addEventListener('click', () => getSort(event)));

});
