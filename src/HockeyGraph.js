import React from 'react';
import Plot from 'react-plotly.js';

function formatData(data) {
  const [_, __, ___, penalties] = data;

  const formattedPenalties = {
    //teamNames: ["Montana State", "Other Team"],
    homeTeamName: ["Montana State"],
    awayTeamName: ["Other Team"],
    totalHomePenalties: [],
    totalAwayPenalties: [],
    ppGoalsHome: [],
    ppGoalsAway: [],
    color: ['#00205B'],
  };
  
  let a = [penalties[1][1].split('-'), penalties[2][1].split('-')];
  let b = Number(a[0][1] - a[0][0]);
  let c = Number(a[1][1] - a[1][0]);

  formattedPenalties.totalHomePenalties = [c];
  formattedPenalties.totalAwayPenalties = [b];
  formattedPenalties.ppGoalsHome = [a[1][0]];
  formattedPenalties.ppGoalsAway = [a[0][0]];

  return formattedPenalties;
}

function HockeyGraph(props) {
  const data = formatData(props.data);

  return (
    <Plot
      data={
        [
          //Home Team Shots
          {
            x: data.homeTeamName,
            y: data.ppGoalsHome,
            type: 'bar',
            mode: 'lines+points',
            marker: { color: data.color },
          },
          {
            x: data.homeTeamName,
            y: data.totalHomePenalties,
            type: 'bar',
            mode: 'lines+points',
            marker: { color: 'grey' },
            opacity: 0.2,
          },
          {
            x: data.awayTeamName,
            y: data.ppGoalsAway,
            type: 'bar',
            mode: 'lines+points',
            marker: { color: 'green' },
          },
          {
            x: data.awayTeamName,
            y: data.totalAwayPenalties,
            type: 'bar',
            mode: 'lines+points',
            marker: { color: 'grey' },
            opacity: 0.2,
          },
        ]
      }
      layout={{
        width: 600,
        height: 600,
        barmode: 'stack',
        plot_bgcolor: '#2d343e',
        paper_bgcolor: '#2d343e',
        showlegend: false,
        xaxis: {
          color: '#aaa',
          autotick: true,
          tickmode: 'array',
        },
        yaxis: { color: '#aaa' },
      }}
    />
  );
}
export default HockeyGraph;