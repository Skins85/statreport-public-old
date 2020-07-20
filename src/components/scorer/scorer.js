import React, { useEffect, useState } from 'react';

import SeasonOptions from '../form/options/season';
import Select from '../form/ui/select/select';

export default function Scorers() {
    const [hasError, setErrors] = useState(false);
    const [data, setData] = useState({});
    const [totalGoalsData, setTotalGoalsData] = useState({});
    const [season, setSeason] = useState({});

    useEffect(() => {
        async function fetchData() {
            const res = await fetch("/get-goals-all");
            res
                .json()
                .then(res => setData(res))
                .catch(err => setErrors(err));
            const total = await fetch("/get-player-goals-total");
            total
                .json()
                .then(total => setTotalGoalsData(total))
                .catch(err => setErrors(err));
        }
        fetchData();
    },[]);

    let seasonChange = e => { 
        window.location.pathname = `/players/scorers/${e.target.value}`;
    }

    let matches = data.results,
        totalGoals = totalGoalsData.results,
        seasonId = window.location.pathname.split("/").pop(),
        goalsBySeason,
        goalsBySeasonPlayer,
        goalsBySeasonPlayerArray = [];

    if (matches && seasonId !== 'scorers') {
        
        // Filter goals data by season in URL
        goalsBySeason = matches.filter(function(match) {
            return (
                match.season === seasonId
            )
        });

        // Create array of all goalscorer names
        // e.g. ["Whitely", "Okenabirhie", "Assombalonga", "Guttridge", "Robson", "Hawkins", "Hawkins", "Maguire-Drew", ...]
        Object.keys(goalsBySeason).map(key => {
            goalsBySeasonPlayerArray.push(goalsBySeason[key]);
        })

        // Create object of player names and their frequency in passed array, i.e. goal count
        // e.g. {Whitely: 14, Okenabirhie: 6, Assombalonga: 1, Guttridge: 6, Robson: 1, …}
        goalsBySeasonPlayer = goalsBySeasonPlayerArray.reduce(function(obj, b) {
            obj[b.surname] = ++obj[b.surname] || 1;
            return obj;
        }, {});

        // Convert object to array in order to sort values, e.g.
        // 0: (2) ["Hawkins", 17]
        // 1: (2) ["Whitely", 14]
        // 2: (2) ["Maguire-Drew", 10]
        // 3: (2) ["Okenabirhie", 6]
        let orderedScorersArray = [];
        for (const g in goalsBySeasonPlayer) {
            orderedScorersArray.push([g, goalsBySeasonPlayer[g]]);
        }
        orderedScorersArray.sort(function(a, b) {
            return b[1] - a[1];
        });
        
        let playerSingleGoalObject;
        let playerAllGoalsArray = [];
        let scorersListBySeason;
        
        // Create array of objects for each player containing a unique object
        // for each goal scored
        for (const a of orderedScorersArray) {
            
            playerSingleGoalObject = matches.filter(function(match) {
                return (
                    match.surname === a[0] && match.season === seasonId
                )
            });
            playerAllGoalsArray.push(playerSingleGoalObject);
            
        }
        
        // Map over each player's goalscoring data and output JSX
        scorersListBySeason = playerAllGoalsArray.map(s => {
            return (
                <p>{s.length}&nbsp;
                    <a href={`../${s[0].scorer_id}`}>{s[0].first_name} {s[0].surname}</a>
                </p>
            )
        })

        let seasonFormatted = seasonId.replace('-', '/');

        return (
            <React.Fragment>
                <div className='content__inpage'>
                    <h1>Daggers' goalscorers for {seasonFormatted} season</h1>
                    <Select 
                        labelText={`Season`} 
                        selectName={`results.season`} 
                        onChange={seasonChange.bind(this)}
                    >
                        <option value="" selected disabled hidden>Select season</option>
                        <SeasonOptions />
                    </Select>
                    {scorersListBySeason}
                </div>
            </React.Fragment>
        )

    } else {
        let allScorers;
        if (totalGoals) {
            allScorers = totalGoals.map(s => {
                return (
                    <p>{s.count}&nbsp;
                        <a href={`../players/${s.Player}`}>{s.first_name} {s.surname}</a>
                    </p>
                )
            })
        }
        return (
            <React.Fragment>
                <div className='content__inpage'>
                    <h1>Goalscorers</h1>
                    <Select 
                        labelText={`Season`} 
                        selectName={`results.season`} 
                        onChange={seasonChange.bind(this)}
                    >
                        <option value="" selected disabled hidden>Select season</option>
                        <SeasonOptions />
                    </Select>
                    {allScorers}
                </div>
            </React.Fragment>
        )
    }
}