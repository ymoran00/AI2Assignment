import React, {RefObject} from "react";
import {connect} from 'react-redux';
import {bindActionCreators, compose} from 'redux';

import {SingleSentence, StateType} from "../js/store/types";
import {Dispatch, RemapActionCreators} from "../js/actions/actionBase";
import Ai2Actions from "../js/actions/ai2Actions";

type OwnProps = {

}

type StoreProps = {
    sentences: SingleSentence[]
}

const ActionProps = {
    loadSentences: Ai2Actions.loadSentences,
    loadAnnotations: Ai2Actions.loadAnnotations
};

type RemappedActionProps = RemapActionCreators<typeof ActionProps>


type Props = OwnProps & RemappedActionProps & StoreProps;

type State = {
    error: string,
    searchWord: string
}

class AI2FormBase extends React.Component<Props, State> {

    private readonly inputRef: RefObject<HTMLInputElement>;

    constructor(props: Props) {
        super(props);

        this.inputRef = React.createRef();
    }

    state:State = {
        error: '',
        searchWord: ''
    };

    private fetchSentences = (e: React.FormEvent) => {
        if (this.inputRef.current) {
            const word = this.inputRef.current.value;
            if (word) {
                this.props.loadSentences(word).then(()=> {
                    this.setState({searchWord: word, error: ''})
                }).catch(_reason => {
                    this.setState({searchWord: '', error: 'Could not get user data. Check your spelling.'})
                });
            }
        }
        e.preventDefault();
    };

    private loadAnnotations = (sentenceId: string) => {
        this.props.loadAnnotations(sentenceId).catch((reason) => this.setState({error: reason}));
    };

    private generateRow = (sentence:SingleSentence): React.ReactElement<HTMLSpanElement>  => {
        const clsName = sentence.isLoading ? 'sentence loading' : sentence.spans ? 'sentence with-spans' : 'sentence without-spans';
        let counter = 0;
        const spans = sentence.spans ? [...sentence.spans] : [];
        let curSpan = spans.shift();
        const jsxSpans = [];
        const spanClasses = ['span01', 'span02', 'span03', 'span04', 'span05', 'span06'];
        let spanClassIdx = 0;
        while (counter < sentence.words.length) {
            if (curSpan && counter === curSpan.start) {
                jsxSpans.push(<span title={curSpan.label} className={spanClasses[spanClassIdx]} key={counter}>{sentence.words[counter]}&nbsp;</span>);
                spanClassIdx = (spanClassIdx + 1) % spanClasses.length;
                counter = curSpan.end;
                curSpan = spans.shift();
            } else {
                jsxSpans.push(<span key={counter}>{sentence.words[counter]}&nbsp;</span>);
                counter += 1;
            }
        }
        return (
            <span className={clsName} onClick={()=>!sentence.spans && this.loadAnnotations(sentence.id)}>
                {jsxSpans}
            </span>
        )
    };

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const {error} = this.state;
        return (
            <div className="sentencesForm">
                <form className="inputRow" onSubmit={this.fetchSentences}>
                    Enter a word to search for.
                    <div style={{display: "flex"}}>
                        <input ref={this.inputRef}/>
                        <button type="submit">Go</button>
                    </div>
                    {error &&
                    <span style={{color: "red"}}>{error}</span>}
                </form>
                    <h4 style={{marginBlockEnd: 0}}>{this.props.sentences.length} sentences found for "{this.state.searchWord}":</h4>
                    <ul>
                        {this.props.sentences.map((sentence: SingleSentence) => (
                            <li key={sentence.id}>
                                {this.generateRow(sentence)}
                            </li>)
                        )}
                    </ul>
            </div>
        )
    }
}

function mapStateToProps(state:StateType) {
    return {
        sentences: state.sentences
    };
}

function mapDispatchToProps(dispatch:Dispatch<any>) {
    return bindActionCreators<typeof ActionProps, RemappedActionProps>(ActionProps, dispatch);
}

export const AI2Form =
    compose<React.ComponentClass<OwnProps>>(
        connect(mapStateToProps, mapDispatchToProps),
    )(AI2FormBase);