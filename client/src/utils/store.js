import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { browserReducer } from './reducers';

const reducerCombined = combineReducers({ 
  browser: browserReducer,
})

const store = createStore(reducerCombined, applyMiddleware(thunk));

export default store;