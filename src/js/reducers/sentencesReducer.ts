import initialState from "./initialState";
import {SingleSentence} from "../store/types";
import {SentencesLoadedAction, AnnotationLoadedAction, AnnotationStartLoadAction} from "../actions/ai2Actions";
import {ActionType} from "../actions/actionTypes";
import update from 'immutability-helper';

type SentencesActions = SentencesLoadedAction | AnnotationLoadedAction | AnnotationStartLoadAction

export default function sentencesReducer(state: SingleSentence[] = initialState.sentences, rawAction:SentencesActions): SingleSentence[] {
    if (rawAction.type === ActionType.SENTENCES_LOADED) {
        const action = rawAction as SentencesLoadedAction;
        return [...action.sentences];
    } else if (rawAction.type === ActionType.ANN_LOADED) {
        const action = rawAction as AnnotationLoadedAction;
        const idx = state.findIndex((sentence)=> sentence.id===action.sentenceId);
        if (idx >= 0) {
            return update(state,
                {[idx]: {$merge: {spans: action.spans, isLoading: false}}});
        }
        return state;
    } else if (rawAction.type === ActionType.ANN_START_LOAD) {
        const action = rawAction as AnnotationStartLoadAction;
        const idx = state.findIndex((sentence) => sentence.id === action.sentenceId);
        if (idx >= 0) {
            return update(state,
                {[idx]: {$merge: {isLoading: true}}});
        }
        return state;
    }
    return state;
};