import React, { useState } from "react";
import Chart from "react-google-charts";
import * as datefns from "date-fns";

export const GoogleChart = () => {
  const offSett = 10;
  const [min, setMin] = useState(1);

  const [max, setMax] = useState(10);

  return (
    <Chart
      width={"100%"}
      height={"200px"}
      chartType="Timeline"
      loader={<div>Loading Chart</div>}
      data={[
        [
          { type: "string", id: "Position" },
          { type: "string", id: "Name" },
          { type: "date", id: "Start" },
          { type: "date", id: "End" },
          { type: "string", id: "style", role: "style" },
        ],
        [
          "events",
          "Due Date",
          new Date("8/12/93"),
          new Date("8/12/93"),
          "#5B80FF",
        ],
        [
          "events",
          "Return to work",
          new Date("10/22/93"),
          new Date("10/22/93"),
          "#5B80FF",
        ],

        [
          "Holiday",
          "Special holiday",
          new Date("8/15/93"),
          new Date("8/15/93"),
          "#cac3f2",
        ],
        ["PTO", "PTO", new Date("8/3/93"), new Date("8/11/93"), "#ACE7DE"],
        [
          "NY Short-term Disability",
          "NY Short-term Disability",
          new Date("8/12/93"),
          new Date("9/25/93"),
          "#a7befb",
        ],
        [
          "Short-term Disability",
          "Short-term Disability",
          new Date("8/12/93"),
          new Date("9/25/93"),
          "#FFCE79",
        ],
        [
          "Employer Paid Parental Leave *",
          "Employer Paid Parental Leave *",
          new Date("8/12/93"),
          new Date("8/26/93"),
          "#cac3f2",
        ],
        [
          "NY Paid Family Leave *",
          "NY Paid Family Leave *",
          new Date("8/12/93"),
          new Date("10/22/93"),
          "#a7a9b7",
        ],
        ["PTO", "PTO", new Date("8/22/93"), new Date("8/27/93"), "#ACE7DE"],
      ]}
      options={{
        timeline: {
          colorByRowLabel: true,
          showRowLabels: false,
        },
        backgroundColor: "#ffffff",
        avoidOverlappingGridLines: false,
      }}
      rootProps={{ "data-testid": "3" }}
    />
  );
};
