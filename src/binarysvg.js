import {hexStringToArray, hiliteArrayFromHex} from './binutils'

export class BinarySVG extends HTMLElement {
    constructor() {
        super()
        this.BITS = 32
        this.BIT_MAX_INDEX = 31
        this.RECT_WIDTH = 17
        this.RECT_HEIGHT = 20
        this.RECT_GUTTER = 2
        this.SVG_NS = "http://www.w3.org/2000/svg"
        this.SVG_HEIGHT = this.RECT_HEIGHT
        this.SVG_WIDTH = (this.BITS*this.RECT_WIDTH) + ((this.BITS - 1)*this.RECT_GUTTER)
        this.container = document.createElementNS(this.SVG_NS, "svg") 
        this.container.setAttribute("width", this.SVG_WIDTH)
        this.container.setAttribute("height", this.SVG_HEIGHT)
    }

    render() {
        if (parseInt(this.getAttribute("isfloat"), 2)) {
            this.renderFloat()
        } else {
            this.renderTwoCompSVG()
        }
    }

    connectedCallback() {
        this.render()
    }

    renderTwoCompSVG() {
        const hex = this.getAttribute("hex")
        const hi = this.getAttribute("hi")
        const binarray = hexStringToArray(hex) 
        const hibinarray = hi ? hiliteArrayFromHex(hi) : new Array(32).fill(0)   

        /* draw up to most significant set bit */
        const offset = this.BIT_MAX_INDEX - binarray.length
        let i,x,y,bit_group, bit_rect, bit_text, ishi
        for (i=this.BIT_MAX_INDEX; i>offset; i--) {
            x = i*(this.RECT_WIDTH+this.RECT_GUTTER)
            y = 0
            bit_group = document.createElementNS(this.SVG_NS, "g")
            bit_group.setAttribute("transform", `translate(${x}, ${y})`)
            bit_group.style = "font-family: input;"

            bit_rect = document.createElementNS(this.SVG_NS, "rect")
            bit_rect.setAttribute("rx", 2)
            bit_rect.setAttribute("ry", 2)

            bit_text = document.createElementNS(this.SVG_NS, "text")
            bit_text.innerHTML = binarray[i-offset-1]

            ishi = hibinarray[i]

            if (ishi) {
                bit_rect.setAttribute("width", this.RECT_WIDTH - 1)
                bit_rect.setAttribute("height", this.RECT_HEIGHT - 1)
                bit_rect.setAttribute("stroke-weight", 1)
                bit_rect.setAttribute("stroke", "#545454")
                bit_rect.setAttribute("fill", "#DAEA4D")
                bit_rect.setAttribute("x", 0.5)
                bit_rect.setAttribute("y", 0.5)

                bit_text.setAttribute("fill", "#545454") 
                bit_text.setAttribute("y", 16) 
                bit_text.setAttribute("x", 4) 

            } else { 
                bit_rect.setAttribute("width", this.RECT_WIDTH)
                bit_rect.setAttribute("height", this.RECT_HEIGHT)
                bit_rect.setAttribute("fill", "#CADCF6")

                bit_text.setAttribute("fill", "#407CD2") 
                bit_text.setAttribute("y", 16) 
                bit_text.setAttribute("x", 4) 
            }

            bit_group.append(bit_rect)
            bit_group.append(bit_text)
            this.container.append(bit_group)
        }

        /* draw ghost zeros */
        if (i >= 0)
        for (; i>=0; i--) {
            x = i*(this.RECT_WIDTH+this.RECT_GUTTER)
            y = 0
            bit_group = document.createElementNS(this.SVG_NS, "g")
            bit_group.setAttribute("transform", `translate(${x}, ${y})`)
            bit_group.style = "font-family: input;"

            bit_rect = document.createElementNS(this.SVG_NS, "rect")
            bit_rect.setAttribute("rx", 2)
            bit_rect.setAttribute("ry", 2)

            bit_text = document.createElementNS(this.SVG_NS, "text")
            bit_text.setAttribute("y", 16) 
            bit_text.setAttribute("x", 4) 
            bit_text.innerHTML = "0"

            ishi = hibinarray[i]

            if (ishi) {
                bit_rect.setAttribute("width", this.RECT_WIDTH - 1)
                bit_rect.setAttribute("height", this.RECT_HEIGHT - 1)
                bit_rect.setAttribute("stroke-weight", 1)
                bit_rect.setAttribute("stroke", "#545454")
                bit_rect.setAttribute("fill", "#DAEA4D")
                bit_rect.setAttribute("x", 0.5)
                bit_rect.setAttribute("y", 0.5)

                bit_text.setAttribute("fill", "#545454") 
                bit_text.setAttribute("y", 16) 
                bit_text.setAttribute("x", 4) 
            } else {
                bit_rect.setAttribute("width", this.RECT_WIDTH)
                bit_rect.setAttribute("height", this.RECT_HEIGHT)
                bit_rect.setAttribute("fill", "#f5f5f5")

                bit_text.setAttribute("fill", "#e8e8ed") 
            }

            bit_group.append(bit_rect)
            bit_group.append(bit_text)
            this.container.append(bit_group)
        }
        
        this.append(this.container)
    }

