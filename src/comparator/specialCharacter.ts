
// handler special character, space has highest weight, others is lowest
const isSpecialCharacter = /[^\u4e00-\u9fa5A-Za-z0-9]/
const isSpace= /\s/
export const specialCharacterComparator = (p: string, c: string) => {
    if (isSpace.test(p)) {
        return -1
    }
    if (isSpace.test(c)) {
        return 1
    }
    if (isSpecialCharacter.test(p) && isSpecialCharacter.test(c)) {
        return p > c ? 1 : -1
    } else if (isSpecialCharacter.test(p)) {
        return 1
    } else if (isSpecialCharacter.test(c)) {
        return -1
    } else {
        return 0
    }
}