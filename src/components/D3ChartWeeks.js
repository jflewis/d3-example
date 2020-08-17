import React, { useState, useRef, useEffect } from "react";
import * as datefns from "date-fns";
import * as d3 from "d3";

export const D3ChartWeeks = () => {
  const ref = useRef(null);
  const plans = [
    {
      name: "PTO",
      payout: 1200,
      range: [new Date("8/3/93"), new Date("8/11/93")],
    },
    {
      name: "PTO",
      payout: 1200,
      range: [new Date("8/22/93"), new Date("8/27/93")],
    },

    {
      name: "NY Short-term Disability",
      payout: 1200,
      range: [new Date("8/12/93"), new Date("9/25/93")],
    },
    {
      name: "Short-term Disability",
      payout: 1200,

      range: [new Date("8/12/93"), new Date("9/25/93")],
    },
    {
      name: "Employer Paid Parental Leave *",
      payout: 1200,

      range: [new Date("8/12/93"), new Date("8/26/93")],
    },
    {
      name: "NY Paid Family Leave *",
      payout: 1200,

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

  let allDates = plans.reduce((acc, curr) => {
    return acc.concat(...curr.range);
  }, []);
  const range = d3.extent(allDates);
  const totalWeeks = datefns.differenceInCalendarWeeks(range[1], range[0]);

  const [xDomain, setXDomain] = useState([0, 5]);

  // view data is data with x domain
  let viewData = plans.filter((plan) => {
    const start = datefns.differenceInWeeks(plan.range[0], range[0]);

    const end = datefns.differenceInWeeks(plan.range[1], range[0]);

    return start >= xDomain[0] && end <= xDomain[1];
  });

  console.log(viewData);

  const height = 693;
  const width = 954;
  const eventHeight = 26;
  const margin = { top: 30, right: 50, bottom: 10, left: 30 };

  useEffect(() => {
    const Tooltip = d3
      .select(ref.current)
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")
      .style("z-index", "100");

    var mouseover = function (d) {
      Tooltip.style("opacity", 1);
      d3.select(this).style("stroke", "black").style("opacity", 1);
    };

    var mousemove = function (d) {
      Tooltip.html(`$${d.payout} per week`)
        .style("left", window.event.pageX + "px")
        .style("top", window.event.pageY + "px");
    };
    var mouseleave = function (d) {
      Tooltip.style("opacity", 0);
      d3.select(this).style("stroke", "none").style("opacity", 0.8);
    };

    const x = d3
      .scaleLinear()
      // .domain([0, totalWeeks])
      .domain(xDomain)
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleBand()
      .domain(["events", ...plans.map((plane) => plane.name)])
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    const colors = ["#ACE7DE", "#a7befb", "#FFCE79", "#cac3f2", "#a7a9b7"];
    const unqiuenames = Array.from(new Set(plans.map((plan) => plan.name)));
    const colorScale = d3
      .scaleOrdinal()
      .domain(Array.from(unqiuenames))
      .range(colors);

    const svg = d3.select(ref.current).append("svg");

    const transistion = svg
      .transition()
      .duration(750)
      .delay(function (d, i) {
        return i * 10;
      });

    // create and style container
    svg.attr("viewBox", [0, 0, width, height]).attr("width", 965);

    // create axis
    const xAxis = (g) =>
      g
        .attr("transform", `translate(0,${margin.top})`)
        .call(d3.axisTop(x))
        .call((g) => g.select(".domain").remove())
        .call((g) =>
          g
            .selectAll(".tick text")
            .attr("font-family", "sans-serif")
            .attr("font-size", 16)
            .attr("dx", +10)
            .attr("dy", +10)
        );
    svg.append("g").call(xAxis);

    // Create grid
    const grid = (g) =>
      g
        .attr("stroke", "currentColor")
        .attr("stroke-opacity", 0.1)
        .call((g) =>
          g
            .append("g")
            .selectAll("line")
            .data(x.ticks())
            .join("line")
            .attr("x1", (d) => 0.5 + x(d))
            .attr("x2", (d) => 0.5 + x(d))
            .attr("y1", margin.top)
            .attr("y2", height - margin.bottom)
        );

    svg.append("g").call(grid);

    // Column range for plans
    svg
      .append("g")
      .attr("id", "bars")
      .selectAll("rect")
      .data(plans)
      .join((enter) =>
        enter
          .append("rect")
          .attr("class", "columns")
          .attr("fill", (d) => colorScale(d.name))
          .attr("x", (d) => {
            return x(datefns.differenceInWeeks(d.range[0], range[0]));
          })
          .attr("y", (d) => {
            return y(d.name);
          })
          .attr("rx", "4")
          .attr("width", 0)
          .attr("height", y.bandwidth())
          .on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("mouseleave", mouseleave)
          .call((enter) =>
            enter.transition(transistion).attr("width", (d) => {
              const startPosition = x(
                datefns.differenceInWeeks(d.range[0], range[0])
              );
              const endPosition = x(
                datefns.differenceInWeeks(d.range[1], range[0])
              );
              return endPosition - startPosition;
            })
          )
      );

    // place events
    svg
      .append("g")
      .attr("id", "bars")
      .attr("fill", "#5265da")
      .selectAll("rect")
      .data(events)
      .join("rect")
      .attr("rx", "4")
      .attr("x", (d) => {
        const start = x(datefns.differenceInWeeks(d.date, range[0]));
        return start;
      })
      .attr("y", y("events") + eventHeight)
      .attr("width", eventHeight)
      .attr("height", eventHeight);

    // place holidays
    svg
      .append("g")
      .attr("id", "bars")
      .attr("fill", "purple")
      .selectAll("rect")
      .data(holidays)
      .join("rect")
      .attr("x", (d) => {
        return x(datefns.differenceInWeeks(d.date, range[0]));
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
      .attr("text-anchor", "middle")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .selectAll("text")
      .data(plans)
      .join("text")
      .attr("x", (d) => {
        const startPosition = x(
          datefns.differenceInWeeks(d.range[0], range[0])
        );
        const endPosition = x(datefns.differenceInWeeks(d.range[1], range[0]));
        return (endPosition + startPosition) / 2;
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
  });

  return (
    <div>
      <button>back</button>
      <button>forward</button>
      <div ref={ref}></div>
    </div>
  );
};
