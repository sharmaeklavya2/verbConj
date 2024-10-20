// [ Character manipulation and Sandhi ]=======================================

export const chars = {
    'a': 'ಅ',
    'aa': 'ಆ',
    'i': 'ಇ',
    'ii': 'ಈ',
    'u': 'ಉ',
    'uu': 'ಊ',
    'e': 'ಎ',
    'ee': 'ಏ',
    'ai': 'ಐ',
    'o': 'ಒ',
    'oo': 'ಓ',
    'au': 'ಔ',

    'ta': 'ತ',
    'da': 'ದ',
    'va': 'ವ',
    'ya': 'ಯ',
};

export const matras = {
    'a': '',
    'aa': 'ಾ',
    'i': 'ಿ',
    'ii': 'ೀ',
    'u': 'ು',
    'uu': 'ೂ',
    'e': 'ೆ',
    'ee': 'ೇ',
    'ai': 'ೈ',
    'o': 'ೊ',
    'oo': 'ೋ',
    'au': 'ೌ',
    'talk': '್',
}

const charToMatra = {};

function initCharToMatra() {
    if(!charToMatra.hasOwnProperty('aa')) {
        for(const [code, char] of Object.entries(chars)) {
            const matra = matras[code];
            if(matra !== undefined) {
                charToMatra[char] = matra;
            }
        }
    }
}

export const knCatMap = ('-mmm-vvvvvvvv-vv'
    + 'v-vvvccccccccccc'
    + 'ccccccccc-cccccc'
    + 'cccc-ccccc--mmmm'
    + 'mmmmm-mmm-mmmt--'
    + '--------------c-'
    + 'vvmm------------'
    + '----------------');
    // v: vowel, c: consonant, m: matra, -: invalid, t: talakatta

export function getCharCategory(ch) {
    const blockSize = 0x80, knStartPoint = 0x0C80;
    const codePoint = ch.codePointAt(0);
    const blockOffset = codePoint & (blockSize - 1);
    const blockStartPoint = codePoint & (-blockSize);
    if(blockStartPoint !== knStartPoint) {
        return '-';
    }
    else {
        return knCatMap[blockOffset];
    }
}

function phConcatRaw(w1, w2) {
    // phonetic concatenation of words w1 and w2
    initCharToMatra();
    const l1 = w1.length, l2 = w2.length;
    if(l1 === 0) {
        return w2;
    }
    else if(l2 === 0) {
        return w1;
    }
    const cat1 = getCharCategory(w1[l1-1]), cat2 = getCharCategory(w2[0]);
    if(cat1 === 't' && cat2 === 'v') {
        initCharToMatra();
        return w1.slice(0, -1) + charToMatra[w2[0]] + w2.slice(1,);
    }
    else if('vcm'.includes(cat1) && cat2 === 'c') {
        return w1 + w2;
    }
    else {
        throw new Error(`invalid category pair (${cat1}, ${cat2})`);
    }
}

function phConcat(words) {
    const n = words.length;
    const wordsCopy = Array.from(words);
    for(let i=n-2; i>=0; --i) {
        wordsCopy[i] = phConcatRaw(wordsCopy[i], wordsCopy[i+1]);
    }
    return wordsCopy[0];
}

// [ Transliteration and conjugation data ]====================================

export const enToKn = {
    'naanu': 'ನಾನು',
    'naavu': 'ನಾವು',
    'neenu': 'ನೀನು',
    'neevu': 'ನೀವು',
    'avanu': 'ಅವನು',
    'avalu': 'ಅವಳು',
    'avaru': 'ಅವರು',
    'adu': 'ಅದು',
    'avu': 'ಅವು',

    'idd': 'ಇದ್ದ್',
    'ide': 'ಇದೆ',
    'iru': 'ಇರು',
    'ittu': 'ಇತ್ತು',
    'ive': 'ಇವೆ',
    'tt': 'ತ್ತ್',
};

const negIru = {
    'present': 'ಇಲ್ಲ',
    'past': 'ಇರಲಿಲ್ಲ',
    'future': 'ಇರಲ್ಲ',
};

const negSuffix = {
    'present': 'ಅಲ್ಲ',
    'past': 'ಅಲಿಲ್ಲ',
    'future': 'ಉವುದಿಲ್ಲ',
};