    renderFloat() {
          /* create the bit elements for the first operand */ 
          const hex = this.getAttribute("hex")
          const hi = this.getAttribute("hi")
          let fbinarray = hexStringToArray(hex)
          const len = fbinarray.length
          fbinarray = len < 32 ? new Array(32-len).fill(0).concat(fbinarray)
                               : fbinarray
          const hibinarray = hi ? hiliteArrayFromHex(hi) : new Array(32).fill(0)   

          /* check for NaN/Inf */
          const mask = 0xFF
          const exp = ((parseInt(hex,16) >>> 23) & mask)
           
          if (exp == mask) {
              let i,x,y,bit_group, bit_rect, bit_text, ishi
              for (i=0; i<32; i++) {
                  x = i*(this.RECT_WIDTH+this.RECT_GUTTER)
                  y = 0
                  ishi = hibinarray[i]

                  bit_group = document.createElementNS(this.SVG_NS, "g")
                  bit_group.setAttribute("transform", `translate(${x}, ${y})`)
                  bit_group.style = "font-family: input;"

                  bit_rect = document.createElementNS(this.SVG_NS, "rect")
                  bit_rect.setAttribute("rx", 2)
                  bit_rect.setAttribute("ry", 2)

                  bit_text = document.createElementNS(this.SVG_NS, "text")
                  bit_text.setAttribute("y", 16) 
                  bit_text.setAttribute("x", 4) 
                  bit_text.innerHTML = fbinarray[i]

                  if (ishi) {
                      bit_rect.setAttribute("width", this.RECT_WIDTH - 1)
                      bit_rect.setAttribute("height", this.RECT_HEIGHT - 1)
                      bit_rect.setAttribute("stroke-weight", 1)
                      bit_rect.setAttribute("stroke", "#545454")
                      bit_rect.setAttribute("fill", "#DAEA4D")
                      bit_rect.setAttribute("x", 0.5)
                      bit_rect.setAttribute("y", 0.5)

                      bit_text.setAttribute("fill", "#545454") 
                  } else if (i == 0 || i > 8) {
                      bit_rect.setAttribute("width", this.RECT_WIDTH)
                      bit_rect.setAttribute("height", this.RECT_HEIGHT)
                      bit_rect.setAttribute("fill","#f5f5f5") 
                      bit_text.setAttribute("fill", "#e8e8ed")
                  } else {
                      bit_rect.setAttribute("width", this.RECT_WIDTH-1)
                      bit_rect.setAttribute("height", this.RECT_HEIGHT-1)
                      bit_rect.setAttribute("stroke-width", 1)
                      bit_rect.setAttribute("x", 0.5)
                      bit_rect.setAttribute("y", 0.5)
                      bit_rect.setAttribute("stroke","#DF3232") 
                      bit_rect.setAttribute("fill","#fff") 
                      bit_text.setAttribute("fill", "#b36363")
                  }

                  bit_group.append(bit_rect)
                  bit_group.append(bit_text)
                  this.container.append(bit_group)
              }
          } else {
              let i,x,y,bit_group, bit_rect, bit_text, ishi 
              for (i=0; i<32; i++) {
                  x = i*(this.RECT_WIDTH+this.RECT_GUTTER)
                  y = 0
                  ishi = hibinarray[i]
                  bit_group = document.createElementNS(this.SVG_NS, "g")
                  bit_group.setAttribute("transform", `translate(${x}, ${y})`)
                  bit_group.style = "font-family: input;"

                  bit_rect = document.createElementNS(this.SVG_NS, "rect")
                  bit_rect.setAttribute("width", this.RECT_WIDTH)
                  bit_rect.setAttribute("height", this.RECT_HEIGHT)
                  bit_rect.setAttribute("stroke-width", 1)
                  bit_rect.setAttribute("rx", 2)
                  bit_rect.setAttribute("ry", 2)

                  bit_text = document.createElementNS(this.SVG_NS, "text")
                  bit_text.setAttribute("y", 16) 
                  bit_text.setAttribute("x", 4) 
                  bit_text.innerHTML = fbinarray[i]

                  if (ishi) {
                      bit_rect.setAttribute("width", this.RECT_WIDTH - 1)
                      bit_rect.setAttribute("height", this.RECT_HEIGHT - 1)
                      bit_rect.setAttribute("stroke-weight", 1)
                      bit_rect.setAttribute("stroke", "#545454")
                      bit_rect.setAttribute("fill", "#DAEA4D")
                      bit_rect.setAttribute("x", 0.5)
                      bit_rect.setAttribute("y", 0.5)

                      bit_text.setAttribute("fill", "#545454") 
                  } else if (i == 0) {
                      bit_rect.setAttribute("x", 0.5)
                      bit_rect.setAttribute("width", this.RECT_WIDTH-1)
                      bit_rect.setAttribute("stroke","#888") 
                      bit_rect.setAttribute("fill", "#fff")
                      bit_text.setAttribute("fill","#888") 
                  } else if ( i > 0 && i < 9 ) { 
                      bit_rect.setAttribute("fill","#C0DC93") 
                      bit_text.setAttribute("fill", "#84A739")
                  } else {
                      bit_rect.setAttribute("fill","#DE74AE") 
                      bit_text.setAttribute("fill", "#B1397B")
                  }

                  bit_group.append(bit_rect)
                  bit_group.append(bit_text)
                  this.container.append(bit_group)
              }
          }

        this.append(this.container)
    }
}


