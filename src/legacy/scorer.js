import React, { useEffect, useState } from "react";

export default function Scorers() {
    const [hasError, setErrors] = useState(false);
    const [data, setData] = useState({});
    const [playerData, setPlayerData] = useState({});

    useEffect(() => {
    async function fetchData() {
        const res = await fetch("/get-goals-all");
        res
            .json()
            .then(res => setData(res))
            .catch(err => setErrors(err));
        const players = await fetch("/get-players");
        players
            .json()
            .then(players => setPlayerData(players))
            .catch(err => setErrors(err));
        }
        fetchData();
    },[]);

    let matches = data.results,
        players = playerData.results,
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
        // console.log(goalsBySeasonPlayerArray);

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
        var orderedScorersArray = [];
        for (var g in goalsBySeasonPlayer) {
            orderedScorersArray.push([g, goalsBySeasonPlayer[g]]);
        }
        orderedScorersArray.sort(function(a, b) {
            return b[1] - a[1];
        });
        let b;
        let c = [];
        for (const a of orderedScorersArray) {
            b = matches.filter(function(match) {
                return (
                    match.surname === a[0]
                )
            });
            c.push(`${a[1]} ${b[0].first_name} ${b[0].surname}`);
            console.log(c);
        }

        // Map over ordered scorers array and output values
        let scorersListBySeason = orderedScorersArray.map(s => {
            return (
                <p>{s[1]} {s[0]}</p>
            )
        })

        let d = c.map(s => {
            return (
                <p>{s[1]} {s[0]}</p>
            )
        })

        return(
            <React.Fragment>
                <h1>Season</h1>
                {scorersListBySeason}
            </React.Fragment>
        )
    } else {
        return(
            <h1>Index</h1>
        )
    }
}