import {hexStringToArray, hiliteArrayFromHex} from './binutils'
import {log} from './utils'

export class Binary extends HTMLElement {
    constructor() {
         super()
         this.COLUMNS = 36
         this.COL_LSB_IDX = 32
         this.FIRST_COLUMN = 1
         this.MANTISSA_IDX = this.COL_LSB_IDX - 22
         this.hex = this.getAttribute("hex")
         this.hi = this.getAttribute("hi")
         this.op = this.getAttribute("op")

         /* check if float */
         this.isfloat = parseInt(this.getAttribute("isfloat"))
    }

    connectedCallback() {
        this.render()
    }

    render() {
         if (this.isfloat) {
             this.renderFloat(this.hex)
         } else {
             this.renderTwosComp(this.hex, this.hi)
         }

         if (this.op) {
             const opshape = document.createElement("op-shape")
             opshape.setAttribute("op", this.op)
             opshape.style = `grid-column: ${this.COL_LSB_IDX+1} / span 2;;` 
             this.append(opshape)
         }
    }

    renderFloat(hex) {
            /* create the bit elements for the first operand */ 
            let fbinarray = hexStringToArray(hex)
            const len = fbinarray.length
            fbinarray = len < 32 ? new Array(32-len).fill(0).concat(fbinarray)
                                 : fbinarray

            /* check for NaN/Inf */
            const mask = 0xFF
            const exp = ((parseInt(hex,16) >>> 23) & mask)

            /* draw NaN/Inf styled binary */
            if ( exp == mask) {
                let col=this.COL_LSB_IDX;
                for (let x of fbinarray.reverse()) {
                    const bit_element = document.createElement('div')
                    bit_element.innerHTML = x
                    bit_element.style = `grid-column: ${col}; grid-row: 1;`
                    if (col >= this.MANTISSA_IDX) {
                        bit_element.classList.add('bit', 'ghost')
                    } else if (col == this.FIRST_COLUMN) { // FIXME magic number
                        bit_element.classList.add('bit', 'ghost')
                    } else {
                        bit_element.classList.add('bit', 'special')
                    }
                    this.append(bit_element)
                    col--;
                }
                return 
            }
             

            /* draw the bits; sign, exp, mantissa determine the style */ 
            let col=this.COL_LSB_IDX;
            for (let x of fbinarray.reverse()) {
                const bit_element = document.createElement('div')
                bit_element.innerHTML = x
                bit_element.style = `grid-column: ${col}; grid-row: 1;`
                if (col >= this.MANTISSA_IDX) {
                    bit_element.classList.add('bit', 'mantissa')
                } else if (col == this.FIRST_COLUMN) { // FIXME magic number
                    bit_element.classList.add('bit', 'sign')
                } else {
                    bit_element.classList.add('bit', 'exp')
                }
                this.append(bit_element)
                col--;
            }
    }

    renderTwosComp(hex, hi=null) {
            const binarray = hexStringToArray(hex) 
            const hibinarray = hi ? hiliteArrayFromHex(hi) : new Array(32).fill(0)   
            const bit_nodes = []                   

            /* keep track of column for adding ghost bits */
            let col=this.COL_LSB_IDX;

            /* create bits explicitly defined in hex */
            for (let i in binarray.reverse()) {
                const bit_element = document.createElement('div')
                bit_element.innerHTML = binarray[i]
                bit_element.style = `grid-column: ${col}; grid-row: 1;`
                bit_element.classList.add('bit')
                bit_nodes.unshift(bit_element)
                col--;
            }

            /* create zero ghost bits*/
            for (let i=col; i>this.FIRST_COLUMN-1; i--) {
                const bit_element = document.createElement('div')
                bit_element.innerHTML = 0
                bit_element.style = `grid-column: ${i}; grid-row: 1;`
                bit_element.classList.add('bit', 'ghost')
                bit_nodes.unshift(bit_element)
            }

            /* last chance to add style */
            for (let node_idx in bit_nodes) {
                if (hibinarray[node_idx])
                    bit_nodes[node_idx].classList.add('highlight')
                this.append(bit_nodes[node_idx])
            }
    }
}
