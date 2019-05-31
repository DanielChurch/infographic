import React from 'react';

function formatData(data) {
    const [_, __, ___, ____, teamNames] = data;
    console.log(teamNames);
    const homeTeamName = {
        name: teamNames[1].replace(/\s/g, "_"),
    }
    
    return homeTeamName;
}  


function HomeImage(props) {
    const data = formatData(props.data);
    //document.getElementById('homeImageBox').src = 'images/' + data.name + '.png';
    //document.write('<img src="images/' data.name '.png"></img>');
    return (
        <img src={`images/${data.name}.png`}/>
    )
  }
  export default HomeImage;
 