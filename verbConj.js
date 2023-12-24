import { verbConj as enVerbConj } from "./enVerbConj.js";
import { verbConj as hiVerbConj } from "./hiVerbConj.js";
import { verbConj as knVerbConj } from "./knVerbConj.js";

export function verbConj(subject, object, verb, tense, negate, lang) {
    if(lang === 'en') {
        return enVerbConj(subject, verb, tense, negate);
    }
    else if(lang === 'hi') {
        return hiVerbConj(subject, object, verb, tense, negate);
    }
    else if(lang === 'kn') {
        return knVerbConj(subject, verb, tense, negate);
    }
    else {
        throw new Error(`Unsupported language ${lang}`);
    }
}
