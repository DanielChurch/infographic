import React from 'react';
import Plot from 'react-plotly.js';

function formatData(data) {
  const [_, __, ___, penalties] = data;

  const formattedPenaltyMinutes = {
    homeTeamName: ["Montana State"],
    awayTeamName: ["Other Team"],
    homePenaltyMinutes: [],
    awayPenaltyMinutes: [],
    color: ['#00205B'],
  };

  formattedPenaltyMinutes.awayPenaltyMinutes = [penalties[1][2]];
  formattedPenaltyMinutes.homePenaltyMinutes = [penalties[2][2]];

  return formattedPenaltyMinutes;
}

function penaltyMinutesGraph(props) {
  const data = formatData(props.data);

  return (
    <Plot
      data={
        [
          //Home Team Shots
          {
            x: data.homeTeamName,
            y: data.homePenaltyMinutes,
            type: 'bar',
            mode: 'lines+points',
            marker: { color: data.color },
          },
          {
            x: data.awayTeamName,
            y: data.awayPenaltyMinutes,
            type: 'bar',
            mode: 'lines+points',
            marker: { color: 'green' },
          },
        ]
      }
      layout={{
        width: 600,
        height: 600,
        barmode: 'stack',
        font: {
          family: 'Courier New, monospace',
          size: 72,
          color: '#7f7f7f'
        },
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
export default penaltyMinutesGraph;