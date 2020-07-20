import React, {Component} from 'react';

import Banner from '../../banner/banner';
import FooterLinks from '../../footer/footer';
import {Link} from 'react-router-dom';
import Navigation from '../../navigation/navigation';
import SecondaryNavigation from '../../navigation/secondary/secondary';

class wrapper extends Component {

    // state = {
    //     value: null
    // };

    // handleChange = value => {
    //     this.setState({value})
    //     console.log('b');
    //     console.log(this.state);
    // }

    render() {
        return (
            <React.Fragment>
                <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Jura" />                
                <header>
                    <Navigation />
                </header>
                <main>
                    <header className="navigation--secondary">
                        {/* <SecondaryNavigation
                            path={this.props.path} 
                        /> */}
                    </header>
                    <article className="content content--default">
                        <div className="content-wrapper">
                            {/* <Banner
                                name={this.props.state} 
                                onLoad={this.handleChange}
                            /> */}
                            {this.props.children}
                        </div>
                    </article>
                </main>
                <footer>
                    <FooterLinks />
                </footer>
            </React.Fragment>
        );
    }
}

export default wrapper;