import React, { useState, useEffect } from 'react';

import './App.css';
import Header from './Header';
import HockeyPlot from './HockeyPlot';
import HockeyGraph from './HockeyGraph';
import PenaltyMinutesGraph from './penaltyMinutesGraph';
import ScoreTitle from './ScoreTitle';
import SavePercentage from './SavePercentage';
import HomeScore from './HomeScore';
import AwayScore from './AwayScore';
import Screenshot from './Screenshot';
import ShotsGraph from './shotsGraph';
import HomePlayerScores from './HomePlayerScores';
import AwayPlayerScores from './AwayPlayerScores';
import HomeImage from './HomeImage';
import AwayImage from './AwayImage';
import GameDate from './GameDate';
import DownloadImage from './DownloadImage';
import NoShots from './NoShots';

const request = require('request');
const cheerio = require('cheerio');

let homeScores = [];
let awayScores = [];
let teamColors = [];

function App() {
  const [url, setUrl] = useState();
  let textInputRef = React.createRef();

  if (!url) {
    return (
      <div className="contentWrapper">
        <div>
          <p class="h7">
            <strong>Infographics</strong> provide a clean, visually appealing
            way to show game scores and results
          </p>
          <input
            className="field"
            type="url"
            placeholder="Paste in a URL to generate an infographic"
            ref={ref => (textInputRef = ref)}
            onKeyPress={(ev) => {
              console.log(`Pressed keyCode ${ev.key}`);
              if (ev.key === 'Enter') {
                // Do code here
                setUrl(textInputRef.value);
                ev.preventDefault();
              }
            }}
          />
          <button
            className="button"
            onClick={() => {
              setUrl(textInputRef.value);
            }}
          >
            Generate
          </button>
        </div>
        <p class="h7">
          See <strong>examples</strong> below...
        </p>
      </div>
    );
  }
  return <Plots url={'https://cors-anywhere.herokuapp.com/' + url} />;
}

function Plots({ url }) {
  const [data, setData] = useState();

  async function fetchTableData() {
    const data = await scrape_table(url);
    console.log(data);
    const filteredData = dataFilter(data);
    setData(filteredData);
  }

  useEffect(() => {
    fetchTableData();
  }, []);

  if (!data) return <div> Loading... </div>;

  return (
    <div className="App">
      <NoShots data={data}/>
      {/* <div id="screenshot">
        <Screenshot />
      </div>
      <p class="h7">Your image preview is below</p>
      <DownloadImage />
      <div className="AppBody">
        <div
          className="homeWrapper"
          style={{
            background: `linear-gradient(to right, ${data[8][0]}, #282c34)`
          }}
        >
          <div className="homeLogo">
            <HomeImage data={data} />
          </div>
          <div className="homeScore">
            <HomeScore data={data} />
          </div>
        </div>
        <div className="middleWrapper">
          <div className="header">
            <Header data={data} />
          </div>
          <div className="scoreTitleWrapper">
            <div className="scoreTitle">
              <ScoreTitle data={data} />
            </div>
            <div className="scoringSummaryTitle">
              <GameDate data={data} />
            </div>
          </div>
        </div>
        <div
          className="awayWrapper"
          style={{
            background: `linear-gradient(to left, ${data[8][1]}, #282c34)`
          }}
        >
          <div className="awayLogo">
            <AwayImage data={data} />
          </div>
          <div className="awayScore">
            <AwayScore data={data} />
          </div>
        </div>
        <div
          className="homePlayerScores"
          style={{
            background: `linear-gradient(to right, ${data[8][0]}, #282c34)`
          }}
        >
          <div>
            <HomePlayerScores data={data} />
          </div>
        </div>
        <div className="lineChart">
          <HockeyPlot data={data} />
        </div>
        <div
          className="awayPlayerScores"
          style={{
            background: `linear-gradient(to left, ${data[8][1]}, #282c34)`
          }}
        >
          <div>
            <AwayPlayerScores data={data} />
          </div>
        </div>
        <div className="ppGoals">
          <HockeyGraph data={data} />
        </div>
        <div className="ppMin">
          <PenaltyMinutesGraph data={data} />
        </div>
        <div className="shotsGraph">
          <ShotsGraph data={data} />
        </div>
        <div className="savePercentage">
          <SavePercentage data={data} />
        </div>
      </div> */}
    </div>
  );
}

