import loginreducers from './loginReduces'
import { combineReducers } from 'redux'

const rootReducers = combineReducers({
    login: loginreducers
});

export default rootReducers
