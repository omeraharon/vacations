
import { combineReducers, createStore } from "redux";
import { authReducer } from "./AuthState";
import { vacationsReducer } from "./VacationsState";

const reducers = combineReducers({ vacationsState: vacationsReducer, authState: authReducer });
const store = createStore(reducers);

export default store;

