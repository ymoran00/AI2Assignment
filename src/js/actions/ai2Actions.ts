import {AppAction, AsyncAction} from "./actionBase";
import {ActionType} from "./actionTypes";
import {SingleSentence, Span} from "../store/types";
import axios, { AxiosResponse } from 'axios';

const AI2_BASE_URL = 'http://35.246.136.197:8080/api';


export interface SentencesLoadedAction extends AppAction {
    sentences: SingleSentence[]
}

export interface AnnotationLoadedAction extends AppAction {
    spans: Span[],
    sentenceId: string
}

export interface AnnotationStartLoadAction extends AppAction {
    sentenceId: string
}


export interface SearchWordSelectedAction extends AppAction {
    searchWord: string
}


interface SentencesResponse {
    list: SingleSentence[]
}

interface AnnotationsResponse {
    id: string,
    spans: Span[]
}

export default class Ai2Actions {


    static loadSentences(word: string): AsyncAction<SingleSentence[], SentencesLoadedAction | SearchWordSelectedAction> {
        return (dispatch) => new Promise((resolve, reject) => {
            dispatch({type: ActionType.SEARCH_WORD_SELECTED, searchWord: word});
            axios.get(AI2_BASE_URL + '/sentences', {params: {'word': word}})
                .then((data: AxiosResponse<SentencesResponse>) => {
                    dispatch({type: ActionType.SENTENCES_LOADED, sentences: data.data.list});
                    resolve(data.data.list)
                }).catch((reason: any) => {
                reject(reason)
            });
        });
    }


    static loadAnnotations(sentenceId: string): AsyncAction<Span[], AnnotationLoadedAction | AnnotationStartLoadAction> {
        return (dispatch, getState) => new Promise((resolve, reject) => {
            const originalWord = getState().searchWord;
            dispatch({type: ActionType.ANN_START_LOAD, sentenceId: sentenceId});
            axios.post(AI2_BASE_URL + `/sentences/${sentenceId}/annotate`)
                .then((data: AxiosResponse<AnnotationsResponse>) => {
                    if (getState().searchWord === originalWord) {
                        dispatch({type: ActionType.ANN_LOADED, spans: data.data.spans, sentenceId: sentenceId});
                        resolve(data.data.spans)
                    }
                }).catch((reason: any) => {
                reject(reason)
            });
        });
    }


}