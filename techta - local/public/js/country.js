function getCountry(name) {
  document.getElementById("totalVaccinationCountry").innerHTML =
  "<p style='color:white;'>Hold Tight...</p>";
  document.getElementById("totalDeathCountry").innerHTML = "<p style='color:white;'>Hold Tight...</p>";
  document.getElementById("totalCasesCountry").innerHTML = "<p style='color:white;'>Hold Tight...</p>";
  document.getElementById("dropdownMenuLink").innerHTML = name;
  // Generate Current date in string
  var currentDate = new Date();
  var currentDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
  var currentDateStr = currentDate.toLocaleDateString();
  // change date format into dd-mm-yyyy
  var arr = currentDateStr.split("/");
  currentDateStr = `${arr[2]}-${arr[0]}-${arr[1]}`;

  //Last 30 days prior to today
  var last30Days = new Date(currentDate.setDate(currentDate.getDate() - 7));
  var last30DaysStr = last30Days.toLocaleDateString();
  var arr2 = last30DaysStr.split("/");
  last30DaysStr = `${arr2[2]}-${arr2[0]}-${arr2[1]}`;

  var date = [];
  var confirmedCase = [];
  var deathCase = [];
  var vaccination = [];

  //Retrieve data from server
  fetch(`http://localhost:5000/data/${name}/${last30DaysStr}/${currentDateStr}`)
    .then(function (res) {
      return res.json();
    })
    .then((obj) => {
      resultFound = true;
      for (let i = 0; i < obj.Confirmed[0].length; i++) {
        date.push(obj.Confirmed[0][i]);
      }
      for (let i = 0; i < obj.Confirmed[1].length; i++) {
        confirmedCase.push(obj.Confirmed[1][i]);
      }
      for (let i = 0; i < obj.Deaths[1].length; i++) {
        deathCase.push(obj.Deaths[1][i]);
      }
      for (let i = 0; i < obj.Vaccination[1].length; i++) {
        vaccination.push(obj.Vaccination[1][i]);
      }
    });

  const xhttp = new XMLHttpRequest();

  xhttp.onload = function () {
    //Display total cases, total Death and total vaccination
    var total = 0;
    for (let i = 0; i < confirmedCase.length; i++) {
      total += confirmedCase[i];
    }
    document.getElementById("confirm").innerHTML = total;
    total = 0;
    for (let i = 0; i < deathCase.length; i++) {
      total += deathCase[i];
    }
    document.getElementById("death").innerHTML = total;
    total = 0;
    for (let i = 0; i < vaccination.length; i++) {
      total += vaccination[i];
    }
    document.getElementById("vaccinated").innerHTML = total;
    //Confirimed case
    var options = {
      series: [
        {
          name: "Case ",
          data: confirmedCase,
        },
      ],
      chart: {
        type: "bar",
        height: 350,
        width: 1150,
        background: "#3a3c42",
        foreColor: "#CCC",
        fontFamily: "sans-serif",
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 2,
          opacity: 0.2,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 10,
          endingShape: "flat",
        },
      },
      grid: {
        borderColor: "#CCCCCC",
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: date,
        title: {
          text: "Date",
        },
      },
      yaxis: {
        axisBorder: {
          show: true,
          color: "#535A6C",
        },
        title: {
          text: "Number of Cases",
        },
      },
      title: {
        text: "Confirmed Cases past 7 days",
      },
      fill: {
        colors: ["#ffba66"],
        opacity: 5,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
    };

    var chart = new ApexCharts(
      document.querySelector("#totalCasesCountry"),
      options
    );
    document.getElementById("totalCasesCountry").innerHTML = "";
    chart.render();

    //Death Case
    var options = {
      series: [
        {
          name: "Case ",
          data: deathCase,
        },
      ],
      chart: {
        type: "bar",
        height: 350,
        width: 1150,
        background: "#3a3c42",
        foreColor: "#CCC",
        fontFamily: "sans-serif",
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 2,
          opacity: 0.2,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 10,
          endingShape: "rounded",
        },
      },
      grid: {
        borderColor: "#CCCCCC",
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: date,
        title: {
          text: "Date",
        },
      },
      yaxis: {
        axisBorder: {
          show: true,
          color: "#535A6C",
        },
        title: {
          text: "Number of Cases",
        },
      },
      title: {
        text: "Death Cases past 7 days",
      },
      fill: {
        colors: ["#ffba66"],
        opacity: 5,
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
    };

    var chart = new ApexCharts(
      document.querySelector("#totalDeathCountry"),
      options
    );
    document.getElementById("totalDeathCountry").innerHTML = "";
    chart.render();

    // Vaccination case
    //Death Case
    var options = {
      series: [
        {
          name: "Case ",
          data: vaccination,
        },
      ],
      chart: {
        type: "bar",
        height: 350,
        width: 1150,
        background: "#3a3c42",
        foreColor: "#CCC",
        fontFamily: "sans-serif",
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 2,
          opacity: 0.2,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 10,
          endingShape: "rounded",
        },
      },
      grid: {
        borderColor: "#CCCCCC",
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: date,
        title: {
          text: "Date",
        },
      },
      yaxis: {
        axisBorder: {
          show: true,
          color: "#535A6C",
        },
        title: {
          text: "Number of Cases",
        },
      },
      title: {
        text: "Vaccinated Cases past 7 days",
      },
      fill: {
        colors: ["#ffba66"],
        opacity: 5,
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
    };

    var chart = new ApexCharts(
      document.querySelector("#totalVaccinationCountry"),
      options
    );
    document.getElementById("totalVaccinationCountry").innerHTML = "";
    chart.render();
  };

  xhttp.open(
    "GET",
    `http://localhost:5000/data/${name}/${last30DaysStr}/${currentDateStr}`
  );
  xhttp.send();
}
