import initialState from "./initialState";
import {SearchWordSelectedAction} from "../actions/ai2Actions";
import {ActionType} from "../actions/actionTypes";

type SWActions = SearchWordSelectedAction

export default function searchWordReducer(state: string = initialState.searchWord, rawAction:SWActions): string {
    if (rawAction.type === ActionType.SEARCH_WORD_SELECTED) {
        const action = rawAction as SearchWordSelectedAction;
        return action.searchWord;
    }
    return state;
};