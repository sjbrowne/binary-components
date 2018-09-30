import {log} from './utils'
import {arithMask} from './binutils'

export class OperatorSVG extends HTMLElement {
    constructor() {
        super()
        // FIXME hardcoded
        /* set grid */
        this.binary_width = 608
        this.binary_height = 22

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

        // FIXME why doesn't TMIN work?
        if (res < 0 && res > (1<<31)) {
            const mask = arithMask(parseInt(x, 16), parseInt(y, 16))
            res = (res | mask) >>> 0
        }
        else 
            res = (res >>> 0)

        this.res = res
    }

    connectedCallback() {
        this.render()

        const nodes = this.querySelectorAll("bin-ary-svg")
        nodes[1].classList.add("bottom")
        nodes[2].classList.add("result")
    }

    render() {
        this.style.display = 'grid'
        this.style.gridTemplateColumns = `${this.binary_width}px auto`
        this.style.gridTemplateRows = `${this.binary_height}px ${this.binary_height}px 6px ${this.binary_height}px`

        this.innerHTML =`
        <bin-ary-svg style="grid-row: 1; grid-column: 1;" hex="${this.x}" isfloat="${this.isfloat}" hi="${this.hix}"></bin-ary-svg>
        <bin-ary-svg style="grid-row: 2; grid-column: 1;" hex="${this.y}" isfloat="0" hi="${this.hiy}"></bin-ary-svg>
        <op-shape style="grid-row: 1; grid-column: 2;" op="${this.op}"></op-shape>
        <eq-bar style="grid-row:3; grid-column: 1;"></eq-bar>
        <bin-ary-svg style="grid-row:4; grid-column: 1;" hex="0x${this.res.toString(16)}" hi="${this.hires}" isfloat="${this.isfloat}"></bin-ary-svg>
        `
    }
}
