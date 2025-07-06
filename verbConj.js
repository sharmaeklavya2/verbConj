import { verbConj as enVerbConj } from "./enVerbConj.js";
import { verbConj as hiVerbConj } from "./hiVerbConj.js";
import { verbConj as knVerbConj } from "./knVerbConj.js";
import { verbConj as teVerbConj } from "./teVerbConj.js";
import * as f2f from "funcToForm";

function verbConj(subject, object, verb, tense, negate, lang) {
    if(lang === 'en') {
        return enVerbConj(subject, verb, tense, negate);
    }
    else if(lang === 'hi') {
        return hiVerbConj(subject, object, verb, tense, negate);
    }
    else if(lang === 'kn') {
        return knVerbConj(subject, verb, tense, negate);
    }
    else if(lang === 'te') {
        return teVerbConj(subject, verb, tense, negate);
    }
    else {
        throw new Error(`Unsupported language ${lang}`);
    }
}

//=[ data ]=====================================================================

const langCodeToLangName = {
    'en': 'English', 'hi': 'Hindi',
    'kn': 'Kannada', 'te': 'Telugu',
};
const tenseTimeCodeToTenseTimeName = {
    'Pr': 'present', 'Past': 'past', 'Fu': 'future'};
const tenseTypeCodeToTenseTypeName = {
    's': 'simple', 'c': 'continuous', 'p': 'perfect'};
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
    'give', 'go', 'hear', 'jump', 'keep', 'laugh', 'learn', 'run',
    'see', 'sing', 'sit', 'sleep', 'take', 'talk', 'tell', 'walk', 'write',
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

//=[ form creation ]============================================================

function getOptions(codeToDescr) {
    const options = [], keys = [];
    for(const [x, y] of Object.entries(codeToDescr)) {
        options.push(new f2f.SelectOption({name: x, value: [x], text: y}));
        keys.push(x);
    }
    options.push(new f2f.SelectOption({name: 'all', value: keys, text: '(all)'}));
    return options;
}

function randomShuffle(a) {
    let n = a.length;
    while(n > 1) {
        const i = Math.floor(Math.random() * n);
        --n;
        const x = a[i];
        a[i] = a[n];
        a[n] = x;
    }
}

export function getParamGroup() {
    const pronounOptions = getOptions(pronounCodeToDescr);
    pronounOptions.push(new f2f.SelectOption({name: 'kn', value: knPronouns, text: '(kn)'}));
    pronounOptions.push(new f2f.SelectOption({name: 'en', value: ['1sm', '2sm', '3sm', '3pm'], text: '(en)'}));
    const subjectParam = new f2f.Param('subject', new f2f.SelectWidget(pronounOptions, '1sm'));

    const objectOptions = getOptions(objectCodeToDescr);
    const objectParam = new f2f.Param('object', new f2f.SelectWidget(objectOptions, 'sm'));

    const verbOptions = getOptions(verbCodeToDescr);
    const verbParam = new f2f.Param('verb', new f2f.SelectWidget(verbOptions, 'see'));

    const tenseOptions = getOptions(tenseCodeToDescr);
    const tenseParam = new f2f.Param('tense', new f2f.SelectWidget(tenseOptions, 'sPr'));

    const negateParam = new f2f.Param('negate', new f2f.CheckBoxWidget());
    const shuffleParam = new f2f.Param('shuffle', new f2f.CheckBoxWidget(), {'label': 'shuffle randomly'});

    const langParams = [];
    for(const [langCode, langName] of Object.entries(langCodeToLangName)) {
        langParams.push(new f2f.Param(langCode, new f2f.CheckBoxWidget({defVal: true}), {label: langName}));
    }
    const langsParamGroup = new f2f.ParamGroup('langs', langParams, {label: 'languages', compact: true});

    const paramGroup = new f2f.ParamGroup(undefined, [subjectParam, objectParam, verbParam,
        tenseParam, negateParam, langsParamGroup, shuffleParam]);
    return paramGroup;
}

//=[ displaying results ]=======================================================

function cartProd(arrList) {
    const output = [];
    function helper(prefix) {
        if(prefix.length === arrList.length) {
            output.push(prefix.slice());
        }
        else {
            const a = arrList[prefix.length];
            for(const x of a) {
                prefix.push(x);
                helper(prefix);
                prefix.pop(x);
            }
        }
    }
    helper([]);
    return output;
}

export function printTable(input, stdout) {
    const langCodes = [], langNames = [];
    for(const [langCode, selected] of Object.entries(input.langs)) {
        if(selected) {
            langCodes.push(langCode);
            langNames.push(langCodeToLangName[langCode]);
        }
    }
    stdout.tableRow(langNames, true);

    const inputRows = cartProd([input.subject, input.object, input.verb, input.tense]);
    if(input.shuffle) {
        randomShuffle(inputRows);
    }
    for(const [subject, object, verb, tense] of inputRows) {
        const subjectInfo = {'type': subject[0], 'number': subject[1], 'gender': subject[2]};
        const objectInfo = {'number': object[0], 'gender': object[1]};
        const tenseInfo = {
            'type': tenseTypeCodeToTenseTypeName[tense[0]],
            'time': tenseTimeCodeToTenseTimeName[tense.slice(1)]
        };
        const outputRow = [];
        for(const lang of langCodes) {
            const response = verbConj(subjectInfo, objectInfo, verb, tenseInfo, input.negate, lang);
            outputRow.push(response);
        }
        printRow(stdout, outputRow);
    }
}

const statusToCssClass = {
    'warn': 'warning',
    'unsupp': 'warning',
    'error': 'danger',
    'unimpl': 'danger',
}

function printRow(stdout, row) {
    // print a table row from array of response objects
    const tr = document.createElement('tr');
    for(const response of row) {
        const td = document.createElement('td');
        td.innerText = response.text || response.status;
        if(response.status !== 'ok') {
            const statusClass = statusToCssClass[response.status] ?? 'danger';
            td.classList.add(statusClass);
        }
        if(response.msg) {
            td.dataset.msg = response.status + ': ' + response.msg;
        }
        tr.appendChild(td);
    }
    stdout.tableRow(tr);
}
