import React from 'react';
import Plot from 'react-plotly.js';

function formatData(data) {
  const [homeScores, awayScores, shots] = data;

  const xValues = shots[0].slice(1, 4);

  const formattedData = {
    teams: [],
    scores: [],
  };

  shots.slice(1, 3).forEach(team => {
    let data = team.slice(1, 4).map(i => parseInt(i));

    let out = [];
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i];
      out.push(sum);
    }

    formattedData.teams.push({
      team_name: team[0],
      y: [0, ...out],
    });
  });

  formattedData.teams.forEach(team => {
    team.x = [0, ...xValues];
  });

  const formattedHomeScores = formatScores(homeScores);
  const formattedAwayScores = formatScores(awayScores);

  formattedData.scores.push(formattedHomeScores);
  formattedData.scores.push(formattedAwayScores);
  console.log(formattedData);
  return formattedData;
}

function formatScores(scores) {
  return scores.map(score => {
    return {
      x: [score[3]],
      y: [score[4]],
      title: [score[6]],
    };
  }).reduce((s1, s2) => {
    return {
      x: [...s1.x, ...s2.x],
      y: [...s1.y, ...s2.y],
      title: [...s1.title, ...s2.title],
    };
  });
}

function HockeyPlot(props) {
  const data = formatData(props.data);

  return (
    <Plot
      data={
        [
          //Home Team Shots
          {
            name: data.teams[0].team_name,
            x: data.teams[0].x,
            y: data.teams[0].y,
            type: 'scatter',
            mode: 'lines+points',
            line: {
              color: 'green',
              width: 10
            }
          },
          //Away Team Shots 
          {
            name: data.teams[1].team_name,
            x: data.teams[1].x,
            y: data.teams[1].y,
            type: 'scatter',
            mode: 'lines+points',
            line: {
              color: 'red',
              width: 10
            }
          },
          // ...data.teams.map(team => {
          //   return {
          //     name: team.team_name,
          //     x: team.x,
          //     y: team.y,
          //     type: 'scatter',
          //     mode: 'lines+points',
          //     marker: {color: 'red'},
          //   };
          // }),

          //AwayScores
          {
            x: data.scores[0].x,
            y: data.scores[0].y,
            mode: 'markers+text',
            text: data.scores[0].title,
            textposition: 'top left',
            textfont: {
              color: '#fff',
              size: 20,
            },
            marker: {
              color: 'pink',
              size: 20,
            }
          },
          //Home Scores
          {
            x: data.scores[1].x,
            y: data.scores[1].y,
            mode: 'markers+text',
            text: data.scores[1].title,
            textposition: 'top left',
            textfont: { color: '#fff' },
            marker: {
              color: 'yellow',
              size: 20
            },
          },
          // ...data.scores.map(score => {
          //   return {
          //     x: score.x,
          //     y: score.y,
          //     mode: 'markers+text',
          //     name: '',
          //     text: score.title,
          //     textposition:'top left',
          //     textfont: { color: '#fff' },
          //     marker: { color: 'pink'}
          //   };
          // }),
        ]
      }
      layout={{
        width: 1280,
        height: 720,
        plot_bgcolor: '#2d343e',
        paper_bgcolor: '#2d343e',
        showlegend: false,
        xaxis: {
          color: '#aaa',
          autotick: false,
          tickvals: [1, 2, 3],
          ticktext: ['End of 1st', 'End of 2nd', 'End of 3rd'],
          tickmode: 'array',
        },
        yaxis: {
          color: '#aaa',
          zerolinecolor: '#969696',
          zerolinewidth: 4,
        },
      }}
    />
  );
}
export default HockeyPlot;