import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { apiCallBegin } from './api';
import moment from 'moment';

const slice = createSlice({
    name: 'bugs',
    initialState: {
        list: [],
        loading: false,
        lastFetch: null
    },
    reducers: {
        //actions => action handlers
        bugsRequestd: (bugs, action) => {
            bugs.loading = true;

        },
        
        bugsReceived: (bugs, action) => {
            bugs.list = action.payload;
            bugs.loading = false;
            bugs.lastFetch = Date.now();
        },

        bugsRequestFailed: (bugs, action) => {
            bugs.loading = false;
        },

        bugAssignedToUser: (bugs, action) => {
            const { id: bugId, userId } = action.payload;
            const index = bugs.list.findIndex(bug => bug.id === bugId);
            bugs.list[index].userId = userId;
        },

        // command - event
        // addBug - bugAdded
        bugAdded: (state, action) => {
            state.list.push(action.payload);
        },

        // resoolveBug(command) - bugResolved(event)
        bugResolved: (bugs, action) => {
            const index = bugs.list.findIndex(bug =>bug.id === action.payload.id);
            bugs.list[index].resolved = true;
        },

        bugRemoved: (state, action) => {
            return state.list.filter(bug => bug.id !== action.payload.id)
        }
    }//maps actions to action handlers
});

const { 
    bugAdded, 
    bugResolved, 
    bugRemoved, 
    bugAssignedToUser, 
    bugsReceived, 
    bugsRequestd,
    bugsRequestFailed
} = slice.actions;
export default slice.reducer;

//action creators
const url = '/bugs';

export const loadBugs = () => (dispatch, getState) => {
    const {lastFetch} = getState().entities.bugs;

    console.log(lastFetch);

    const diffInMinutes = moment().diff(moment(lastFetch), 'minutes');

    if (diffInMinutes < 10) {
        return;
    }

    dispatch(
        apiCallBegin({
            url,
            onStart: bugsRequestd.type,
            onSuccess: bugsReceived.type,
            onError: bugsRequestFailed.type
        })
    );
};

export const addBug = bug => apiCallBegin({
    url,
    method: "post",
    data: bug,
    onSuccess: bugAdded.type
});

export const resolveBug = id => apiCallBegin({
    // /bugs
    // PATCH /bugs/1 (PUT-all resouces, PATCH-1+ properties)
    url: url + '/' + id,
    method: 'patch',
    data: {resolved: true},
    onSuccess: bugResolved.type
});

export const assignBugToUser = (bugId, userId) => apiCallBegin({
    url: url + '/' + bugId,
    method: 'patch',
    data: {userId},
    onSuccess: bugAssignedToUser.type
});

// selector => get derived data
// memoization => cached data
export const unresolvedBugsSelector = createSelector(
    state => state.entities.bugs, //first function, result passed to second fn
    bugs => bugs.filter(bug => !bug.resolved) //2nd fn => result function, 
    //if bugs not changes, not executed: return from cache
);

export const getBugsByUser = userId => createSelector(
    state => state.entities.bugs,
    bugs => bugs.filter(bug =>  bug.userId === userId)
);