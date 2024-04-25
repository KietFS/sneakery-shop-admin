import { combineReducers } from "@reduxjs/toolkit";
import auth from "./slices/auth";
import filter from "./slices/filter";

const rootReducer = combineReducers({
  auth,
  filter,
});


export default rootReducer;