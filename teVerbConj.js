// [ Character manipulation ]==================================================

import {Script} from './indianCharUtil.js';

const TE = new Script(0x0C00);
TE.chars.ta = 'త';
TE.chars.ma = 'మ';

function sandhi(w1, w2) {
    /* performs simple sandhi, i.e., only one of the following types:
    1.  w1 or w2 is empty
    2.  if w1 ends with a bindu and w2 starts with a vowel, change the bindu to మ.
    2.  if w2 starts with a vowel, remove w1's ending vowel (if any) and concat
    3.  if w2 starts with a consonant or diacritic, simply concat
    */ 
    const l1 = w1.length, l2 = w2.length;
    if(l1 === 0) {
        return w2;
    }
    else if(l2 === 0) {
        return w1;
    }
    const cat1 = TE.getCharCategory(w1[l1-1]), cat2 = TE.getCharCategory(w2[0]);
    if(w1.endsWith(TE.diacritics.bindu) && cat2 === 'v') {
        return w1.slice(0, -1) + TE.chars.ma + TE.charToMatra[w2[0]] + w2.slice(1,);
    }
    else if('cm'.includes(cat1) && cat2 === 'v') {
        const w1b = (cat1 === 'm') ? w1.slice(0, -1) : w1;
        return w1b + TE.charToMatra[w2[0]] + w2.slice(1,);
    }
    else if('vcm'.includes(cat1) && 'cd'.includes(cat2)) {
        return w1 + w2;
    }
    else {
        throw new Error(`invalid category pair (${cat1}, ${cat2})`);
    }
}

// [ Utilities ]===============================================================

function wordsToSentence(words) {
    if(words === undefined || words.length === 0) {
        return undefined;
    }
    return words.join(' ') + '.';
}

function getPronouns(subject) {
    /* outputs two pronouns: the one to output in the sentence (called 'written pronoun'),
     * and the one to use for conjugating the verb (called 'effective pronoun').
     * Conjugation rules are the same for many pronouns, so to simplify conjugation code,
     * I map each written pronoun to a corresponding effective pronoun.
     */
    if(subject.type === '1') {
        return subject.number === 's' ? ['నేను', 'nenu'] : ['మనం', 'manam'];
    }
    else if(subject.type === '2') {
        return subject.number === 's' ? ['నువ్వు', 'nuvvu'] : ['మీరు', 'meeru'];
    }
    else if(subject.gender === 'm') {
        return subject.number === 's' ? ['అతను', 'atanu'] : ['వాళ్ళు', 'meeru'];
    }
    else if(subject.gender === 'f') {
        return subject.number === 's' ? ['ఆమె', 'adi'] : ['వాళ్ళు', 'meeru'];
    }
    else {
        return subject.number === 's' ? ['అది', 'adi'] : ['అవి', 'avi'];
    }
}

// [ Conjugation data ]========================================================

export const verbInfos = {
    // imp: imperative, ger: gerund, inf: infinitive
    'be': {'imp': 'ఉండు', 'ger': 'ఉండటం'},
    'have': null,
};

// [ Conjugation Logic ]=======================================================

const endings = {
    'nenu': ['ఆను', 'ను'],
    'nuvvu': ['ఆవు', 'వు'],
    'meeru': ['ఆరు', 'రు'],
    'manam': ['ఆం', TE.diacritics.bindu],
    'atanu': ['ఆడు', 'డు'],
    'adi': ['అది', 'దు'],
    'avi': ['ఆయి', 'వు'],
};

function beConjSimple(pronoun, tenseTime, negate) {
    const beVerbInfo = verbInfos['be'];
    const [affEnd, negEnd] = endings[pronoun];
    if(negate) {
        const root = (tenseTime === 'future') ? 'ఉండ' : 'లే';
        return sandhi(root, negEnd);
    }
    else {
        if(pronoun === 'adi') {
            return (tenseTime === 'future') ? 'ఉంటుంది': 'ఉంది';
        }
        else {
            const root = (tenseTime === 'future') ? 'ఉంటు' : 'ఉన్నా';
            return sandhi(root, affEnd);
        }
    }
}

export function verbConj(subject, verb, tense, negate) {
    const response = {'status': 'ok', 'text': undefined, 'msg': undefined};
    const words = [];
    const verbInfo = verbInfos[verb];
    const [writtenPronoun, pronoun] = getPronouns(subject);
    words.push(writtenPronoun);
    // const [affEnd, negEnd] = endings[pronoun];
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
            words.push(beConjSimple(pronoun, tense.time, negate));
        }
        else {
            response.status = 'unimpl';
            response.msg = `tense type '${tense.type}' is unimplemented for verb 'be'.`;
            return response;
        }
    }
    else {
        response.status = 'unimpl';
        response.msg = `tense type '${tense.type}' is unimplemented.`;
        return response;
    }
    response.text = wordsToSentence(words);
    return response;
}
