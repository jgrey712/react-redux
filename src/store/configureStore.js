import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'; //automatically brings redux thunk
import reducer from './reducer';
import logger from './middleware/logger';
import toast from './middleware/toast';
import api from './middleware/api';

export default function() {
    const store = configureStore({
        reducer,
        middleware: [
            ...getDefaultMiddleware(),
            logger({destination: 'console'}),
            toast,
            api
        ]
    });   
    return store;
};