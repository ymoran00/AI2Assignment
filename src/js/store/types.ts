export interface SingleSentence {
    id: string,
    words: string[],
    isLoading?: boolean
    spans?: Span[],
}

export interface StateType {
    sentences: SingleSentence[],
    searchWord: string
}

export interface Span {
    start: number,
    end: number,
    label: string
}