import React, { useState, useRef, useEffect } from "react";
import * as datefns from "date-fns";
import * as d3 from "d3";

export const D3Chart = () => {
  const ref = useRef(null);
  let width = 954;
  let height = 693;
  const margin = { top: 30, right: 0, bottom: 10, left: 10 };
  const plans = [
    {
      name: "PTO",
      data: [
        { range: [new Date("8/3/93"), new Date("8/11/93")] },
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

  useEffect(() => {
    const x = d3
      .scaleLinear()
      .domain([
        1,
        d3.max(plans, (plan) => {
          let totalWeeks = 0;
          plan.data.forEach((data) => {
            const startDate = data.range[0];
            const endDate = data.range[1];
            totalWeeks += datefns.differenceInWeeks(endDate, startDate);
          });
          return totalWeeks;
        }),
      ])
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleBand()
      .domain(plans.map((plan) => plan.name))
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    const xAxis = (g) =>
      g
        .attr("transform", `translate(0,${margin.top})`)
        .call(d3.axisTop(x).ticks(width / 80))
        .call((g) => g.select(".domain").remove());

    const svg = d3.select(ref.current);
    svg.attr("viewBox", [0, 0, width, height]);

    // Bars
    svg
      .append("g")
      .attr("fill", "steelblue")
      .selectAll("rect")
      .data(plans)
      .join("rect")
      .attr("x", x(0))
      .attr("y", (d, i) => y(d.name))
      .attr("width", (d) => {
        let weeks = 0;
        d.data.forEach((data) => {
          const startDate = data.range[0];
          const endDate = data.range[1];
          weeks += datefns.differenceInWeeks(endDate, startDate);
        });
        return x(weeks) - x(0);
      })
      .attr("height", y.bandwidth());

    // label
    svg
      .append("g")
      .attr("fill", "white")
      .attr("text-anchor", "end")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .selectAll("text")
      .data(plans)
      .join("text")
      .attr("x", (d) => {
        let weeks = 0;
        d.data.forEach((data) => {
          const startDate = data.range[0];
          const endDate = data.range[1];
          weeks += datefns.differenceInWeeks(endDate, startDate);
        });
        return x(weeks) / 2;
      })
      .attr("y", (d) => y(d.name) + y.bandwidth() / 2)
      .attr("dy", "0.35em")
      .attr("dx", -4)
      .text((d) => d.name)
      .call((text) =>
        text
          .filter((d) => {
            let weeks = 0;
            d.data.forEach((data) => {
              const startDate = data.range[0];
              const endDate = data.range[1];
              weeks += datefns.differenceInWeeks(endDate, startDate);
            });
            return x(weeks) / 2 - x(0) < 300;
          })
          //   (d) => x(d.value) - x(0) < 20) // short bars
          .attr("dx", +4)
          .attr("fill", "black")
          .attr("text-anchor", "start")
      );

    svg.append("g").call(xAxis);

    return () => {
      console.log("clean");
    };
  }, [plans]);

  //   const events = [
  //     {
  //       name: "Due Date",
  //       date: new Date("8/12/93"),
  //     },
  //     {
  //       name: "Return to work",
  //       date: new Date("10/22/93"),
  //     },
  //   ];

  //   Calculate total weeks and days

  let allDates = plans.reduce((acc, curr) => {
    let dates = [];
    curr.data.forEach((data) => {
      dates.push(...data.range);
    });

    return acc.concat(dates);
  }, []);
  const range = d3.extent(allDates);
  console.log(range);

  return (
    <div>
      {/* <h1>Events</h1>
      {events.map((event) => {
        return (
          <>
            <h2>{event.name}</h2>
            <p>{event.date.toString()}</p>
          </>
        );
      })}
      <h1>
        Plans - {totalWeeks} weeks/ {totalDays} Business days
      </h1>
      {plans.map((plan) => {
        let weeks = 0;
        let days = 0;
        plan.data.forEach((data) => {
          const startDate = data.range[0];
          const endDate = data.range[1];
          days += datefns.differenceInBusinessDays(endDate, startDate);
          weeks += datefns.differenceInWeeks(endDate, startDate);
        });
        return (
          <>
            <h2>{plan.name}</h2>
            <p>Days: {days}</p>
            <p>Weeks: {weeks}</p>
          </>
        );
      })} */}
      <p>
        Start: {range[0].toString()}, End: {range[1].toString()}
      </p>
      <svg ref={ref}></svg>
    </div>
  );
};
