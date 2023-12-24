function getPronouns(subject) {
    /* outputs two pronouns: the one to output in the sentence (called 'written pronoun'),
     * and the one to use for conjugating the verb (called 'effective pronoun').
     * Conjugation rules are the same for many pronouns, so to simplify conjugation code,
     * I map each written pronoun to a corresponding effective pronoun.
     */
    if(subject.type === '1') {
        return subject.number === 's' ? ['I', 'I'] : ['we', 'they'];
    }
    else if(subject.type === '2') {
        return ['you', 'they'];
    }
    else {
        if(subject.number === 'p') {
            return ['they', 'they'];
        }
        else {
            switch(subject.gender) {
                case 'm': return ['he', 'he'];
                case 'f': return ['she', 'he'];
                default: return ['it', 'he'];
            }
        }
    }
}

function beConjSimple(pronoun, tenseTime, words) {
    if(tenseTime === 'present') {
        switch(pronoun) {
            case 'I': words.push('am'); break;
            case 'he': words.push('is'); break;
            case 'they': words.push('are'); break;
        }
    }
    else if(tenseTime === 'past') {
        switch(pronoun) {
            case 'I': words.push('was'); break;
            case 'he': words.push('was'); break;
            case 'they': words.push('were'); break;
        }
    }
    else if(tenseTime === 'future') {
        words.push('will', 'be');
    }
}

function haveConjSimple(pronoun, tenseTime, words) {
    if(tenseTime === 'present') {
        switch(pronoun) {
            case 'I': words.push('have'); break;
            case 'he': words.push('has'); break;
            case 'they': words.push('have'); break;
        }
    }
    else if(tenseTime === 'past') {
        words.push('had');
    }
    else if(tenseTime === 'future') {
        words.push('will', 'have');
    }
}

export const augmentations = {
    // 0: imperative, 1: conj for his, 2: continuous, 3: past, 4: past participle
    'be': ['be', 'is', 'being', 'was', 'been'],
    'have': ['have', 'has', 'having', 'had', 'had'],
    'ask': ['ask', 'asks', 'asking', 'asked', 'asked'],
    'bring': ['bring', 'brings', 'bringing', 'brought', 'brought'],
    'call': ['call', 'calls', 'calling', 'called', 'called'],
    'come': ['come', 'comes', 'coming', 'came', 'come'],
    'do': ['do', 'does', 'doing', 'did', 'done'],
    'drink': ['drink', 'drinks', 'drinking', 'drank', 'drunk'],
    'eat': ['eat', 'eats', 'eating', 'ate', 'eaten'],
    'feel': ['feel', 'feels', 'feeling', 'felt', 'felt'],
    'give': ['give', 'gives', 'giving', 'gave', 'given'],
    'go': ['go', 'goes', 'going', 'went', 'gone'],
    'hear': ['hear', 'hears', 'hearing', 'heard', 'heard'],
    'keep': ['keep', 'keeps', 'keeping', 'kept', 'kept'],
    'laugh': ['laugh', 'laughs', 'laughing', 'laughed', 'laughed'],
    'learn': ['learn', 'learns', 'learning', 'learned', 'learnt'],
    'putOn': ['put', 'puts', 'putting', 'put', 'put'],
    'putIn': ['put', 'puts', 'putting', 'put', 'put'],
    'see': ['see', 'sees', 'seeing', 'saw', 'seen'],
    'sleep': ['sleep', 'sleeps', 'sleeping', 'slept', 'slept'],
    'take': ['take', 'takes', 'taking', 'took', 'taken'],
    'tell': ['tell', 'tells', 'telling', 'told', 'told'],
    'walk': ['walk', 'walks', 'walking', 'walked', 'walked'],
    'write': ['write', 'writes', 'writing', 'wrote', 'written'],
};

function wordsToSentence(words) {
    if(words === null || words.length === 0) {
        return null;
    }
    const s = words.join(' ');
    return s.charAt(0).toUpperCase() + s.slice(1) + '.';
}

export function verbConj(subject, verb, tense, negate) {
    const [writtenPronoun, pronoun] = getPronouns(subject);
    const words = [writtenPronoun];
    const response = {'status': 'ok', 'text': null, 'msg': null};
    const augForms = augmentations[verb];
    if(augForms === undefined) {
        response.status = 'unimpl';
        response.msg = `verb '${verb}' doesn't have an augmentations entry.`;
        return response;
    }
    if(negate) {
        response.status = 'unimpl';
        response.msg = `negation is unimplemented.`;
        return response;
    }
    const [verbImp, verbHe, verbCont, verbPast, verbPP] = augForms;
    if(tense.type === 'simple') {
        if(verb === 'be') {
            beConjSimple(pronoun, tense.time, words);
        }
        else if(verb === 'have') {
            haveConjSimple(pronoun, tense.time, words);
        }
        else {
            if(tense.time === 'present') {
                words.push(pronoun === 'he' ? verbHe : verbImp);
            }
            else if(tense.time === 'past') {
                words.push(verbPast);
            }
            else if(tense.time === 'future') {
                words.push('will', verbImp);
            }
            else {
                response.status = 'error';
                response.msg = `unknown tense 'simple ${tense.time}'.`;
                return response;
            }
        }
    }
    else if(tense.type === 'continuous') {
        beConjSimple(pronoun, tense.time, words);
        words.push(verbCont);
    }
    else if(tense.type === 'perfect') {
        haveConjSimple(pronoun, tense.time, words);
        words.push(verbPP);
    }
    else {
        response.status = 'unimpl';
        response.msg = `tense type '${tense.type}' is unimplemented.`;
        return response;
    }
    response.text = wordsToSentence(words);
    return response;
}
