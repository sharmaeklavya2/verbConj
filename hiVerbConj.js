import {Script} from './indianCharUtil.js';

const HI = new Script(0x0900);
HI.chars.ga = 'ग';

export const enToDev = {
    '.': '।',
    'aap': 'आप',
    'aapne': 'आपने',
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
    'main': 'मैं',
    'maine': 'मैंने',
    'naheen': 'नहीं',
    'raha': 'रहा',
    'ta': 'ता',
    'tha': 'था',
    'tum': 'तुम',
    'tumne': 'तुमने',
    'unhone': 'उन्होंने',
    'usne': 'उसने',
    'vah': 'वह',
    've': 'वे',
};

export const verbInfos = {
    // 'tr': is transitive
    'be': {'tr': false, 'cont': 'हो', 'past': 'हुआ'},
    'have': null,
    'ask': {'tr': true, 'cont': 'पूछ', 'past': 'पूछा'},
    'bring': {'tr': false, 'cont': 'ला', 'past': 'लाया'},
    'call': {'tr': true, 'cont': 'बुला', 'past': 'बुलाया'},
    'come': {'tr': false, 'cont': 'आ', 'past': 'आया'},
    'do': {'tr': true, 'cont': 'कर', 'past': 'किया'},
    'drink': {'tr': true, 'cont': 'पी', 'past': 'पिया'},
    'eat': {'tr': true, 'cont': 'खा', 'past': 'खाया'},
    'feel': {'tr': true, 'cont': 'लग', 'past': 'लगा'},
    'give': {'tr': true, 'cont': 'दे', 'past': 'दिया'},
    'go': {'tr': false, 'cont': 'जा', 'past': 'गया'},
    'hear': {'tr': true, 'cont': 'सुन', 'past': 'सुना'},
    'jump': {'tr': false, 'cont': 'कूद', 'past': 'कूदा'},
    'keep': {'tr': true, 'cont': 'रख', 'past': 'रखा'},
    'laugh': {'tr': false, 'cont': 'हँस', 'past': 'हँसा'},
    'learn': {'tr': true, 'cont': 'सीख', 'past': 'सीखा'},
    'putOn': {'tr': true, 'cont': 'रख', 'past': 'रखा'},
    'putIn': {'tr': true, 'cont': 'डाल', 'past': 'डाला'},
    'run': {'tr': false, 'cont': 'भाग', 'past': 'भागा'},
    'see': {'tr': true, 'cont': 'देख', 'past': 'देखा'},
    'sing': {'tr': true, 'cont': 'गा', 'past': 'गाया'},
    'sit': {'tr': false, 'cont': 'बैठ', 'past': 'बैठा'},
    'sleep': {'tr': false, 'cont': 'सो', 'past': 'सोया'},
    'take': {'tr': true, 'cont': 'ले', 'past': 'लिया'},
    'talk': null,
    'tell': {'tr': true, 'cont': 'बता', 'past': 'बताया'},
    'walk': {'tr': false, 'cont': 'चल', 'past': 'चला'},
    'write': {'tr': true, 'cont': 'लिख', 'past': 'लिखा'},
};

function wordsToSentence(words) {
    if(words === undefined || words.length === 0) {
        return undefined;
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
    const yaa = HI.chars.ya + HI.matras.aa;
    const iyaa = HI.matras.i + yaa;
    if(object.gender === 'm') {
        if(object.number === 's') {
            return word;
        }
        if(word.endsWith(yaa)) {
            return word.slice(0, -2) + HI.chars.ee;
        }
        else if(word.endsWith(HI.chars.aa)) {
            return word.slice(0, -1) + HI.chars.ee;
        }
        else if(word.endsWith(HI.matras.aa)) {
            return word.slice(0, -1) + HI.matras.ee;
        }
        else {
            throw new Error(`word with unsupported ending: ${word}`);
        }
    }
    else if(object.gender === 'f') {
        let sing = undefined;
        if(word.endsWith(iyaa)) {
            sing = word.slice(0, -iyaa.length) + HI.matras.ii;
        }
        else if(word.endsWith(yaa)) {
            sing = word.slice(0, -yaa.length) + HI.chars.ii;
        }
        else if(word.endsWith(HI.chars.aa)) {
            sing = word.slice(0, -1) + HI.chars.ii;
        }
        else if(word.endsWith(HI.matras.aa)) {
            sing = word.slice(0, -1) + HI.matras.ii;
        }
        else {
            throw new Error(`word with unsupported ending: ${word}`);
        }
        return (object.number === 's' ? sing : sing + HI.diacritics.bindu);
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

function getFutureSuffix(subject, beginWithMatra) {
    const com = beginWithMatra ? HI.matras : HI.chars;
    const gaaOrGii = HI.chars.ga + (subject.gender === 'm' ? HI.matras.aa : HI.matras.ii);
    const geOrGii = HI.chars.ga + (subject.gender === 'm' ? HI.matras.ee : HI.matras.ii);
    if(subject.type === '1' && subject.number === 's') {
        return com.uu + HI.diacritics.cbindu + gaaOrGii;
    }
    else if(subject.type === '1' && subject.number === 'p') {
        return com.ee + HI.diacritics.cbindu + HI.chars.ga + HI.matras.ee;
    }
    else if(subject.number === 's') {
        return subject.type === '2' ? com.oo + geOrGii : com.ee + gaaOrGii;
    }
    else {
        return com.ee + HI.diacritics.cbindu + geOrGii;
    }
}

export function verbConj(subject, object, verb, tense, negate) {
    const response = {'status': 'ok', 'text': undefined, 'msg': undefined};
    if(subject.gender === 'n') {
        subject = {'type': subject.type, 'number': subject.number, 'gender': 'm'};
        // response.status = 'warn';
        // response.msg = "subject.gender changed from n to m.";
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
    const isTr = useTrPr(tense, verbInfo.tr);
    words.push(isTr ? trPr : itrPr);
    if(negate) {
        words.push(enToDev.naheen);
    }
    const subjObj = subjectToObjct(subject);
    if(tense.type === 'simple') {
        if(verb === 'be') {
            beConjSimple(subject, tense.time, words);
        }
        else if(tense.time === 'present') {
            words.push(verbInfo.cont + trnByObject(enToDev.ta, subjObj, false));
            if(!negate) {
                beConjSimple(subject, 'present', words);
            }
        }
        else if(tense.time === 'past') {
            words.push(trnByObject(verbInfo.past, (isTr ? object : subjObj), true));
        }
        else if(tense.time === 'future') {
            const lastChar = verbInfo.cont[verbInfo.cont.length-1];
            if(lastChar === HI.matras.ee) {
                words.push(verbInfo.cont.slice(0, -1) + getFutureSuffix(subject, true));
            }
            else if(HI.getCharCategory(lastChar) === 'c') {
                words.push(verbInfo.cont + getFutureSuffix(subject, true));
            }
            else {
                words.push(verbInfo.cont + getFutureSuffix(subject, false));
            }
        }
    }
    else if(tense.type === 'continuous') {
        words.push(verbInfo.cont);
        words.push(trnByObject(enToDev.raha, subjObj, false));
        if(!negate || tense.time !== 'present') {
            beConjSimple(subject, tense.time, words);
        }
    }
    else if(tense.type === 'perfect') {
        words.push(trnByObject(verbInfo.past, (isTr ? object : subjObj), false));
        beConjSimple((isTr ? object : subject), tense.time, words);
    }
    else {
        response.status = 'unimpl';
        response.msg = `tense type '${tense.type}' is unimplemented.`;
        return response;
    }
    response.text = wordsToSentence(words);
    return response;
}
