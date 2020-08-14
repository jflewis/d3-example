import React, { useState, useRef, useEffect } from "react";
import * as datefns from "date-fns";
import * as d3 from "d3";

export const D3ChartWeeks = () => {
  const ref = useRef(null);
  const plans = [
    {
      name: "PTO",
      range: [new Date("8/3/93"), new Date("8/11/93")],
    },
    {
      name: "PTO",
      range: [new Date("8/22/93"), new Date("8/27/93")],
    },

    {
      name: "NY Short-term Disability",
      payout: 1200,
      range: [new Date("8/12/93"), new Date("9/25/93")],
    },
    {
      name: "Short-term Disability",
      range: [new Date("8/12/93"), new Date("9/25/93")],
    },
    {
      name: "Employer Paid Parental Leave *",
      range: [new Date("8/12/93"), new Date("8/26/93")],
    },
    {
      name: "NY Paid Family Leave *",
      range: [new Date("8/12/93"), new Date("10/22/93")],
    },
  ];

  const events = [
    {
      name: "Due Date",
      date: new Date("8/12/1993"),
    },
    {
      name: "Return Date",
      date: new Date("10/22/93"),
    },
  ];

  const holidays = [
    {
      name: "National Freedom day",
      date: new Date("9/1/93"),
    },
  ];

  const height = 693;
  const width = 954;
  const margin = { top: 30, right: 50, bottom: 10, left: 30 };

  useEffect(() => {
    let allDates = plans.reduce((acc, curr) => {
      return acc.concat(...curr.range);
    }, []);
    const range = d3.extent(allDates);
    const totalWeeks = datefns.differenceInCalendarWeeks(range[1], range[0]);

    const x = d3
      .scaleLinear()
      .domain([0, totalWeeks])
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleBand()
      .domain(plans.map((plane) => plane.name))
      .range([margin.top, height - margin.bottom])
      .padding(0.2);

    const colors = ["#ACE7DE", "#a7befb", "#FFCE79", "#cac3f2", "#a7a9b7"];
    const unqiuenames = Array.from(new Set(plans.map((plan) => plan.name)));
    // console.log(Array.from(unqiuenames));
    const colorScale = d3
      .scaleOrdinal()
      .domain(Array.from(unqiuenames))
      .range(colors);

    // console.log(colorScale.domain());
    // console.log(colorScale("PTO"));
    // console.log(colorScale("NY Short-term Disability"));

    const xAxis = (g) =>
      g
        // .attr("transform", `translate(0,${margin.top})`)
        .call(d3.axisBottom(x))
        .call((g) => g.select(".domain").remove());

    const svg = d3.select(ref.current);
    const transistion = svg
      .transition()
      .duration(750)
      .delay(function (d, i) {
        return i * 10;
      });

    // style container
    svg.attr("viewBox", [0, 0, width, height]).attr("width", 965);
    svg.call(xAxis);

    // Column range for plans
    svg
      .append("g")
      .attr("id", "bars")
      .selectAll("rect")
      .data(plans)
      .join("rect")
      .attr("fill", (d) => colorScale(d.name))
      .attr("x", (d) => {
        return x(datefns.differenceInWeeks(d.range[0], range[0]));
      })
      .attr("y", (d) => {
        return y(d.name);
      })
      .attr("width", (d) => {
        const startPosition = x(
          datefns.differenceInWeeks(d.range[0], range[0])
        );
        const endPosition = x(datefns.differenceInWeeks(d.range[1], range[0]));
        return endPosition - startPosition;
      })
      .attr("height", y.bandwidth());

    // place events
    svg
      .append("g")
      .attr("id", "bars")
      .attr("fill", "red")
      .selectAll("rect")
      .data(events)
      .join("rect")
      .attr("x", (d) => {
        const start = x(datefns.differenceInWeeks(d.date, range[0]));
        return start;
      })
      .attr("y", (d) => {
        return 30;
      })
      .attr("width", (d) => {
        return 20;
      })
      .attr("height", 20);

    // place holidays
    svg
      .append("g")
      .attr("id", "bars")
      .attr("fill", "purple")
      .selectAll("rect")
      .data(holidays)
      .join("rect")
      .attr("x", (d) => {
        console.log(d);
        const start = x(datefns.differenceInWeeks(d.date, range[0]));
        console.log(start);
        return start;
      })
      .attr("y", (d) => {
        return 15;
      })
      .attr("width", (d) => {
        return 3;
      })
      .attr("height", height);

    // Plan labels
    svg
      .append("g")
      .attr("fill", "black")
      .attr("text-anchor", "end")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .selectAll("text")
      .data(plans)
      .join("text")
      .attr("x", (d) => {
        // Middle
        // const startPosition = x(
        //   datefns.differenceInWeeks(d.range[0], range[0])
        // );
        // const endPosition = x(datefns.differenceInWeeks(d.range[1], range[0]));
        // return (endPosition + startPosition) / 2;

        // End
        return x(datefns.differenceInWeeks(d.range[1], range[0]));
      })
      .attr("dx", -4)
      .attr("y", (d) => y(d.name) + y.bandwidth() / 2)
      .text((d) => d.name);

    // event labels
    svg
      .append("g")
      .attr("fill", "black")
      .attr("text-anchor", "end")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .selectAll("text")
      .data(events)
      .join("text")
      .attr("x", (d) => {
        // Middle
        // const startPosition = x(
        //   datefns.differenceInWeeks(d.range[0], range[0])
        // );
        // const endPosition = x(datefns.differenceInWeeks(d.range[1], range[0]));
        // return (endPosition + startPosition) / 2;

        // End
        return x(datefns.differenceInWeeks(d.date, range[0])) + 20;
      })
      .attr("dx", +4)
      .attr("y", (d) => 30 + 20 / 2)
      .text((d) => d.name);

    // Holiday labels
    svg
      .append("g")
      .attr("fill", "black")
      .attr("text-anchor", "start")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .selectAll("text")
      .data(holidays)
      .join("text")
      .attr("x", (d) => {
        // Middle
        // const startPosition = x(
        //   datefns.differenceInWeeks(d.range[0], range[0])
        // );
        // const endPosition = x(datefns.differenceInWeeks(d.range[1], range[0]));
        // return (endPosition + startPosition) / 2;

        // End
        return x(datefns.differenceInWeeks(d.date, range[0]));
      })
      .attr("dx", +4)
      .attr("y", (d) => 30 + 20 / 2)
      .text((d) => d.name);
  }, [plans]);

  return (
    <div>
      <svg ref={ref}></svg>
    </div>
  );
};
