import { verbConj as enVerbConj } from "./enVerbConj.js";

export function verbConj(subject, verb, tense, lang) {
    if(lang === 'en') {
        return enVerbConj(subject, verb, tense);
    }
    else if(lang === 'hi') {
        throw new Error(`${lang} is not yet implemented.`);
    }
    else if(lang === 'kn') {
        throw new Error(`${lang} is not yet implemented.`);
    }
    else {
        throw new Error(`Unsupported language ${lang}`);
    }
}
