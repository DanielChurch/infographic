import React, { useState, useEffect } from 'react';
import './App.css';

import HockeyPlot from './HockeyPlot';
import HockeyGraph from './HockeyGraph';
import PenaltyMinutesGraph from './penaltyMinutesGraph';

function App() {
  const [url, setUrl] = useState();
  let textInputRef = React.createRef();

  if (!url) {
    return (
      <div>
        <input
          placeholder='Url'
          ref={(ref) => textInputRef = ref}
        />
        <button
          onClick={() => setUrl(textInputRef.value)}
        > Enter </button>
      </div>
    );
  }

  return (<Plots url={url} />);
}

function Plots(url) {
  const [data, setData] = useState();

  useEffect(async () => {
    const data = await scrape_table(url);

    console.log(`data ${data}`);

    setData(data);
  }, []);

  if (!data) return (<div> Loading... </div>);

  return (
    <div className="App">
      <div class="lineChart">
        <HockeyPlot data={data} />
      </div>
      <div class="ppGoals">
        <HockeyGraph data={data} />
      </div>
      <div class="ppMin">
        <PenaltyMinutesGraph data={data} />
      </div>
    </div>
  );
}

async function scrape_table(_) {
  return [[["Home score", "1 - 1", "2", 1.3599999999999999, 22.4, "S.Coulter", "1"], ["Home score", "1 - 2", "2", 1.3900000000000001, 22.85, "J.Warner", "2"], ["Home score", "2 - 3", "3", 2.22, 36.4, "J.Forbes", "3"], ["Home score", "2 - 4", "3", 2.41, 40.2, "L.Bing", "4"], ["Home score", "2 - 5", "3", 2.46, 41.2, "R.Hanson", "5"], ["Home score", "2 - 6", "3", 2.81, 48.2, "J.Pilskalns", "6"]], [["Away score", "1 - 0", "2", 1.07, 4.28, "B.Rutherford", "1"], ["Away score", "2 - 2", "2", 1.8199999999999998, 7.28, "R.Bagley", "2"]], [["Shots", "1", "2", "3", "T"], ["Montana Tech", "4", "4", "5", "13"], ["Montana Stat", "17", "15", "20", "52"]], [["Power Plays", "PP", "PIM"], ["Montana Tech", "1-7", "20"], ["Montana Stat", "3-9", "16"]]];
}

export default App;
