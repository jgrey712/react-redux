import React, { Component } from 'react';
import StoreContext from '../contexts/storeContext';
import { loadBugs } from '../store/bugs';

class Bugs extends Component {
    static contextType = StoreContext;

    state = { bugs: [] };

    componentDidMount() {
        const store = this.context;

        this.unsubscribe = store.subscribe(() => {
            const bugsInSore = store.getState().entities.bugs.list;
            if(this.state.bugs !== bugsInSore) {
                this.setState({ bugs: bugsInSore});
            }
        }); //this fn is executed every time an action is dispatched

        store.dispatch(loadBugs());
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        return (
            <ul>
                {this.state.bugs.map(
                    bug => (<li key={bug.id}>{bug.description}</li>)
                )}
            </ul>
        );
    }
}

Bugs.contextType = StoreContext;

export default Bugs;