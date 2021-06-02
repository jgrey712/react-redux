const func = ({dispatch, getState}) =>  next => action => {
    if (typeof action === 'function') {
        action(dispatch, getState);  //call
    } else {
        next(action); //pass as arg
    }
}

export default func;