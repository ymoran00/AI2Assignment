import {combineReducers} from 'redux';
import sentences from "./sentencesReducer";
import searchWord from "./searchWordReducer"

export default combineReducers({
    sentences,
    searchWord
});