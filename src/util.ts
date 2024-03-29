export const isString = (s: any) => typeof s === 'string'


export function findDiffIndex(p: string, c: string) {
    const l1 = p.length
    const l2 = c.length
    const stop_condition = Math.min(l1, l2)
    for (let i = 0; i <= stop_condition; i++) {
        if (p[i] !== c[i]) {
            return i
        }
    }
    return l1 === l2 ? l1 : stop_condition
}



const specialChar = ['上', '中', '下']
export function processComparator(options: {
    comparators: Array<(p: string, c: string) => number>,
    params: [string, string]
}) {
    const { comparators, params } = options
    const [p, c] = params
    for (let i = 0; i < comparators.length; i++) {
        const res = comparators[i](p, c)
        if (res !== 0) {
            return res
        }
    }

    if (specialChar.includes(p) && specialChar.includes(c)) {
        return specialChar.indexOf(p) - specialChar.indexOf(c)
    }

    return p.localeCompare(c)
}


// 提取字符串中的数字，将其与对应下表存储
function transformNumber(str: string) {
    const arr:[string, number][] = []
    str.replace(/\d+/g, (t: string, i: number) => {
        arr.push([t, i])
        return t
    })
    return arr
}

// 处理连续为0并且前面没有数字的字符，转换为0
const handleZeroRE = /(\D)0+(\d?)/g
export function handleStr(p: string, c: string) {
    p = p
        .replace(/^0+/, '') // 处理以0开头的数字
        .replace(handleZeroRE, (_k, p, t) => `${p}${t || 0}`)
    c = c
        .replace(/^0+/, '')
        .replace(handleZeroRE, (_k, p, t) => `${p}${t || 0}`)
    
    const arr1 = transformNumber(p)
    const arr2 = transformNumber(c)
    const len = Math.max(arr1.length, arr2.length)
    const map: Record<string, string> = {}
    for (let i = 0; i < len; i++) {
        if (arr1[i] && arr2[i]) {
            // 比较索引位置，一致的话进行大小比较。
            const isPrev = arr1[i][1] === arr2[i][1] ? parseInt(arr1[i][0]) > parseInt(arr2[i][0]) : arr1[i][1] > arr2[i][1]
            const isSame = arr1[i][1] === arr2[i][1] && parseInt(arr1[i][0]) === parseInt(arr2[i][0])
            // 存储比较结果，1表示后移，0表示不变
            map[arr1[i].join('-')] = isSame ? '0' : isPrev ? '1' : '0'
            map[arr2[i].join('-')] = isSame ? '0' : isPrev ? '0' : '1'
        } else if (arr1[i]) {
            map[arr1[i].join('-')] = '1'
        } else {
            map[arr2[i].join('-')] = '1'
        }
    }
    // 使用两个字符串对应位置数字大小的比较结果替换数字
    const _c = c.replace(/\d+/g, (k, i) => map[k + '-' + i])
    const _p = p.replace(/\d+/g, (k, i) => map[k + '-' + i])
    return [_p, _c]
}