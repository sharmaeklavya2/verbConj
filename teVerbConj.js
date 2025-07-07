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

class UnimplError extends Error {}

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

export const verbInfoFieldDescriptions = {
    'imp': 'imperative form',
    'ger': 'gerund form',
    'inf': 'infinitive form',
    'prv': 'present verbal participle',
    'par': 'past root',
    'pastAdi': 'past అది form',
}

export const verbInfos = {
    'be': {
        'imp': 'ఉండు',
        'prv': 'ఉంటూ',
        'par': 'ఉన్న',
        'ger': 'ఉండటం',
    },
    'have': null,
    'ask': {
        'imp': 'అడుగు',
        'par': 'అడిగ',
        'pastAdi': 'అడిగింది',
        'inf': 'అడగ',
    },
    'bring': {
        'imp': 'తీసుకురా',
        'prv': 'తీసుకొస్తూ',
        'par': 'తీసుకొచ్చా',
        'pastAdi': 'తీసుకొచ్చింది',
        'pastWarn': true,
        'ger': 'తీసుకురావటం',
    },
    'call': {
        'imp': 'పిలిచు',
    },
    'come': {
        'imp': 'రా',
        'prv': 'వస్తూ',
        'par': 'వచ్చా',
        'pastAdi': 'వచ్చింది',
        'pastWarn': true,
        'ger': 'రావటం',
    },
    'do': {
        'imp': 'చెయ్యి',
        'prv': 'చేస్తూ',
        'par': 'చేశా',
        'pastAdi': 'చేసింది',
        'pastWarn': true,
    },
    'drink': {
        'imp': 'తాగు',
    },
    'eat': {
        'imp': 'తిను',
        'prv': 'తింటూ',
        'par': 'తిన్నా',
        'pastAdi': 'తిన్నది',
        'ger': 'తినటం',
    },
    'give': {
        'imp': 'ఇవ్వు',
    },
    'go': {
        'imp': 'వెళ్ళు',
        'prv': 'వెళ్తూ',
        'par': 'వెళ్ళా',
        'pastAdi': 'వెళ్లింది',
        'pastWarn': true,
        'ger': 'పోవటం',
    },
    'hear': {
        'imp': 'విను',
        'prv': 'వింటూ',
        'par': 'విన్న',
        'pastAdi': 'విన్నది',
    },
    'jump': {
        'imp': 'దూకు',
        'prv': 'దూకుతూ',
    },
    'keep': undefined,
    'laugh': {
        'imp': 'నవ్వు',
    },
    'learn': undefined,
    'read': {
        'imp': 'చదువు',
        'prv': 'చదువుతూ',
        'par': 'చదివా',
        'pastAdi': 'చదివింది',
        'pastWarn': true,
        'ger': 'చదవటం',
        'inf': 'చదవ',
    },
    'run': {
        'imp': 'పరిగెత్తు',
        'prv': 'పరిగెత్తూ',
    },
    'see': {
        'imp': 'చూడు',
        'prv': 'చూస్తూ',
        'par': 'చూశా',
        'pastAdi': 'చూసింది',
        'pastWarn': true,
    },
    'sing': {
        'imp': 'పాడు',
        'par': 'పాడ',
        'pastAdi': 'పాడింది',
        'pastWarn': true,
    },
    'sit': {
        'imp': 'కూర్చో',
        'prv': 'కూర్చుంటూ',
        'par': 'కూర్చున్న',
        'pastAdi': 'కూర్చుంది',
    },
    'sleep': {
        'imp': 'నిద్రపో',
    },
    'take': {
        'imp': 'తీసుకో',
        'prv': 'తీసుకుంటూ',
        'par': 'తీసుకున్న',
        'pastAdi': 'తీసుకుంది',
    },
    'talk': {
        'imp': 'మాట్లాడు',
        'ger': 'మాట్లాడటం',
    },
    'tell': {
        'imp': 'చెప్పు',
        'prv': 'చెప్తూ',
        'par': 'చెప్ప',
        'pastAdi': 'చెప్పింది',
        'pastWarn': true,
    },
    'walk': undefined,
    'write': {
        'imp': 'రాయి',
        'prv': 'రాస్తూ',
        'par': 'రాశా',
        'pastAdi': 'రాసింది',
        'pastWarn': true,
        'ger': 'రాయటం',
    },
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
    const [affEnd, negEnd] = endings[pronoun];
    // present = past in Telugu
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

/*
const unnadi = TE.matras.u + 'న్నది';
const undi = TE.matras.u + TE.diacritics.bindu + 'ది';

function adiCompress(word) {
    return word.endsWith(unnadi) ? word.slice(0, -unnadi.length) + undi : word;
}
*/

function getVIF(verbInfo, field) {
    // get verbInfo field, and throw an UnimplError if it doesn't exist 
    const value = verbInfo[field];
    if(value === undefined) {
        const descr = verbInfoFieldDescriptions[field];
        throw new UnimplError(`missing ${descr}.`);
    }
    else {
        return value;
    }
}

const longVowels = 'ఆఈఊఏఐఓఔ';

function getInf(verbInfo) {
    const inf = verbInfo.inf;
    if(inf !== undefined) {
        return inf;
    }
    const imp = getVIF(verbInfo, 'imp');
    const endVowel = TE.matraToChar[imp[imp.length - 1]];
    if(longVowels.includes(endVowel)) {
        return imp;
    }
    else {
        return sandhi(imp, TE.chars.a);
    }
}

export function verbConj(subject, verb, tense, negate) {
    const response = {'status': 'ok', 'text': undefined, 'msg': undefined};
    const words = [];
    const verbInfo = verbInfos[verb];
    const [writtenPronoun, pronoun] = getPronouns(subject);
    words.push(writtenPronoun);
    const [affEnd, negEnd] = endings[pronoun];
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
    else if(verb === 'be' && tense.type === 'simple') {
        words.push(beConjSimple(pronoun, tense.time, negate));
    }
    else {
        try {
            if(tense.type === 'simple') {
                // present = future in Telugu
                if(negate) {
                    const inf = getInf(verbInfo);
                    const suffix = (tense.time === 'past') ? 'లేదు' : negEnd;
                    words.push(inf + suffix);
                }
                else if(tense.time === 'past') {
                    if(pronoun === 'adi') {
                        words.push(getVIF(verbInfo, 'pastAdi'));
                    }
                    else {
                        const par = getVIF(verbInfo, 'par');
                        if(verbInfo.pastWarn) {
                            response.status = 'warn';
                            response.msg = 'pronounciation ≠ spelling';
                        }
                        words.push(sandhi(par, affEnd));
                    }
                }
                else {
                    const suffix = (pronoun === 'adi') ? 'ఉంది' : affEnd;
                    const prv = getVIF(verbInfo, 'prv');
                    words.push(sandhi(prv, suffix));
                }
            }
            else if(tense.type === 'continuous') {
                if(negate) {
                    if(tense.time !== 'present') {
                        response.status = 'unimpl';
                        response.msg = `negative ${tense.time} continuous is unimplemented.`;
                        return response;
                    }
                    else {
                        words.push(getVIF(verbInfo, 'ger'));
                        words.push('లేదు');
                    }
                }
                else {
                    // present = past in Telugu
                    const suffix = (pronoun === 'adi' && tense.time !== 'future') ?
                        'ఓంది' : beConjSimple(pronoun, tense.time, negate);
                    const prv = getVIF(verbInfo, 'prv');
                    words.push(sandhi(prv, suffix));
                }
            }
            else if(tense.type === 'perfect') {
                response.status = 'unsupp';
                response.msg = 'perfect tense is unsupported.';
                return response;
            }
            else {
                response.status = 'error';
                response.msg = `unrecognized tense type '${tense.type}'.`;
                return response;
            }
        }
        catch (e) {
            if(e instanceof UnimplError) {
                response.status = 'unimpl';
                response.msg = e.message;
                return response;
            }
            else {
                throw e;
            }
        }
    }
    response.text = wordsToSentence(words);
    return response;
}