function getWebsiteHtml(url) {
  return new Promise((resolve, reject) => {
    request(url, function(error, response, html) {
      if (!error && response.statusCode === 200) {
        resolve(html);
      } else {
        console.log(error);
        reject('no');
      }
    });
  });
}

function getColors(homeColor1, awayColor1) {
  let json = require('./test.json');
  console.log(json);
  let homeColor;
  let awayColor;
  for (let i = 0; i < json.length; i++) {
    if (homeColor1 === json[i][0]) {
      homeColor = json[i][1];
    }
    if (awayColor1 === json[i][0]) {
      awayColor = json[i][1];
    }
  }
  teamColors = [homeColor, awayColor];
}

async function scrape_table(url) {
  homeScores = [];
  awayScores = [];

  const html = await getWebsiteHtml(url);
  const $ = cheerio.load(html);
  let shots = [];
  let score = [];
  let penalties = [];
  let teamScore = [];
  let teamNames = [];
  let scores = [];
  let goalieValues = [];
  // finds each table
  $('html')
    .find('table')
    .each((_, t) => {
      const table = $(t);

      const shotValues = {
        cellpadding: 2,
        cellspacing: 0,
        width: '80%',
        border: 0
      };

      const tableKeys = Object.keys(table.attr());

      if (
        Object.keys(shotValues).length === tableKeys.length &&
        tableKeys.every(key => table.attr(key) === `${shotValues[key]}`)
      ) {
        table.find('tr').each((_, row) => {
          const rowValues = [];

          $(row)
            .find('td')
            .each((_, td) => {
              rowValues.push(
                $(td)
                  .html()
                  .trim()
                  .replace(/&#xA0;/g, '')
              );
            });

          shots.push(rowValues);
        });
      }

      const scoreValues = {
        cellpadding: 2,
        cellspacing: 0,
        width: '80%'
      };

      if (
        Object.keys(scoreValues).length === tableKeys.length &&
        tableKeys.every(key => table.attr(key) === `${scoreValues[key]}`)
      ) {
        table.find('tr').each((_, row) => {
          const rowValues = [];

          $(row)
            .find('td')
            .each((_, td) => {
              rowValues.push(
                $(td)
                  .html()
                  .trim()
                  .replace(/&#xA0;/g, '')
              );
            });

          score.push(rowValues);
        });
      }

      const penaltyValues = {
        width: '98%',
        border: 0,
        cellspacing: 0,
        cellpadding: 2
      };

      if (
        Object.keys(penaltyValues).length === tableKeys.length &&
        tableKeys.every(key => table.attr(key) === `${penaltyValues[key]}`)
      ) {
        table.find('tr').each((_, row) => {
          const rowValues = [];

          $(row)
            .find('td')
            .each((_, td) => {
              rowValues.push(
                $(td)
                  .html()
                  .trim()
                  .replace(/&#xA0;/g, '')
              );
            });

          penalties.push(rowValues);
        });
      }

      const teamScoreValues = {
        width: 720,
        border: 0,
        cellspacing: 0,
        cellpadding: 0
      };

      if (
        Object.keys(teamScoreValues).length === tableKeys.length &&
        tableKeys.every(key => table.attr(key) === `${teamScoreValues[key]}`)
      ) {
        table.find('tr').each((_, row) => {
          const rowValues = [];

          $(row)
            .find('td')
            .each((_, td) => {
              rowValues.push(
                $(td)
                  .html()
                  .trim()
                  .replace(/&#xA0;/g, '')
              );
            });

          teamScore.push(rowValues);
        });
      }

      const goalies = {
        width: '99%',
        cellspacing: 0,
        cellpadding: 0,
        border: 0
      };

      if (
        Object.keys(goalies).length === tableKeys.length &&
        tableKeys.every(key => table.attr(key) === `${goalies[key]}`)
      ) {
        table.find('tr').each((_, row) => {
          const rowValues = [];

          $(row)
            .find('td')
            .each((_, td) => {
              rowValues.push(
                $(td)
                  .html()
                  .trim()
                  .replace(/&#xA0;/g, '')
              );
            });

          const regex = RegExp('.*(win).*|.*(loss).*', 'g');
          for (let i = 0; i < rowValues.length; i++) {
            if (regex.test(rowValues[i])) {
              goalieValues.push(rowValues[i].replace(/\d+|\(.*\)/g, '').trim());
            }
          }
        });
      }
    });

  // Code from here to "end" collects team names and scores
  let unformattedTeamNames = $('.gameinfo')
    .html()
    .split('<br>')[4]
    .split('<span class="big">');
  for (let i = 0; i < unformattedTeamNames.length; i++) {
    let a = unformattedTeamNames[i].replace(/<(.|\n)*?>/g, '');
    let b = a.replace(/\d\sat\s/g, '');
    let c = b.trim();
    teamNames.push(c);
    let e = a.replace(/(?=at).*$/g, '');
    let f = e.trim();
    scores.push(f);
  }
  teamNames.pop();
  scores.shift();
  // end
  // Get game date
  let unformattedGameDate = $('.gameinfo')
    .html()
    .split('<br>')[2];
  let gameDate = unformattedGameDate.replace(/, 20\d\d(.*)|at/g, '');
  console.log(unformattedGameDate)
  shotTableValidator(shots);
  removeItems(teamScore);
  makeTime(teamScore);
  getHomeScores(teamScore);
  getCoordinates(shots[2], homeScores);
  getCoordinates(shots[1], awayScores);
  getColors(teamNames[1], teamNames[0]);
  let finalData = [
    homeScores,
    awayScores,
    shots,
    penalties,
    teamNames,
    scores,
    goalieValues,
    gameDate,
    teamColors
  ];
  return finalData;
}

// removes all unecessary items from array
function removeItems(p1) {
  p1.splice(0, 1);
  for (let i = 0; i < p1.length; i++) {
    p1[i].length = 6;
    p1[i].splice(3, 1);
    p1[i].splice(1, 1);
    //if there are no scores reported return thay key
    if (p1[i][0] === '') {
      //removes all keys after last reported score
      p1.length = i;
    }
  }
  return p1;
}

function shotTableValidator(shotTable) {
  console.log(shotTable)
   if (shotTable[0].length == 2 && shotTable[0][1] == 'Total') {
      let homeShotPlaceholder = parseInt(shotTable[2][1]) / 3;
      let awayShotPlaceholder = parseInt(shotTable[1][1]) / 3;
      shotTable[0].splice(1, 0, '1');
      shotTable[0].splice(2, 0, '2');
      shotTable[0].splice(3, 0, '3');
      shotTable[1].splice(1, 0, awayShotPlaceholder.toString() );
      shotTable[1].splice(2, 0, awayShotPlaceholder.toString() );
      shotTable[1].splice(3, 0, awayShotPlaceholder.toString() );
      shotTable[2].splice(1, 0, homeShotPlaceholder.toString() );
      shotTable[2].splice(2, 0, homeShotPlaceholder.toString() );
      shotTable[2].splice(3, 0, homeShotPlaceholder.toString() );
    }
    // maybe have this stuff search for a "final" column and pass in values if found to make this work with hockeyplot.js
    // for (let i = 0; i < data[2].length; i++) {
    //   if (data[2][0][i] ){}
    // }
    console.log(shotTable) 
  return shotTable;
}

// converts time from min:sec format to units of time (incorporates periods)
function makeTime(p2) {
  for (let i = 0; i < p2.length; i++) {
    let a = p2[i][2].split(':');
    let b = (+a[0] * 60 + +a[1]) / 1200;
    let seconds = Number(Math.max(Math.round(b * 100) / 100).toFixed(2));
    if (p2[i][1] === '1') {
      let c = seconds;
      p2[i][2] = c;
    } else if (p2[i][1] === '2') {
      let d = seconds + 1;
      p2[i][2] = d;
    } else if (p2[i][1] === '3') {
      let e = seconds + 2;
      p2[i][2] = e;
    } else if (p2[i][1] === 'OT') {
      let f = seconds + 3;
      p2[i][2] = f;
    }
  }
  return p2;
}

// Splits array into two arrays containg home or away scores
function getHomeScores(p3) {
  let score = [];
  score.unshift(['0', '0']);
  for (let i = 0; i < p3.length; i++) {
    let a = p3[i][0].split(' - ');
    score.push(a);
  }
  for (let j = 0; j < p3.length; j++) {
    if (score[j][0] === score[j + 1][0]) {
      p3[j].unshift('Home score');
      homeScores.push(p3[j]);
    } else {
      p3[j].unshift('Away score');
      awayScores.push(p3[j]);
    }
  }
  createScoreCount(awayScores);
  createScoreCount(homeScores);
}

function createScoreCount(item) {
  item.forEach(i => i.push(`${i + 1}`));
}

function getCoordinates(shots, p5) {
  p5.forEach(v => {
    if (v[2] === '1') {
      let y1 = v[3] * shots[1];
      let z1 = Number(Math.max(Math.round(y1 * 100) / 100).toFixed(2));
      v.splice(4, 0, z1);
    } else if (v[2] === '2') {
      let y2 = (v[3] - 1) * +shots[2] + +shots[1];
      let z2 = Number(Math.max(Math.round(y2 * 100) / 100).toFixed(2));
      v.splice(4, 0, z2);
    } else if (v[2] === '3') {
      let y3 = (v[3] - 2) * +shots[3] + (+shots[1] + +shots[2]);
      let z3 = Number(Math.max(Math.round(y3 * 100) / 100).toFixed(2));
      v.splice(4, 0, z3);
    } else if (v[2] === 'OT') {
      let y4 = (v[3] - 3) * shots[4] + (shots[1] + shots[2] + shots[3]);
      let z4 = Number(Math.max(Math.round(y4 * 100) / 100).toFixed(2));
      v.splice(4, 0, z4);
    } else {
      console.log('err');
      console.log(v)
    }
  });
  console.log(p5)
  return p5;
}

function dataFilter(data) {
  console.log(data)
  //check for shutouts
  if (data[0] === undefined || data[0].length == 0) {
    // array empty or does not exist
    data[0].push(['', '', '', '', '', '', ''])
  }
  if (data[1] === undefined || data[1].length == 0) {
    data[1].push(['', '', '', '', '', '', ''])
  }
  //Shots table filtering
  //check to see if shots table has 5 columns. If there are 5 columns we can assume all is well, if not, do the following...
  if (data[2].length !== 3 || data[2][0].length !== 5) {
    console.log('The shots table is whack ' + data[2][0].length);
    //check to see if shots table was filled out
    if (data[2] === undefined || data[2].length == 0) {
      // array empty or does not exist then some fun stuff is going to happen
      console.log("Err: the shots table is empty")
    }
    // else if (data[2][0].length == 2 && data[2][0][1] == 'Total') {
    //   let homeShotPlaceholder = parseInt(data[2][2][1]) / 3;
    //   let awayShotPlaceholder = parseInt(data[2][1][1]) / 3;
    //   data[2][0].splice(1, 0, '1');
    //   data[2][0].splice(2, 0, '2');
    //   data[2][0].splice(3, 0, '3');
    //   data[2][1].splice(1, 0, awayShotPlaceholder );
    //   data[2][1].splice(2, 0, awayShotPlaceholder );
    //   data[2][1].splice(3, 0, awayShotPlaceholder );
    //   data[2][2].splice(1, 0, homeShotPlaceholder );
    //   data[2][2].splice(2, 0, homeShotPlaceholder );
    //   data[2][2].splice(3, 0, homeShotPlaceholder );
    // }
    // maybe have this stuff search for a "final" column and pass in values if found to make this work with hockeyplot.js
    // for (let i = 0; i < data[2].length; i++) {
    //   if (data[2][0][i] ){}
    // }
  }
  //check to see if penalty table has 3 columns. If there are 3 columns we can assume all is well, if not, do the following...
  if (data[3][0].length !== 3) {
    console.log('Penalty Table FAILED its check: ' + data[3][0].length);
    // maybe have this stuff search for column names and pass in values if found to make this work with the rest of the app
    // for (let i = 0; i < data[2].length; i++) {
    //   if (data[3][0][i] ){}
    // }
  }else{
    console.log('Penalty Table PASSED its check');
  }
  //check team names to make sure there are two strings here
  if (data[4].length == 2 && data[4].every(function(i){ return typeof i === "string" })) {
    console.log('Team Names PASSED its check');
  }
  //check team scores to make sure there are two ints here
  if (data[5].length == 2 && data[5].every(function(i){ return typeof i === "string" })) {
    console.log('Team Scores PASSED its check');
  }
  if (data[6].length == 2 && data[6].every(function(i){ return typeof i === "string" })) {
    console.log('Goalie Name PASSED its check');
  }
  //check game date to make sure it's a string and doesn't contain any funky characters
  if (typeof data[7] === "string" && /[~`!#$%\^&*+=\-\[\]\\';/{}|\\":<>\?]/g.test(data[7]) === false) {
    console.log('Game Date PASSED its check');
  }

  return(data);
}


export default App;
