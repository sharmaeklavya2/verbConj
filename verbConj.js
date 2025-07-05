import { verbConj as enVerbConj } from "./enVerbConj.js";
import { verbConj as hiVerbConj } from "./hiVerbConj.js";
import { verbConj as knVerbConj } from "./knVerbConj.js";
import * as f2f from "funcToForm";

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

//=[ data ]=====================================================================

const langCodeToLangName = {'en': 'English', 'hi': 'Hindi', 'kn': 'Kannada'};
const tenseTimeCodeToTenseTimeName = {'Pr': 'present', 'Past': 'past', 'Fu': 'future'};
const tenseTypeCodeToTenseTypeName = {'s': 'simple', 'c': 'continuous', 'p': 'perfect'};
const pronounCodeToDescr = {
    '1sm': 'I (male/neuter)',
    '1sf': 'I (female)',
    '1pm': 'We',
    '2sm': 'You (singular, male/neuter)',
    '2sf': 'You (singular, female)',
    '2pm': 'You (plural, male/neuter/mixed)',
    '2pf': 'You (plural, female)',
    '3sm': 'He',
    '3sf': 'She',
    '3sn': 'It',
    '3pm': 'They (male/mixed)',
    '3pf': 'They (female)',
    '3pn': 'They (neuter)',
};
const objectCodeToDescr = {
    'sm': 'singular male/neuter',
    'sf': 'singular female',
    'pm': 'plural male/neuter/mixed',
    'pf': 'plural female',
};
const tenseCodeToDescr = {
    'sPr': 'simple present',
    'sPast': 'simple past',
    'sFu': 'simple future',
    'cPr': 'present continuous',
    'cPast': 'past continuous',
    'cFu': 'future continuous',
    'pPr': 'present perfect',
    'pPast': 'past perfect',
    'pFu': 'future perfect',
};
const verbs = [
    'be', 'ask', 'bring', 'call', 'come', 'do', 'drink', 'eat',
    'give', 'go', 'hear', 'keep', 'laugh', 'learn', 'see', 'sleep', 'take',
    'tell', 'walk', 'write',
];
const verbCodeToDescr = {
//  'putOn': 'put (on)',
    'putIn': 'put (in)',
};
for(const verb of verbs) {
    if(verbCodeToDescr[verb] === undefined) {
        verbCodeToDescr[verb] = verb;
    }
}
const knPronouns = ['1sm', '1pm', '2sm', '2pm', '3sm', '3sf', '3pm', '3sn', '3pn'];

//=[ UI ]=======================================================================

function getOptions(codeToDescr) {
    const options = [], keys = [];
    for(const [x, y] of Object.entries(codeToDescr)) {
        options.push(new f2f.SelectOption({name: x, value: [x], text: y}));
        keys.push(x);
    }
    options.push(new f2f.SelectOption({name: 'all', value: keys, text: '(all)'}));
    return options;
}

const pronounOptions = getOptions(pronounCodeToDescr);
pronounOptions.push(new f2f.SelectOption({name: 'kn', value: knPronouns, text: '(kn)'}));
pronounOptions.push(new f2f.SelectOption({name: 'en', value: ['1sm', '2sm', '3sm', '3pm'], text: '(en)'}));
const objectOptions = getOptions(objectCodeToDescr);
const verbOptions = getOptions(verbCodeToDescr);
const tenseOptions = getOptions(tenseCodeToDescr);
const paramS = new f2f.Param('subject', new f2f.SelectWidget(pronounOptions, '1sm'));
const paramO = new f2f.Param('object', new f2f.SelectWidget(objectOptions, 'sm'));
const paramV = new f2f.Param('verb', new f2f.SelectWidget(verbOptions, 'see'));
const paramT = new f2f.Param('tense', new f2f.SelectWidget(tenseOptions, 'sPr'));
const paramN = new f2f.Param('negate', new f2f.CheckBoxWidget());
const paramGroup = new f2f.ParamGroup(undefined, [paramS, paramO, paramV, paramT, paramN]);

function printSentences(input, stdout) {
    const subjects = input.subject;
    const objects = input.object;
    const verbs = input.verb;
    const tenses = input.tense;
    const langs = ['en', 'hi', 'kn'];
    const langNames = langs.map((x) => langCodeToLangName[x]);
    stdout.tableRow(langNames, true);
    for(const subject of subjects) {
        const subjectInfo = {'type': subject[0], 'number': subject[1], 'gender': subject[2]};
        for(const object of objects) {
            const objectInfo = {'number': object[0], 'gender': object[1]};
            for(const verb of verbs) {
                for(const tense of tenses) {
                    const tenseInfo = {
                        'type': tenseTypeCodeToTenseTypeName[tense[0]],
                        'time': tenseTimeCodeToTenseTimeName[tense.slice(1)]
                    };
                    const row = [];
                    for(const lang of langs) {
                        const response = verbConj(subjectInfo, objectInfo, verb, tenseInfo, input.negate, lang);
                        if(response.status === 'ok' || response.status === 'warn') {
                            row.push(response.text);
                        }
                        else {
                            row.push(response.status + ': ' + response.msg);
                        }
                    }
                    stdout.tableRow(row);
                }
            }
        }
    }
}

window.addEventListener('DOMContentLoaded', function() {
    f2f.createForm('myApp', paramGroup, printSentences);
});
