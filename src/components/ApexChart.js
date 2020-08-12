import React, { useState } from "react";
import Chart from "react-apexcharts";
import * as datefns from "date-fns";

export const ApexChart = () => {
  const offSett = 10;
  const [min, setMin] = useState(1);

  const [max, setMax] = useState(10);

  const series = [
    {
      data: [
        {
          x: "Due Date",
          y: [new Date("8/12/93").getTime(), new Date("8/13/93").getTime()],
          fillColor: "#5B80FF",
          pay: "",
        },
        {
          x: "Holiday (fake)",
          y: [new Date("8/2/93").getTime(), new Date("8/3/93").getTime()],
          fillColor: "#cac3f2",
          pay: "$2200",
        },
        {
          x: "PTO",
          y: [new Date("8/3/93").getTime(), new Date("8/11/93").getTime()],
          fillColor: "#ACE7DE",
          pay: "$2200",
        },
        {
          x: "NY Short-term Disability",
          y: [new Date("8/12/93").getTime(), new Date("9/25/93").getTime()],
          fillColor: "#a7befb",
          pay: "$1000",
        },
        {
          x: "Short-term Disability",
          y: [new Date("8/12/93").getTime(), new Date("9/25/93").getTime()],
          fillColor: "#FFCE79",
          pay: "$10",
        },
        {
          x: "Employer Paid Parental Leave *",
          y: [new Date("8/12/93").getTime(), new Date("8/26/93").getTime()],
          fillColor: "#cac3f2",
          pay: "$10",
        },

        {
          x: "NY Paid Family Leave *",
          y: [new Date("8/12/93").getTime(), new Date("10/22/93").getTime()],
          fillColor: "#a7a9b7",
          pay: "$10",
        },
        {
          x: "PTO",
          y: [new Date("10/22/93").getTime(), new Date("10/27/93").getTime()],
          fillColor: "#ACE7DE",
          pay: "$10",
        },
      ],
    },
  ];

  const options = {
    chart: {
      type: "rangeBar",
    },
    tooltip: {
      enabled: true,
      x: {
        show: false,
        // formatter: (value, opt) => {
        //   return "";
        // },
      },
      y: {
        // formatter: (value, opt) => {
        //   return "";
        // },
        // title: {
        //   formatter: (value, opt) => {
        //     return opt.w.globals.labels[opt.dataPointIndex];
        //   },
        // },
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
        dataLabels: {
          hideOverflowingLabels: false,
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        console.log(opts);
        console.log(val);
        const label = opts.w.config.series[0].data[opts.dataPointIndex].x;
        const pay = opts.w.config.series[0].data[opts.dataPointIndex].pay;
        const startDate = new Date(val[0]);
        const endDate = new Date(val[1]);
        const diffDate = datefns.differenceInWeeks(endDate, startDate);
        return `${label}: ${diffDate} weeks - ${pay}`;
        // const start = opts.w.config.series[0].data[opts.dataPointIndex].y[0];
        // const end = opts.w.config.series[0].data[opts.dataPointIndex].y[1];
        // return `${label} - ${weeks} week/s`;
        // return `${label} - ${end - start} week/s`;
        // return "";
      },
      style: {
        colors: ["black"],
      },
    },
    xaxis: {
      type: "datetime",
      // min,
      // max,
      position: "top",
      //   tickPlacement: "on",
    },
    yaxis: {
      show: false,
    },
    fill: {
      type: "solid",
      opacity: 0.4,
    },
    grid: {
      //   xaxis: {
      //     lines: {
      //       show: true,
      //     },
      //   },
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
  };

  return (
    <div>
      <button
        onClick={() => {
          setMin((prev) => prev - offSett);
          setMax((prev) => prev - offSett);
        }}
      >
        Go down
      </button>
      <button
        onClick={() => {
          setMin((prev) => prev + offSett);
          setMax((prev) => prev + offSett);
        }}
      >
        Go up
      </button>
      <Chart
        options={options}
        series={series}
        type="rangeBar"
        height={518}
        width={922}
      />
    </div>
  );
};
