export const enToKn = {
};

export const verbInfos = {
    // 'tr': is transitive
    'be': {},
    'have': null,
};

function wordsToSentence(words) {
    if(words === null || words.length === 0) {
        return null;
    }
    return words.join(' ') + '.';
}

function beConjSimple(subject, tenseTime, words) {
}

export function verbConj(subject, verb, tense) {
    const response = {'status': 'ok', 'text': null, 'msg': null};
    const words = [];
    const verbInfo = verbInfos[verb];
    if(verbInfo === undefined) {
        response.status = 'unimpl';
        response.msg = `unrecognized verb '${verb}'.`;
        return response;
    }
    else if(verbInfo === null) {
        response.status = 'unsupp';
        response.msg = `unsupported verb '${verb}'.`;
        return response;
    }
    if(verb === 'be') {
        if(tense.type === 'simple') {
            response.status = 'unimpl';
            response.msg = `verb '${verb}' is unimplemented.`;
            return response;
        }
        else {
            response.status = 'unsupp';
            response.msg = `tense type '${tense.type}' is unsupported for verb 'be'.`;
            return response;
        }
    }
    else {
        response.status = 'unimpl';
        response.msg = `verb '${verb}' is unimplemented.`;
        return response;
    }
    response.text = wordsToSentence(words);
    return response;
}
