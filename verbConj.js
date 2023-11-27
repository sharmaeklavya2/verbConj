import { verbConj as enVerbConj } from "./enVerbConj.js";
import { verbConj as hiVerbConj } from "./hiVerbConj.js";

export function verbConj(subject, object, verb, tense, lang) {
    if(lang === 'en') {
        return enVerbConj(subject, verb, tense);
    }
    else if(lang === 'hi') {
        return hiVerbConj(subject, object, verb, tense);
    }
    else if(lang === 'kn') {
        throw new Error(`${lang} is not yet implemented.`);
    }
    else {
        throw new Error(`Unsupported language ${lang}`);
    }
}
