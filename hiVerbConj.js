export const enToDev = {
    '.': '।',
    'aap': 'आप',
    'dekh': 'देख',
    'dekha': 'देखना',
    'likh': 'लिख',
    'likha': 'लिखा',
    'gaya': 'गया',
    'hai': 'है',
    'hain': 'हैं',
    'ho': 'हो',
    'hoga': 'होगा',
    'hoge': 'होगे',
    'hogi': 'होगी',
    'honge': 'होंगे',
    'hongi': 'होंगी',
    'hoon': 'हूँ',
    'hounga': 'होऊँगा',
    'houngi': 'होऊँगी',
    'hum': 'हम',
    'humne': 'हमने',
    'ja': 'जा',
    'kar': 'कर',
    'main': 'मैं',
    'maine': 'मैंने',
    'ta': 'ता',
    'tha': 'था',
    'thay': 'थे',
    'thee': 'थी',
    'theen': 'थीं',
    'tum': 'तुम',
    'tumne': 'तुमने',
    'unhone': 'उन्होंने',
    'usne': 'उसने',
    'vah': 'वह',
    've': 'वे',
};

export const matras = {
    'aa': 'ा',
    'i': 'ि',
    'ii': 'ी',
    'u': 'ु',
    'uu': 'ू',
    'e': 'े',
    'ai': 'ै',
    'o': 'ो',
    'au': 'ौ',
    'halant': '्',
    'bindu': 'ं',
    'cbindu': 'ँ',
};

export const chars = {
    'aa': 'आ',
    'ii': 'ई',
    'e': 'ए',
    'ya': 'य',
};

export const verbInfos = {
    // 'tr': is transitive
    'be': {'tr': false},
    'have': null,
    'do': {'tr': true, 'cont': enToDev.kar, 'past': enToDev.kiya},
    'see': {'tr': true, 'cont': enToDev.dekh, 'past': enToDev.dekha},
    'write': {'tr': true, 'cont': enToDev.likh, 'past': enToDev.likha},
    'go': {'tr': false, 'cont': enToDev.ja, 'past': enToDev.gaya},
};

function wordsToSentence(words) {
    if(words === null || words.length === 0) {
        return null;
    }
    return words.join(' ') + enToDev['.'];
}

function getPronouns(subject) {
    // return the base pronoun and the karta kaarak
    if(subject.type === '1') {
        return subject.number === 's' ? [enToDev.main, enToDev.maine] : [enToDev.hum, enToDev.humne];
    }
    else if(subject.type === '2') {
        return subject.number === 's' ? [enToDev.tum, enToDev.tumne] : [enToDev.aap, enToDev.aapne];
    }
    else {
        return subject.number === 's' ? [enToDev.vah, enToDev.usne] : [enToDev.ve, enToDev.unhone];
    }
}

function useTrPr(tense, verbIsTr) {
    return verbIsTr && ((tense.type === 'simple' && tense.time === 'past') || tense.type === 'perfect');
}

function subjectToObjct(subject) {
    if(subject.type !== '2' && subject.number === 's') {
        return {'gender': subject.gender, 'number': 's'};
    }
    else if(subject.type !== '1' && subject.number === 'p') {
        return {'gender': subject.gender, 'number': 'p'};
    }
    else if(subject.type === '1' && subject.number === 'p') {
        return {'gender': 'm', 'number': 'p'};
    }
    else if(subject.type === '2' && subject.number === 's') {
        return subject.gender === 'm' ? {'gender': 'm', 'number': 'p'} : {'gender': 'f', 'number': 's'};
    }
}

function trnByObject(word, object, useFp=false) {
    if(!useFp) {
        object = Object.assign({}, object);
        if(object.gender === 'f') {
            object.number = 's';
        }
    }
    const yaa = matras.ya + matras.aa;
    const iyaa = matras.i + yaa;
    if(object.gender === 'm') {
        if(object.number === 's') {
            return word;
        }
        if(word.endsWith(yaa)) {
            return word.slice(0, -2) + chars.e;
        }
        else if(word.endsWith(chars.aa)) {
            return word.slice(0, -1) + chars.e;
        }
        else if(word.endsWith(matras.aa)) {
            return word.slice(0, -1) + matras.e;
        }
        else {
            throw new Error(`word with unsupported ending: ${word}`);
        }
    }
    else if(object.gender === 'f') {
        let sing = null;
        if(word.endsWith(iyaa)) {
            sing = word.slice(0, -iyaa.length) + matras.ii;
        }
        else if(word.endsWith(yaa)) {
            sing = word.slice(0, -yaa.length) + chars.ii;
        }
        else if(word.endsWith(chars.aa)) {
            sing = word.slice(0, -1) + chars.ii;
        }
        else if(word.endsWith(matras.aa)) {
            sing = word.slice(0, -1) + matras.ii;
        }
        else {
            throw new Error(`word with unsupported ending: ${word}`);
        }
        return (object.number === 's' ? sing : sing + matras.bindu);
    }
    else {
        throw new Error(`unrecognized gender ${object.gender}`);
    }
    return word;
}

