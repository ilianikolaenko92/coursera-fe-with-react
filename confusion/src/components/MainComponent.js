import React, { Component } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';  // withRouter is depriciated in v6, see import below!
// In V6 of react-router-dom Routes replaced Switch as a more powerful alternative. See @ https://reactrouter.com/docs/en/v6/upgrading/v5#upgrade-all-switch-elements-to-routes
// In V6 of react-router-dom Redirect is removed. Navigate component is an alternative. See @ https://reactrouter.com/docs/en/v6/upgrading/v5#remove-redirects-inside-switch
import { withRouter } from '../redux/configureStore';  // This withRouter-replacement enables a router for Redex-connected components! withRouter Higher Components is depreciated in react-router-dom v6. Found @ https://stackoverflow.com/questions/64782949/how-to-pass-params-into-link-using-react-router-v6 and @ https://github.com/remix-run/react-router/issues/7156
import { connect } from 'react-redux';  // a wrapper container for React components to enable access to the Redux Store. 

import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Home from './HomeComponent';
import AboutUs from './AboutUsComponent';
import Menu from './MenuComponent';
import Contact from './ContactComponent';

import DishDetail from './DishdetailComponent';

const mapStateToProps = state => {
    // connects an object of values from the Redux store as a PROP of the Main component. IS used to replace the previous local state of the Main component. Connection is done in the "export default-statement" at the end of the script.
    // All "this.state.x" references in the code of the Main component-class must also be updated to "this.props.x"!
    return {
        dishes: state.dishes,
        comments: state.comments,
        promotions: state.promotions,
        leaders: state.leaders,
    }
}

class Main extends Component {
    /* Main class component for storing the datas of the SPA in a state and rendering the whole SPA by using React Router (activated in App.js by using BrowserRouter component!) to manage navigation between the views
       renders Header and Footer components for all views of the SPA
       routes between selected views and renders their corresponding components
       declares and renders a functional component HomePage containing parametrized Home component
       declares helper functional component DishWithId to operate matching of selected dishes and to render a DishDetail component according to a selection of a RenderMenuItem component in a Menu component 
    */

    constructor(props) {
        super(props);
    }

