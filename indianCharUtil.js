const devChars = {
    'a': 'अ',
    'aa': 'आ',
    'i': 'इ',
    'ii': 'ई',
    'u': 'उ',
    'uu': 'ऊ',
    'e': 'ऎ',
    'ee': 'ए',
    'ai': 'ऐ',
    'o': 'ऒ',
    'oo': 'ओ',
    'au': 'औ',
    'ya': 'य',
};

const devMatras = {
    'aa': 'ा',
    'i': 'ि',
    'ii': 'ी',
    'u': 'ु',
    'uu': 'ू',
    'e': 'ॆ',
    'ee': 'े',
    'ai': 'ै',
    'o': 'ॊ',
    'oo': 'ो',
    'au': 'ौ',
}

const devDiacritics = {
    'halant': '्',
    'bindu': 'ं',
    'cbindu': 'ँ',
    'visarga': 'ः',
    'nukta': '़',
}

const blockSize = 0x80;
const devStartPoint = 0x0900;

export const defaultCatMap = (
      'dddd-vvvvvvvv-vv'
    + 'v-vvvccccccccccc'
    + 'ccccccccc-cccccc'
    + 'cccc-ccccc--d-mm'
    + 'mmmmm-mmm-mmmt--'
    + '----------------'
    + 'vvmm--nnnnnnnnnn'
    + '----------------');

/*
A character category map is a string of length 128
where the i'th character in the string denotes
the category of the i'th character in the unicode block.

Possible category codes:
v: vowel
c: consonant
m: matra (i.e., the diacritic form of a vowel)
d: diacritic
t: truncation character (aka हलंत, विराम, ತಲಕಟ್ಟ, పొల్లు)
n: numeral
-: invalid or unsupported
*/

export class Script {
    constructor(startPoint, catMap) {
        this.startPoint = startPoint;
        this.catMap = catMap ?? defaultCatMap;
        const offsetFromDev = startPoint - devStartPoint;

        function trnFromDev([name, ch]) {
            return [name, String.fromCodePoint(ch.codePointAt(0) + offsetFromDev)];
        }

        this.chars = Object.fromEntries(Object.entries(devChars).map(trnFromDev));
        this.matras = Object.fromEntries(Object.entries(devMatras).map(trnFromDev));
        this.matras.a = '';
        this.diacritics = Object.fromEntries(Object.entries(devDiacritics).map(trnFromDev));
        this.charToMatra = {};
        this.matraToChar = {};
        for(const [name, ch] of Object.entries(this.chars)) {
            const matra = this.matras[name];
            if(matra !== undefined) {
                this.charToMatra[ch] = matra;
                this.matraToChar[matra] = ch;
            }
        }
    }

    getCharCategory(ch) {
        const codePoint = ch.codePointAt(0);
        const blockOffset = codePoint & (blockSize - 1);
        const blockStartPoint = codePoint & (-blockSize);
        return (blockStartPoint === this.startPoint) ? this.catMap[blockOffset] : '-';
    }
}
