import {log} from './utils'
import {arithMask} from './binutils'

export class Operator extends HTMLElement {
    constructor() {
        super()
        /* get the operator */
        const op = this.op = this.getAttribute("op")
        const x = this.x = this.getAttribute("x")
        const y = this.y = this.getAttribute("y")
        const isfloat = this.isfloat = parseInt(this.getAttribute('isfloat'), 2) 

        /* highlights */
        const hix = this.hix = this.getAttribute("hix")
        const hiy = this.hiy = this.getAttribute("hiy")
        const hires = this.hires = this.getAttribute("hires")

        /* apply binary operator */
        let res;
        switch (op) {
            case "|":  {
                res = parseInt(x, 16) | parseInt(y, 16) 
                break  }
            case "^":  {
                res = parseInt(x, 16) ^ parseInt(y, 16) 
                break  }
            case "&":  {
                res = parseInt(x, 16) & parseInt(y, 16) 
                break  }
            case "+":  {
                res = parseInt(x, 16) + parseInt(y, 16) 
                break  }
            case ">>": {
                res = parseInt(x, 16) >> parseInt(y, 16) 
                break  }
            case "<<": {
                res = parseInt(x, 16) << parseInt(y, 16) 
                break  }
            default: res = NaN
        }

        log('res', res, (res >>> 0))
        //if (res.toString().charAt(0) === "-")
        if (res < 0) {
            const mask = arithMask(parseInt(x, 16), parseInt(y, 16))
            this.res = (res | mask) >>> 0
            //res = (~(res*(-1)) >>> 0) + 1
        }
        else 
            this.res = (res >>> 0)

    }

    connectedCallback() {
        this.render()

        const nodes = this.querySelectorAll("bin-ary")
        nodes[1].classList.add("bottom")
        nodes[2].classList.add("result")
    }
    
    render() {
        this.innerHTML =`
        <bin-ary hex="${this.x}" isfloat="${this.isfloat}" hi="${this.hix}" op="${this.op}"></bin-ary>
        <bin-ary hex="${this.y}" isfloat="0" hi="${this.hiy}"></bin-ary>
        <eq-bar></eq-bar>
        <bin-ary hex="0x${this.res.toString(16)}" hi="${this.hires}" isfloat="${this.isfloat}"></bin-ary>
        `
    }
}
