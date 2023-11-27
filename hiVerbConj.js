export const enToDev = {
    // TODO: use devanagari text
    '.': '.',
    'aap': 'aap',
    'hai': 'hai',
    'hain': 'hain',
    'ho': 'ho',
    'hoga': 'hoga',
    'hoge': 'hoge',
    'hogi': 'hogi',
    'honge': 'honge',
    'hongi': 'hongi',
    'hoon': 'hoon',
    'hounga': 'hounga',
    'houngi': 'houngi',
    'hum': 'hum',
    'humne': 'humne',
    'main': 'main',
    'maine': 'maine',
    'tha': 'tha',
    'thay': 'thay',
    'thee': 'thee',
    'theen': 'theen',
    'tum': 'tum',
    'tumne': 'tumne',
    'unhone': 'unhone',
    'usne': 'usne',
    'vah': 'vah',
    've': 've',
}

export const verbInfos = {
    // 'tr': is transitive
    'be': {'tr': false},
    'have': null,
    'do': {'tr': true},
    'see': {'tr': true},
    'write': {'tr': true},
    'go': {'tr': false},
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

function wordsToSentence(words) {
    if(words === null || words.length === 0) {
        return null;
    }
    return words.join(' ') + enToDev['.'];
}

function transformNG(word, number, gender) {
    // TODO
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
        if((subject.type === '1' || subject.type === '3') && subject.number === 's') {
            words.push(subject.gender === 'm' ? enToDev.tha : enToDev.thee);
        }
        else if((subject.type === '2' || subject.type === '3') && subject.number === 'p') {
            words.push(subject.gender === 'm' ? enToDev.thay : enToDev.theen);
        }
        else if(subject.type === '1' && subject.number === 'p') {
            words.push(enToDev.thay);
        }
        else if(subject.type === '2' && subject.number === 's') {
            words.push(subject.gender === 'm' ? enToDev.thay : enToDev.thee);
        }
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

export function verbConj(subject, object, verb, tense) {
    const response = {'status': 'ok', 'text': null, 'msg': null};
    if(subject.gender === 'n') {
        subject = {'type': subject.type, 'number': subject.number, 'gender': 'm'};
        response.status = 'warn';
        response.msg = "subject.gender changed from n to m.";
    }
    object = Object.assign({}, object);
    object.type = '3';
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
    if(tense.type === 'simple') {
        words.push((tense.time === 'past' && verbInfo.tr) ? trPr : itrPr);
        if(verb === 'be') {
            beConjSimple(subject, tense.time, words);
        }
        else {
            response.status = 'unimpl';
            response.msg = `verb '${verb}' is not implmented.`;
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