export const verbInfos = {
    'be': {'root': 'ಇರು', 'prp': 'ಇದ್ದ', 'pvp': 'ಇದ್ದು', 'pastAdu': 'ಇತ್ತು'},
    'have': null,
    'ask': {'root': 'ಕೇಳು'},
    'become': {'root': 'ಆಗು', 'prp': 'ಆದ', 'pvp': 'ಆಗಿ', 'pastAdu': 'ಆಯಿತು'},
    'bring': {'root': 'ತರು', 'prp': 'ತಂದ'},
    'buy': {'root': 'ಕೊಳ್ಳು', 'prp': 'ಕೊಂಡ'},
    'call': {'root': 'ಕರೆ'},
    'come': {'root': 'ಬರು', 'prp': 'ಬಂದ', 'pastAdu': 'ಬಂತು'},
    'do': {'root': 'ಮಾಡು'},
    'drink': {'root': 'ಕುಡಿ'},
    'eat': {'root': 'ತಿನ್ನು', 'prp': 'ತಿಂದ'},
    'feel': {'root': 'ಅನಿಸು'},
    'forget': {'root': 'ಮರೆ', 'prp': 'ಮರೆತ'},
    'give': {'root': 'ಕೊಡು', 'prp': 'ಕೊಟ್ಟ'},
    'go': {'root': 'ಹೋಗು', 'prp': 'ಹೊದ', 'pvp': 'ಹೋಗಿ', 'pastAdu': 'ಹೋಯಿತು'},
    'hear': {'root': 'ಕೇಳು'},
    'keep': {'root': 'ಇಡು', 'prp': 'ಇಟ್ಟ'},
    'laugh': {'root': 'ನಗು', 'prp': 'ನಕ್ಕ', 'pvp': 'ನಕ್ಕಿ'},
    'learn': {'root': 'ಕಲಿ', 'prp': 'ಕಲಿತ'},
    'meet': {'root': 'ಸಿಗು', 'prp': 'ಸಿಕ್ಕ', 'pvp': 'ಸಿಕ್ಕಿ'},
    'protect': {'root': 'ಕಾ', 'prp': 'ಕಾದ'},
    'putOn': {'root': 'ಇಡು', 'prp': 'ಇಟ್ಟ'},
    'putIn': {'root': 'ಹಾಕು'},
    'say': {'root': 'ಅನ್ನು', 'prp': 'ಅಂದ'},
    'see': {'root': 'ನೋಡು'},
    'sleep': {'root': 'ಮಲಗು'},
    'steal': {'root': 'ಕದಿ', 'prp': 'ಕದ್ದ'},
    'take': {'root': 'ತೊಗೊಳ್ಳು', 'prp': 'ತೊಗೊಂಡ'},
    'tell': {'root': 'ಹೇಳು'},
    'walk': {'root': 'ನಡೆ'},
    'write': {'root': 'ಬರೆ'},
};

const endings = {
    'naanu': ['ಏನೆ', 'ಎನು'],
    'naavu': ['ಏವೆ', 'ಎವು'],
    'neenu': ['ಈಯ', 'ಎ'],
    'neevu': ['ಈರಿ', 'ಇರಿ'],
    'avanu': ['ಆನೆ', 'ಅನು'],
    'avalu': ['ಆಳೆ', 'ಅಳು'],
    'avaru': ['ಆರೆ', 'ಅರು'],
    'adu': ['ಅದೆ', 'ಉದು'],
    'avu': ['ಅವೆ', 'ಅವು'],
}

// [ Utilities ]===============================================================

function wordsToSentence(words) {
    if(words === null || words.length === 0) {
        return null;
    }
    return words.join(' ') + '.';
}

function getPronoun(subject) {
    if(subject.type === '1') {
        return subject.number === 's' ? 'naanu' : 'naavu';
    }
    else if(subject.type === '2') {
        return subject.number === 's' ? 'neenu' : 'neevu';
    }
    else if(subject.gender === 'm') {
        return subject.number === 's' ? 'avanu' : 'avaru';
    }
    else if(subject.gender === 'f') {
        return subject.number === 's' ? 'avalu' : 'avaru';
    }
    else {
        return subject.number === 's' ? 'adu' : 'avu';
    }
}

// [ Conjugation Logic ]=======================================================

