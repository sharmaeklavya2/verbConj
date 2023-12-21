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
    // 0: conj for his, 1: continuous, 2: past, 3: past participle
    'be': ['is', 'being', 'was', 'been'],
    'have': ['has', 'having', 'had', 'had'],
    'ask': ['asks', 'asking', 'asked', 'asked'],
    'bring': ['brings', 'bringing', 'brought', 'brought'],
    'call': ['calls', 'calling', 'called', 'called'],
    'come': ['comes', 'coming', 'came', 'come'],
    'do': ['does', 'doing', 'did', 'done'],
    'drink': ['drinks', 'drinking', 'drank', 'drunk'],
    'eat': ['eats', 'eating', 'ate', 'eaten'],
    'feel': ['feels', 'feeling', 'felt', 'felt'],
    'give': ['gives', 'giving', 'gave', 'given'],
    'go': ['goes', 'going', 'went', 'gone'],
    'hear': ['hears', 'hearing', 'heard', 'heard'],
    'keep': ['keeps', 'keeping', 'kept', 'kept'],
    'laugh': ['laughs', 'laughing', 'laughed', 'laughed'],
    'learn': ['learns', 'learning', 'learned', 'learnt'],
    'see': ['sees', 'seeing', 'saw', 'seen'],
    'sleep': ['sleeps', 'sleeping', 'slept', 'slept'],
    'take': ['takes', 'taking', 'took', 'taken'],
    'tell': ['tells', 'telling', 'told', 'told'],
    'walk': ['walks', 'walking', 'walked', 'walked'],
    'write': ['writes', 'writing', 'wrote', 'written'],
};

function wordsToSentence(words) {
    if(words === null || words.length === 0) {
        return null;
    }
    const s = words.join(' ');
    return s.charAt(0).toUpperCase() + s.slice(1) + '.';
}

export function verbConj(subject, verb, tense) {
    const [writtenPronoun, pronoun] = getPronouns(subject);
    const words = [writtenPronoun];
    const response = {'status': 'ok', 'text': null, 'msg': null};
    const augForms = augmentations[verb];
    if(augForms === undefined) {
        response.status = 'unimpl';
        response.msg = `verb '${verb}' doesn't have an augmentations entry.`;
        return response;
    }
    const [verbHe, verbCont, verbPast, verbPP] = augForms;
    if(tense.type === 'simple') {
        if(verb === 'be') {
            beConjSimple(pronoun, tense.time, words);
        }
        else if(verb === 'have') {
            haveConjSimple(pronoun, tense.time, words);
        }
        else {
            if(tense.time === 'present') {
                words.push(pronoun === 'he' ? verbHe : verb);
            }
            else if(tense.time === 'past') {
                words.push(verbPast);
            }
            else if(tense.time === 'future') {
                words.push('will', verb);
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
