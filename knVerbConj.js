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

export const verbInfos = {
    'be': {},
    'have': null,
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

function beConjSimple(pronoun, tenseTime) {
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

export function verbConj(subject, verb, tense) {
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
            words.push(beConjSimple(pronoun, tense.time));
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
