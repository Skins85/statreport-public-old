import React, {Component} from 'react';

import Banner from '../../components/banner/banner';
import Result from '../../components/result/result';

class Results extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data: '',
          location: '',
          season: '2018-19',
          opposition: 'all',
          teamsData: '',
          filteredResults: ''
        };
    }
        
    // Generic onChange handler => updates state
    onChange = e => this.setState({ 
        [e.target.name]: e.target.value 
    });

    // Stay on page once form submitted
    handleSubmit(event) {
        event.preventDefault();
    }

    componentDidMount() {
      fetch(`/get-results`)
        .then(response => response.json())
        .then(data => this.setState({data}));
      fetch(`/teams`)
        .then(response => response.json())
        .then(teamsData => this.setState({teamsData}));
    }

    render() {

        // For scoping, define variables needed in template
        let results = this.state.data.results;
        let results_template;
        let table_heading;
        let team_select;
        let teamsList;
        let season_select;
        let filteredResults;
        let team_home;
        let team_away;
        let season;
        let opposition;
        let outcome;
        let banner = <Banner
          name='Matches'
          description='Results and match information'
          image='/images/banner/football-field-alfredo-camacho.jpg'
          // Banner image: Photo by <a href="/photographer/alfcb-46394">Alfredo Camacho</a> from <a href="https://freeimages.com/">FreeImages</a>
        />;

        if (results) {

            // Assign variables to variables (will be used to filter data)
            this.state.location === 'home' ? team_home = 'Dagenham & Redbridge'
              : this.state.location === 'away' ? team_away = 'Dagenham & Redbridge'
              : team_home = ('Dagenham & Redbridge', team_away = 'Dagenham & Redbridge');
            season = this.state.season;
            opposition = this.state.opposition;
      
            // Filter results object based on variables set from state 
            filteredResults = results.filter(function(result) {
              return (
                (result.team_home === team_home || result.team_away === team_away) &&
                (season !== 'all' ? result.season === season : result.season === 
                  '2018-19' || 
                  '2017-18' || 
                  '2016-17' || 
                  '2015-16' || 
                  '2014-15' ) &&
                (opposition === 'all' 
                  ? (result.team_home === 'Dagenham & Redbridge' 
                    || result.team_away === 'Dagenham & Redbridge') 
                  : (result.team_away === opposition 
                    || result.team_home === opposition))
                ); 

              });
              
      
            if (filteredResults.length > 0) {
      
              results_template = filteredResults.map(result => {
      
                if (result.home_goals === result.away_goals) {
                  outcome = 'D';
                } else if (result.team_home === 'Dagenham & Redbridge' && result.home_goals > result.away_goals || result.team_away == 'Dagenham & Redbridge' && result.away_goals > result.home_goals) {
                  outcome = 'W'
                } else if (result.team_home === 'Dagenham & Redbridge' && result.home_goals < result.away_goals || result.team_away == 'Dagenham & Redbridge' && result.away_goals < result.home_goals) {
                  outcome = 'L';
                }
      
                return (
                  <Result
                    key={result.match_id}
                    match_id={result.match_id}
                    competition={result.competition}
                    season={result.season}
                    date={result.date}
                    team_home={result.team_home}
                    home_goals={result.home_goals}
                    away_goals={result.away_goals}
                    team_away={result.team_away}
                  />
                )
              })
            } 
      
            /**
             * Create markup for select menus based on fetched data. Map through and filter out any duplicate values
             */
            let teams = this.state.teamsData.results,
              teamsArray = [];

            if (teams) {
              for (const t of teams) {
                teamsArray.push(t)
              }
            }

            // Build teams select options
            teamsList = teamsArray.map(t => {
              return <option 
                key={t.team_id} 
                value={t.team_name}
                name={t.team_name}
              >
              {t.team_name}
              </option>
            });
            
            let oppositionArr = [];
            results.map(result => { 
              oppositionArr.push(result.opposition);
            })
            oppositionArr = [...new Set(oppositionArr)];
            team_select = oppositionArr.map(opposition => { return <option value={opposition}>{opposition}</option> })
            
            let seasonsArr = [];
            results.map(result => { 
              seasonsArr.push(result.season);
            })
            seasonsArr = [...new Set(seasonsArr)];
            // Set default selected season to state value
            season_select = seasonsArr.map(season => { 
              if (season === this.state.season) {
                return (
                  <option value={season} selected>{season}</option>
                )
              } else {
                return (
                  <option value={season}>{season}</option>
                ) 
              }
            })
          }
        filteredResults = [...new Set(filteredResults)];

        if (filteredResults.length > 0) {
          return (
            <React.Fragment>
              {banner}
              <div className='content__inpage'>
                <form 
                  className='matches__filter background-gray20'
                  onSubmit={this.handleSubmit}
                >
                  <h2>Filter matches</h2>
                  <select name="location" onChange={this.onChange}>
                    <option value="all" selected>All locations</option>
                    <option value="home">Home</option>
                    <option value="away">Away</option>
                  </select>
                  <select name="opposition" onChange={this.onChange}>
                    <option value="all">All teams</option>
                    {teamsList}
                  </select>
                  <select name="season" onChange={this.onChange}>
                    <option value="all">All seasons</option>
                    {season_select}
                  </select>
                </form>
                <table>
                  <thead data-content-align='left'>
                    <tr>
                      <th>Date</th>
                      <th>Competition</th>
                      <th></th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {results_template}
                  </tbody>
                </table>
              </div>
            </React.Fragment>
          )  
        } else {
          return (
            <React.Fragment>
              {banner}
              <p>No results found. Please try making another selection.</p>
            </React.Fragment>
          )
        }
        
    }
}

export default Results;