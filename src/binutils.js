
// @REQUIRES isHex(x) == true
export function hexStringToArray(x) {
    return (parseInt(x, 16) >>> 0).toString(2).split('')
}

// @REQUIRES isHex(x) == true
// @REQUIRES 0 <= shift && shift <= 31
// @ENSURES result is 32 bit unsigned 
export function arithMask(x, shift) {
    if (shift == 32) 
      return (console.error("shift of size equal to sizeof datatype is undefined"),
              x)
    return ~(((0x1 << (31 - (shift))) - 1) >>> 0)
}

// @REQUIRES isHex(x) == true
export function hiliteArrayFromHex(x) {
    let bools = hexStringToArray(x).map(d => parseInt(d, 2))
    bools = new Array(32 - bools.length).fill(0).concat(bools)
    return bools
}