function beConjSimple(subject, tenseTime, words) {
    if(tenseTime === 'present') {
        if(subject.number === 'p') {
            words.push(enToDev.hain);
        }
        else if(subject.type === '1') {
            words.push(enToDev.hoon);
        }
        else if(subject.type === '2') {
            words.push(enToDev.ho);
        }
        else {
            words.push(enToDev.hai);
        }
    }
    else if(tenseTime === 'past') {
        const subjObj = subjectToObjct(subject);
        const thaForm = trnByObject(enToDev.tha, subjObj, true);
        words.push(thaForm);
    }
    else {
        if(subject.type === '1' && subject.number === 's') {
            words.push(subject.gender === 'm' ? enToDev.hounga : enToDev.houngi);
        }
        else if(subject.type === '1' && subject.number === 'p') {
            words.push(enToDev.honge);
        }
        else if(subject.type === '2' && subject.number === 's') {
            words.push(subject.gender === 'm' ? enToDev.hoge : enToDev.hogi);
        }
        else if((subject.type === '2' || subject.type === '3') && subject.number === 'p') {
            words.push(subject.gender === 'm' ? enToDev.honge : enToDev.hongi);
        }
        else if(subject.type === '3' && subject.number === 's') {
            words.push(subject.gender === 'm' ? enToDev.hoga : enToDev.hogi);
        }
    }
}

/*
function getTaSuffix(subject) {
    if(subject.type === 1 && subject.number === 'p') {
        return enToDev.te;
    }
    else if(subject.type != 2 && subject.number === 's') {
        return (subject.gender === 'm' ? enToDev.ta : enToDev.ti);
    }
    else {
        return (subject.gender === '' ? enToDev.ta : enToDev.ti);
    }
}
*/

export function verbConj(subject, object, verb, tense) {
    const response = {'status': 'ok', 'text': null, 'msg': null};
    if(subject.gender === 'n') {
        subject = {'type': subject.type, 'number': subject.number, 'gender': 'm'};
        response.status = 'warn';
        response.msg = "subject.gender changed from n to m.";
    }
    // object = Object.assign({}, object);
    // object.type = '3';
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
    const [itrPr, trPr] = getPronouns(subject);
    const isTr = useTrPr(tense, verbInfo.tr);
    words.push(isTr ? trPr : itrPr);
    if(verb === 'be') {
        if(tense.type === 'simple') {
            beConjSimple(subject, tense.time, words);
        }
        else {
            response.status = 'unsupp';
            response.msg = `verb '${verb}' is unsupported for non-simple tenses.`;
            return response;
        }
    }
    else if(tense.type === 'simple') {
        const subjObj = subjectToObjct(subject);
        if(tense.time === 'present') {
            const taForm = trnByObject(enToDev.ta, subjObj, false);
            words.push(verbInfo.cont + taForm);
            beConjSimple(subject, 'present', words);
        }
        else if(tense.time === 'past') {
            response.status = 'unimpl';
            response.msg = `simple past tense is unimplemented.`;
            return response;
        }
        else if(tense.time === 'future') {
            response.status = 'unimpl';
            response.msg = `simple future tense is unimplemented.`;
            return response;
        }
    }
    else if(tense.type === 'continuous') {
        response.status = 'unimpl';
        response.msg = `tense type '${tense.type}' is unimplemented.`;
        return response;
    }
    else if(tense.type === 'perfect') {
        response.status = 'unimpl';
        response.msg = `tense type '${tense.type}' is unimplemented.`;
        return response;
    }
    else {
        response.status = 'unimpl';
        response.msg = `tense type '${tense.type}' is unimplemented.`;
        return response;
    }
    response.text = wordsToSentence(words);
    return response;
}