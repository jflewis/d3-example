import React, { useState, useRef, useEffect } from "react";
import * as datefns from "date-fns";
import * as d3 from "d3";

export const D3ColumnRange = () => {
  const ref = useRef(null);
  const plans = [
    {
      name: "PTO",
      data: [
        { range: [new Date("8/3/93"), new Date("8/11/93")] },
        // { range: [new Date("8/22/93"), new Date("8/27/93")] },
      ],
    },
    {
      name: "PTO",
      data: [
        // { range: [new Date("8/3/93"), new Date("8/11/93")] },
        { range: [new Date("8/22/93"), new Date("8/27/93")] },
      ],
    },
    {
      name: "Holiday",
      data: [
        {
          payout: 1200,
          range: [new Date("8/12/93"), new Date("9/25/93")],
        },
      ],
    },
    {
      name: "NY Short-term Disability",
      data: [
        {
          payout: 1200,
          range: [new Date("8/12/93"), new Date("9/25/93")],
        },
      ],
    },
    {
      name: "Short-term Disability",
      data: [
        {
          range: [new Date("8/12/93"), new Date("9/25/93")],
        },
      ],
    },
    {
      name: "Employer Paid Parental Leave *",
      data: [
        {
          range: [new Date("8/12/93"), new Date("8/26/93")],
        },
      ],
    },
    {
      name: "NY Paid Family Leave *",
      data: [
        {
          range: [new Date("8/12/93"), new Date("10/22/93")],
        },
      ],
    },
  ];
  const height = 500;
  const width = 954;
  const margin = { top: 20, right: 30, bottom: 30, left: 40 };

  useEffect(() => {
    let allDates = plans.reduce((acc, curr) => {
      let dates = [];
      curr.data.forEach((data) => {
        dates.push(...data.range);
      });

      return acc.concat(dates);
    }, []);
    const range = d3.extent(allDates);

    const x = d3.scaleTime().domain(range).range([0, width]);
    const y = d3
      .scaleBand()
      .domain(plans.map((plane) => plane.name))
      .range([0, height])
      .padding(0.2);

    const xAxis = (g) =>
      g
        // .attr("transform", `translate(0,${margin.top})`)
        .call(d3.axisBottom(x))
        .call((g) => g.select(".domain").remove());

    const svg = d3.select(ref.current);
    // style container
    svg.attr("viewBox", [0, 0, width, height]).attr("width", 900);

    svg.call(xAxis);

    // Column range
    svg
      .append("g")
      .attr("id", "bars")
      .attr("fill", "steelblue")
      .selectAll("rect")
      .data(plans)
      .join("rect")
      .attr("x", (d) => {
        return x(d.data[0].range[0]);
      })
      .attr("y", (d) => {
        return y(d.name);
      })
      .attr("width", (d) => {
        return x(d.data[0].range[1]) - x(d.data[0].range[0]);
      })
      .attr("height", y.bandwidth());

    // labels
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
        return (x(d.data[0].range[1]) + x(d.data[0].range[0])) / 2;
      })
      .attr("dx", +4)
      .attr("y", (d) => y(d.name) + y.bandwidth() / 2)
      .text((d) => d.name);
  }, [plans]);

  return (
    <div>
      <svg ref={ref}></svg>
    </div>
  );
};
