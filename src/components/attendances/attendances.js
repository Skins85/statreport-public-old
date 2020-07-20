import React, { useEffect, useState } from "react";

import AttendancesList from './attendances-list';
import Banner from '../../components/banner/banner';
import Chart from 'chart.js';
import SeasonOptions from '../form/options/season';
import Select from '../form/ui/select/select';

export default function Attendances() {
    const [hasError, setErrors] = useState(false);
    const [data, setData] = useState({});
    const [attData, setAttData] = useState({});
    const [aveAttData, setAveAttData] = useState({});
    const [oppData, setOppData] = useState({});
    const [season, setSeason] = useState();

    useEffect(() => {
        async function fetchData() {
            const res = await fetch("/get-attendances");
            res
                .json()
                .then(res => setData(res))
                .catch(err => setErrors(err));
        }
        fetchData();
    },[]);

    // Global refs/vars
    let attendances = data.attendances,
        attendancesBySeasonArray = [],
        opponentBySeasonArray = [],
        rollingAverageArray = [],
        rollingTotal = 0,
        rollingCount = 0,
        ctx = document.getElementById('myChart'),
        myChart,
        attendancesDescending,
        attendancesAscending,
        top10,
        bottom10;

    // Change chart data on season selected
    let seasonChange = e => { 
        window.history.pushState(null, null, `/matches/attendances/${e.target.value}`);

        let seasonId = window.location.pathname.split("/").pop();

        // Format season value to display as heading
        let seasonValue = seasonId.replace(/-/g, '/');
        setSeason(seasonValue);
        
        if (attendances) {
            
            // Filter attendances by season  
            let attendancesBySeason;
            for (const b of attendances) {
                attendancesBySeason = attendances.filter(function(m) {
                    return (
                        m.season === seasonId
                    )
                }); 
            }

            for (const c of attendancesBySeason) {
                attendancesBySeasonArray.push(c.attendance);
                opponentBySeasonArray.push(c.team_away);
            }

            // Calculate rolling average and store in global array
            for (const d of attendancesBySeasonArray) {
                rollingTotal = rollingTotal + d;
                rollingCount = rollingCount + 1;
                rollingAverageArray.push(Math.round(rollingTotal/rollingCount));
            }

            // Update state each new season value is selected
            setAttData(attendancesBySeasonArray);
            setAveAttData(rollingAverageArray);
            setOppData(opponentBySeasonArray);
            
            // Destroy chart instance so chart isn't duplicated
            if (myChart) {
                myChart.destroy();
            };

        }
    }

    // Initialise chart and display if attendance data exists
    if (Object.entries(attData).length > 0) {
        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: oppData,
                datasets: [{
                    label: 'Attendances',
                    data: attData,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    type: 'bar',
                }, {
                    label: 'Average attendance',
                    data: aveAttData,
                    type: 'line',
                    fill: false
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    } else {
        // Top 10 attendances
        if (attendances) { 

            // Slice original attendances array to prevent mutation
            attendancesDescending = attendances.slice().sort((a, b) => b.attendance - a.attendance);
            attendancesAscending = attendances.slice().sort((a, b) => a.attendance - b.attendance);

            top10 = attendancesDescending.slice(0, 10).map(i => {
                return (
                    <React.Fragment>
                        <AttendancesList
                            match_id = {i.match_id}
                            date = {i.date}
                            attendance = {i.attendance}
                            home_goals = {i.home_goals}
                            away_goals = {i.away_goals}
                            team_away = {i.team_away}
                        />
                    </React.Fragment>
                )
            })
            bottom10 = attendancesAscending.slice(0, 10).map(i => {
                return (
                    <AttendancesList
                        match_id = {i.match_id}
                        date = {i.date}
                        attendance = {i.attendance}
                        home_goals = {i.home_goals}
                        away_goals = {i.away_goals}
                        team_away = {i.team_away}
                    />
                )
            })

        }
    }
        
    return (
        <React.Fragment>
            <div className="content__inpage">
                {season ? <h1>Attendances: {season}</h1> : <h1>Attendances</h1>}
                {season ? <p><a href="./">&lt; Back to Attendances</a></p> : null }
                <Select 
                    labelRequired 
                    labelText={`Season`} 
                    selectName={`results.season`} 
                    onChange={seasonChange.bind(this)}
                >
                    <option value="" selected disabled hidden>Select season</option>
                    <SeasonOptions />
                </Select>
                {season ? null : <React.Fragment><h2>Highest attendances</h2><table><tbody>{top10}</tbody></table></React.Fragment> }
                {season ? null : <React.Fragment><h2>Lowest attendances</h2><table><tbody>{bottom10}</tbody></table></React.Fragment> }
                <canvas 
                    id="myChart" 
                    width="500" 
                    height="400"
                    data-display={season ? `true` : `false`}
                />
            </div>
        </React.Fragment>
    );
    
}