function beConjSimple(pronoun, tenseTime, negate) {
    if(negate) {
        return negIru[tenseTime];
    }
    const [prEnd, fuEnd] = endings[pronoun];
    if(tenseTime === 'present') {
        if(pronoun === 'adu') {
            return enToKn.ide;
        }
        else if(pronoun === 'avu') {
            return enToKn.ive;
        }
        else {
            return phConcat([enToKn.idd, prEnd]);
        }
    }
    else if(tenseTime === 'past') {
        if(pronoun === 'adu') {
            return enToKn.ittu;
        }
        else {
            return phConcat([enToKn.idd, fuEnd]);
        }
    }
    else {
        return phConcat([enToKn.iru, enToKn.tt, prEnd]);
    }
}

function getPresentRoot(verbInfo) {
    const yu = chars.ya + matras.u;
    const root = verbInfo.root;
    return (root[root.length - 1] !== matras.u) ? root + yu : root;
}

function getPrpTrunc(verbInfo) {
    if(verbInfo.prp !== undefined) {
        return verbInfo.prp + matras.talk;
    }
    else {
        const root = verbInfo.root;
        const dat = chars.da + matras.talk;
        if(root[root.length-1] === matras.u) {
            return root.slice(0, -1) + matras.i + dat;
        }
        else {
            return root + dat;
        }
    }
}

function getPastAdu(verbInfo) {
    const itu = matras.i + chars.ta + matras.u;
    if(verbInfo.pastAdu !== undefined) {
        return verbInfo.pastAdu;
    }
    else if(verbInfo.prp !== undefined) {
        return phConcat([verbInfo.prp + matras.talk, itu]);
    }
    else {
        const root = verbInfo.root;
        if(root[root.length-1] === matras.u) {
            return root.slice(0, -1) + itu;
        }
        else {
            return root + chars.ya + itu;
        }
    }
}

function getPvpTrunc(verbInfo) {
    if(verbInfo.pvp !== undefined) {
        return verbInfo.pvp.slice(0, -1) + matras.talk;
    }
    else if(verbInfo.prp !== undefined) {
        return verbInfo.prp + matras.talk;
    }
    else {
        const root = verbInfo.root;
        if(root[root.length-1] === matras.u) {
            return root.slice(0, -1) + matras.talk;
        }
        else {
            return root + chars.da + matras.talk;
        }
    }
}

export function verbConj(subject, verb, tense, negate) {
    const response = {'status': 'ok', 'text': null, 'msg': null};
    const words = [];
    const verbInfo = verbInfos[verb];
    const pronoun = getPronoun(subject);
    words.push(enToKn[pronoun]);
    const [prEnd, fuEnd] = endings[pronoun];
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
            response.status = 'unsupp';
            response.msg = `tense type '${tense.type}' is unsupported for verb 'be'.`;
            return response;
        }
    }
    else if(tense.type === 'simple') {
        const presentRoot = getPresentRoot(verbInfo);
        if(negate) {
            words.push(phConcat([presentRoot.slice(0, -1) + matras.talk,
                negSuffix[tense.time]]));
        }
        else if(tense.time === 'present') {
            words.push(phConcat([presentRoot, enToKn.tt, prEnd]));
        }
        else if(tense.time === 'future') {
            words.push(phConcat([presentRoot, chars.va + matras.talk, fuEnd]));
        }
        else {
            if(pronoun === 'adu') {
                words.push(getPastAdu(verbInfo));
            }
            else {
                const prpTrunc = getPrpTrunc(verbInfo);
                words.push(phConcat([prpTrunc, fuEnd]));
            }
        }
    }
    else if(tense.type === 'continuous') {
        const presentRoot = getPresentRoot(verbInfo);
        words.push(phConcat([presentRoot, enToKn.tt, chars.aa]));
        words.push(beConjSimple(pronoun, tense.time, negate));
    }
    else if(tense.type === 'perfect') {
        const pvpTrunc = getPvpTrunc(verbInfo);
        const beConj = beConjSimple(pronoun, tense.time, negate);
        words.push(phConcat([pvpTrunc, beConj]));
    }
    else {
        response.status = 'unimpl';
        response.msg = `tense type '${tense.type}' is unimplemented.`;
        return response;
    }
    response.text = wordsToSentence(words);
    return response;
}
