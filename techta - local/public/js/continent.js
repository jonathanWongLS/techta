var continents = [];
var deathPerMillion = [];
var recoveredPerMillion = [];
var totalActive = [];
var totalCases = [];
var totalDeath = [];
var totalCritical = [];
var totalRecovered = [];
var totalTested = [];

fetch('http://localhost:5000/data/continents').then(function (res) {
    return res.json();
}).then(obj => {

    //retrieve data from server
    for (let i = 0; i < obj.continents.length; i++) {
        continents.push(obj.continents[i]);
    }
    for (let i = 0; i < obj.deathPerMillion.length; i++) {
        deathPerMillion.push(obj.deathPerMillion[i]);
    }
    for (let i = 0; i < obj.recoveredPerMillion.length; i++) {
        recoveredPerMillion.push(obj.recoveredPerMillion[i]);
    }
    for (let i = 0; i < obj.totalActive.length; i++) {
        totalActive.push(obj.totalActive[i]);
    }
    for (let i = 0; i < obj.totalCases.length; i++) {
        totalCases.push(obj.totalCases[i]);
    }
    for (let i = 0; i < obj.totalCritical.length; i++) {
        totalCritical.push(obj.totalCritical[i]);
    }
    for (let i = 0; i < obj.totalDeath.length; i++) {
        totalDeath.push(obj.totalDeath[i]);
    }
    for (let i = 0; i < obj.totalRecovered.length; i++) {
        totalRecovered.push(obj.totalRecovered[i]);
    }
    for (let i = 0; i < obj.totalTested.length; i++) {
        totalTested.push(obj.totalTested[i]);
    }
})

const xhttp_continent = new XMLHttpRequest();
//Graphing 
xhttp_continent.onload = function () {
    // Bar Chart 
    var options = {
        series: [{
            name: 'Total Cases',
            data: totalCases
        }, {
            name: 'Total Tested',
            data: totalTested
        }],
        chart: {
            type: 'bar',
            foreColor: '#CCC',
            background: '#3a3c42',
            height: 430,
            width: 700,
        },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 2,
            }
        },
        grid: {
            borderColor: "#CCCCCC",
            xaxis: {
                lines: {
                    show: true
                }
            },
            yaxis: {
                lines: {
                    show: true
                }
            }
        },
        dataLabels: {
            enabled: false,
            offsetX: 0,
            style: {
                fontSize: '12px',
                colors: ['#fff']
            },
        },
        stroke: {
            show: true,
            width: 1,
            colors: ['#fff']
        },
        tooltip: {
            shared: true,
            intersect: false
        },
        xaxis: {
            categories: continents,
            title: {
                text: "Number of Cases",
            }
        },
        yaxis: {
            title: {
                text: "Continents",
            }
        },
        title: {
            text: 'Number of Tested Cases and Number of Total Cases',
        }
    };

    var chart = new ApexCharts(document.querySelector("#barChart"), options);
    chart.render();

    //Multiple Column Chart
    var options = {
        series: [{
            name: 'Total Cases ',
            data: totalCases
        }, {
            name: 'Total Deaths ',
            data: totalDeath
        }, {
            name: 'Total Recovered ',
            data: totalRecovered
        }, {
            name: 'Total Active ',
            data: totalActive
        }, {
            name: 'Total Critical ',
            data: totalCritical
        }],
        chart: {
            type: 'bar',
            height: 875,
            width: 700,
            foreColor: '#CCC',
            background: '#3a3c42',
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '70%',
                endingShape: 'rounded'
            },
        },
        grid: {
            borderColor: "#CCC",
            xaxis: {
                lines: {
                    show: true
                }
            },
            yaxis: {
                lines: {
                    show: true
                }
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: continents,
            title: {
                text: 'Continents'
            }
        },
        yaxis: {
            title: {
                text: 'Number of Cases'
            }
        },
        fill: {
            opacity: 1
        },
        title: {
            text: "Overall View",
        },
    };

    var chart = new ApexCharts(document.querySelector("#columnChart"), options);
    chart.render();

    //Bubble Chart
    //Finding min and max value of deathPerMillion and recoveredPerMillion
    var minDeathPerMillion = Infinity;
    var maxDeathPerMillion = 0;
    var minRecoveredPerMillion = Infinity;
    var maxRecoveredPerMillion = 0;

    for (let i = 0; i < deathPerMillion.length; i++) {
        if (deathPerMillion[i] > maxDeathPerMillion) {
            maxDeathPerMillion = deathPerMillion[i];
        }
        if (deathPerMillion[i] < minDeathPerMillion) {
            minDeathPerMillion = deathPerMillion[i];
        }
    }

    for (let i = 0; i < recoveredPerMillion.length; i++) {
        if (recoveredPerMillion[i] > maxRecoveredPerMillion) {
            maxRecoveredPerMillion = recoveredPerMillion[i];
        }
        if (recoveredPerMillion[i] < minRecoveredPerMillion) {
            minRecoveredPerMillion = recoveredPerMillion[i];
        }
    }
    /*
    // this function will generate output in this format
    // every array in data is of the format [x, y, z] where x (continents) and y (deathPerMillion and RecoveredPerMillion) are the two axes coordinates,
    // z is the third coordinate, which you can interpret as the size of the bubble formed too.
    */
    function generateData(arr, count, yrange) {
        var i = 0;
        var series = [];
        base_value = 10;
        while (i < count) {
            var x = base_value;
            var y = arr[i];
            //var z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;

            series.push([x, y, 10]);
            //baseval += 86400000;
            i++;
            base_value += 10;
        }
        return series;
    }

    var options = {
        series: [{
            name: 'RecoveredPerMillion',
            data: generateData(recoveredPerMillion, recoveredPerMillion.length)
        },
        {
            name: 'DeathPerMillion',
            data: generateData(deathPerMillion, deathPerMillion.length)
        }],
        chart: {
            height: 430,
            width: 700,
            type: 'bubble',
            foreColor: '#CCC',
            background: '#3a3c42',
        },
        dataLabels: {
            enabled: false
        },
        legend: {
            position: 'bottom',
            horizontalAlign: 'center',
        },
        fill: {
            opacity: 0.8
        },
        title: {
            text: 'DeathPerMillon vs RecoveredPerMillion '
        },
        xaxis: {
            tickAmount: 12,
            type: 'category',
            overwriteCategories: continents,
            forceNiceScale: false,
            tooltip:{
                enabled:false,
            }
        },
        yaxis: {
            title: {
                text: "Value",
            }
        },
        tooltip: {
            enabled: true,
            x:{
                formatter: function(val){
                    var index = (val/10)-1;
                    return continents[index]
                }
            },
            y: {
                formatter: function (val) {
                    return val
                }
            },
        }
    }

    var chart = new ApexCharts(document.querySelector("#bubbleChart"), options);
    chart.render();

}


xhttp_continent.open('GET', 'http://localhost:5000/data/continents');
xhttp_continent.send();