    render() {

        /* Local functional component to parametrize another component...
        a functional component as an arrow function (not necessary anymore in V6 of react-dom-router since components are given to Routes in JSX-code of the element prop and not over a Component prop anymore), done however since many props are to be filtered

        Home component is instantiated here with a custom prop DISH that selects a first dish with a prop "feature: true" from a JS list of dish objects by returning a subarray of objects using .filter on the state prop DISHES of the Main
        The same is done for the rest of the custom props of the Home component 
        */
        const HomePage = () => {
            return (
                <Home dish={this.props.dishes.filter((dish) => dish.featured)[0]}
                    leader={this.props.leaders.filter((leader) => leader.featured)[0]}
                    promotion={this.props.promotions.filter((promotion) => promotion.featured)[0]}
                />
            );
        }

        const DishWithId = () => {
            /* a helper functional component uses useParams hook of React-dom-router V6 as a replacement to previous match object to render a DishDetail component based on a matched URL Param of the Dynamic Segment dishId from URL

            More on useParams see @ https://reactrouter.com/docs/en/v6/api#useparams
            The change of matching process from V5 to V6 see @ https://stackoverflow.com/questions/70290770/react-typeerror-cannot-read-properties-of-undefined-reading-params

            // MATCH was an object that held information when a route matches the URL, like the url params (Dynamic Segment's value) and pathname that matched. More on Matching see @ https://reactrouter.com/docs/en/v6/getting-started/concepts#matching and @ https://reactrouter.com/docs/en/v6/getting-started/concepts#route-matches
            */

            let { dishId } = useParams();

            /* Parametrizing the DishDetail component with a matched parameter of the Dynamic Segment dishId...
            selectedDish prop of the DishDetail component filters an array of dish objects using an arrow function that compares equalty of id of each dish with a converted to a base-10 Integer (See @ https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt) dishId token from the URL received by a Router. Base 10 is a Radix of a decimal system with 10 numbers (0-9): see @ https://en.wikipedia.org/wiki/Radix
            The same is done for the comments props of the DishDetail
            */
            return (
                <DishDetail selectedDish={this.props.dishes.filter((dish) => dish.id === parseInt(dishId, 10))[0]}
                    comments={this.props.comments.filter((comment) => comment.dishId === parseInt(dishId, 10))}
                />
            );
        }

        /* React Router... 
        Router switches between specified Route in Routes component based on a given URL in a browser. A PATH-prop of Route component is a PATH PATTERN: see @ https://reactrouter.com/docs/en/v6/getting-started/concepts#path-pattern

        REACT ROUTER V6!!!
        Route components don't have the Component-prop ({Comp class}) anymore and must be used with ELEMENT-prop (JSX code): a to-be-rendered component has to be placed within < />, even for JS vars! See @ https://stackoverflow.com/questions/69854011/matched-leaf-route-at-location-does-not-have-an-element */

        /* Routing of wrong path patterns...
        REACT ROUTER V5!!!
        Redirect component is gonna open a specified path if a URL received doesn't match any Routes in the Switch. 
        
        REACT ROUTER V6!!!
        Redirect inside of Switch is removed in favour of a server-side redirecting while initial rendering! 
        
        Client-side sln is to put the redirection logic into the RENDER prop of the Routes inside the switching OR to use NAVIGATE component (uses diff redirection logic, see link) for path with * value: has the lowest priority but maches any not found Roote. See @ https://reactrouter.com/docs/en/v6/upgrading/v5#remove-redirects-inside-switch
        
        RegEx are also no longer supported for Route in V6: @ https://reactrouter.com/docs/en/v6/faq#what-happened-to-regexp-routes-paths */

        /* Routes and Components they lead to...
        For React Router V6 specifying a component to be switched to is declared in JSX SYNTAX (V5 was using a Component prop with plain JS code in {}) and can be done in 2 ways:
         1) element={<CompName />} IF the component takes no props
         2) Using an arrow function IF the component takes props: element={<COMP />}. 
         The function component <COMP /> can be either:
          - declared directly here with () => <CompName propName=val /> : THIS IS OUTDATED IN V6, arrow func cannot be placed inside tags
          - received from a const (see HomePage example)
          - inserted directly from an import of a component */

        /* Routes and dynamic segments of their path patterns...
        path="/menu/:dishId" is a Dynamic Segment - A segment of a path pattern that is dynamic, meaning it can match any values in the segment ( "URL Params" - The parsed values from the URL that matched a dynamic segment). For example the pattern /users/:userId will match URLs like /users/123. See @ https://reactrouter.com/docs/en/v6/getting-started/concepts#dynamic-segment

        REACT ROUTER V5!!! 
        Since "/menu/:dishId" extends a simple "/menu", it is important to place the latter one FIRST and with a attr EXACT: React Router stops as soon as it finds a first Route with a matching path! Without EXCAT all pathes with "/menu..." would be redirected to the first Route with path "/menu"!

        REACT ROUTER V6!!! 
        decides the best matching path automatically! The order of Routes in code is no longer important. See @ https://reactrouter.com/docs/en/v6/getting-started/concepts#ranking-routes 
        */
        return (
            <div>
                <Header />
                <Routes>
                    <Route path='*' element={<Navigate replace to="/home" />} />
                    <Route path='/home' element={<HomePage />} />
                    <Route path='/aboutus/' element={<AboutUs leaders={this.props.leaders}/>} />
                    <Route exact path='/menu' element={<Menu dishes={this.props.dishes} />} />
                    <Route path='/menu/:dishId' element={<DishWithId />} />
                    <Route exact path='/contactus' element={<Contact />} />
                </Routes>
                <Footer />
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps)(Main));  // ??? syntax to connect props of the Main component to the state from the Redux Store
// withRouter method is used to enable the React Router navigation through a SPA components with a Redux state
