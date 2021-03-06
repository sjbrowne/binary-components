function log(){console.log.apply(null, arguments);}

// @REQUIRES isHex(x) == true
function hexStringToArray(x) {
    return (parseInt(x, 16) >>> 0).toString(2).split('')
}

// @REQUIRES isHex(x) == true
// @REQUIRES 0 <= shift && shift <= 31
// @ENSURES result is 32 bit unsigned 
function arithMask(x, shift) {
    if (shift == 32) 
      return (console.error("shift of size equal to sizeof datatype is undefined"),
              x)
    return ~(((0x1 << (31 - (shift))) - 1) >>> 0)
}

// @REQUIRES isHex(x) == true
function hiliteArrayFromHex(x) {
    let bools = hexStringToArray(x).map(d => parseInt(d, 2));
    bools = new Array(32 - bools.length).fill(0).concat(bools);
    return bools
}

class Operator extends HTMLElement {
    constructor() {
        super();
        /* get the operator */
        const op = this.op = this.getAttribute("op");
        const x = this.x = this.getAttribute("x");
        const y = this.y = this.getAttribute("y");
        const isfloat = this.isfloat = parseInt(this.getAttribute('isfloat'), 2); 

        /* highlights */
        const hix = this.hix = this.getAttribute("hix");
        const hiy = this.hiy = this.getAttribute("hiy");
        const hires = this.hires = this.getAttribute("hires");

        /* apply binary operator */
        let res;
        switch (op) {
            case "|":  {
                res = parseInt(x, 16) | parseInt(y, 16); 
                break  }
            case "^":  {
                res = parseInt(x, 16) ^ parseInt(y, 16); 
                break  }
            case "&":  {
                res = parseInt(x, 16) & parseInt(y, 16); 
                break  }
            case "+":  {
                res = parseInt(x, 16) + parseInt(y, 16); 
                break  }
            case ">>": {
                res = parseInt(x, 16) >> parseInt(y, 16); 
                break  }
            case "<<": {
                res = parseInt(x, 16) << parseInt(y, 16); 
                break  }
            default: res = NaN;
        }

        log('res', res, (res >>> 0));
        //if (res.toString().charAt(0) === "-")
        if (res < 0) {
            const mask = arithMask(parseInt(x, 16), parseInt(y, 16));
            this.res = (res | mask) >>> 0;
            //res = (~(res*(-1)) >>> 0) + 1
        }
        else 
            this.res = (res >>> 0);

    }

    connectedCallback() {
        this.render();

        const nodes = this.querySelectorAll("bin-ary");
        nodes[1].classList.add("bottom");
        nodes[2].classList.add("result");
    }
    
    render() {
        this.innerHTML =`
        <bin-ary hex="${this.x}" isfloat="${this.isfloat}" hi="${this.hix}" op="${this.op}"></bin-ary>
        <bin-ary hex="${this.y}" isfloat="0" hi="${this.hiy}"></bin-ary>
        <eq-bar></eq-bar>
        <bin-ary hex="0x${this.res.toString(16)}" hi="${this.hires}" isfloat="${this.isfloat}"></bin-ary>
        `;
    }
}

class OperatorSVG extends HTMLElement {
    constructor() {
        super();
        // FIXME hardcoded
        /* set grid */
        this.binary_width = 608;
        this.binary_height = 22;

        /* get the operator */
        const op = this.op = this.getAttribute("op");
        const x = this.x = this.getAttribute("x");
        const y = this.y = this.getAttribute("y");
        const isfloat = this.isfloat = parseInt(this.getAttribute('isfloat'), 2); 

        /* highlights */
        const hix = this.hix = this.getAttribute("hix");
        const hiy = this.hiy = this.getAttribute("hiy");
        const hires = this.hires = this.getAttribute("hires");

        /* apply binary operator */
        let res;
        switch (op) {
            case "|":  {
                res = parseInt(x, 16) | parseInt(y, 16); 
                break  }
            case "^":  {
                res = parseInt(x, 16) ^ parseInt(y, 16); 
                break  }
            case "&":  {
                res = parseInt(x, 16) & parseInt(y, 16); 
                break  }
            case "+":  {
                res = parseInt(x, 16) + parseInt(y, 16); 
                break  }
            case ">>": {
                res = parseInt(x, 16) >> parseInt(y, 16); 
                break  }
            case "<<": {
                res = parseInt(x, 16) << parseInt(y, 16); 
                break  }
            default: res = NaN;
        }

        // FIXME why doesn't TMIN work?
        if (res < 0 && res > (1<<31)) {
            const mask = arithMask(parseInt(x, 16), parseInt(y, 16));
            res = (res | mask) >>> 0;
        }
        else 
            res = (res >>> 0);

        this.res = res;
    }

    connectedCallback() {
        this.render();

        const nodes = this.querySelectorAll("bin-ary-svg");
        nodes[1].classList.add("bottom");
        nodes[2].classList.add("result");
    }

    render() {
        this.style.display = 'grid';
        this.style.gridTemplateColumns = `${this.binary_width}px auto`;
        this.style.gridTemplateRows = `${this.binary_height}px ${this.binary_height}px 6px ${this.binary_height}px`;

        this.innerHTML =`
        <bin-ary-svg style="grid-row: 1; grid-column: 1;" hex="${this.x}" isfloat="${this.isfloat}" hi="${this.hix}"></bin-ary-svg>
        <bin-ary-svg style="grid-row: 2; grid-column: 1;" hex="${this.y}" isfloat="0" hi="${this.hiy}"></bin-ary-svg>
        <op-shape style="grid-row: 1; grid-column: 2;" op="${this.op}"></op-shape>
        <eq-bar style="grid-row:3; grid-column: 1;"></eq-bar>
        <bin-ary-svg style="grid-row:4; grid-column: 1;" hex="0x${this.res.toString(16)}" hi="${this.hires}" isfloat="${this.isfloat}"></bin-ary-svg>
        `;
    }
}

class Binary extends HTMLElement {
    constructor() {
         super();
         this.COLUMNS = 36;
         this.COL_LSB_IDX = 32;
         this.FIRST_COLUMN = 1;
         this.MANTISSA_IDX = this.COL_LSB_IDX - 22;
         this.hex = this.getAttribute("hex");
         this.hi = this.getAttribute("hi");
         this.op = this.getAttribute("op");

         /* check if float */
         this.isfloat = parseInt(this.getAttribute("isfloat"));
    }

    connectedCallback() {
        this.render();
    }

    render() {
         if (this.isfloat) {
             this.renderFloat(this.hex);
         } else {
             this.renderTwosComp(this.hex, this.hi);
         }

         if (this.op) {
             const opshape = document.createElement("op-shape");
             opshape.setAttribute("op", this.op);
             opshape.style = `grid-column: ${this.COL_LSB_IDX+1} / span 2;;`; 
             this.append(opshape);
         }
    }

    renderFloat(hex) {
            /* create the bit elements for the first operand */ 
            let fbinarray = hexStringToArray(hex);
            const len = fbinarray.length;
            fbinarray = len < 32 ? new Array(32-len).fill(0).concat(fbinarray)
                                 : fbinarray;

            /* check for NaN/Inf */
            const mask = 0xFF;
            const exp = ((parseInt(hex,16) >>> 23) & mask);

            /* draw NaN/Inf styled binary */
            if ( exp == mask) {
                let col=this.COL_LSB_IDX;
                for (let x of fbinarray.reverse()) {
                    const bit_element = document.createElement('div');
                    bit_element.innerHTML = x;
                    bit_element.style = `grid-column: ${col}; grid-row: 1;`;
                    if (col >= this.MANTISSA_IDX) {
                        bit_element.classList.add('bit', 'ghost');
                    } else if (col == this.FIRST_COLUMN) { // FIXME magic number
                        bit_element.classList.add('bit', 'ghost');
                    } else {
                        bit_element.classList.add('bit', 'special');
                    }
                    this.append(bit_element);
                    col--;
                }
                return 
            }
             

            /* draw the bits; sign, exp, mantissa determine the style */ 
            let col=this.COL_LSB_IDX;
            for (let x of fbinarray.reverse()) {
                const bit_element = document.createElement('div');
                bit_element.innerHTML = x;
                bit_element.style = `grid-column: ${col}; grid-row: 1;`;
                if (col >= this.MANTISSA_IDX) {
                    bit_element.classList.add('bit', 'mantissa');
                } else if (col == this.FIRST_COLUMN) { // FIXME magic number
                    bit_element.classList.add('bit', 'sign');
                } else {
                    bit_element.classList.add('bit', 'exp');
                }
                this.append(bit_element);
                col--;
            }
    }

    renderTwosComp(hex, hi=null) {
            const binarray = hexStringToArray(hex); 
            const hibinarray = hi ? hiliteArrayFromHex(hi) : new Array(32).fill(0);   
            const bit_nodes = [];                   

            /* keep track of column for adding ghost bits */
            let col=this.COL_LSB_IDX;

            /* create bits explicitly defined in hex */
            for (let i in binarray.reverse()) {
                const bit_element = document.createElement('div');
                bit_element.innerHTML = binarray[i];
                bit_element.style = `grid-column: ${col}; grid-row: 1;`;
                bit_element.classList.add('bit');
                bit_nodes.unshift(bit_element);
                col--;
            }

            /* create zero ghost bits*/
            for (let i=col; i>this.FIRST_COLUMN-1; i--) {
                const bit_element = document.createElement('div');
                bit_element.innerHTML = 0;
                bit_element.style = `grid-column: ${i}; grid-row: 1;`;
                bit_element.classList.add('bit', 'ghost');
                bit_nodes.unshift(bit_element);
            }

            /* last chance to add style */
            for (let node_idx in bit_nodes) {
                if (hibinarray[node_idx])
                    bit_nodes[node_idx].classList.add('highlight');
                this.append(bit_nodes[node_idx]);
            }
    }
}

class BinarySVG extends HTMLElement {
    constructor() {
        super();
        this.BITS = 32;
        this.BIT_MAX_INDEX = 31;
        this.RECT_WIDTH = 17;
        this.RECT_HEIGHT = 20;
        this.RECT_GUTTER = 2;
        this.SVG_NS = "http://www.w3.org/2000/svg";
        this.SVG_HEIGHT = this.RECT_HEIGHT;
        this.SVG_WIDTH = (this.BITS*this.RECT_WIDTH) + ((this.BITS - 1)*this.RECT_GUTTER);
        this.container = document.createElementNS(this.SVG_NS, "svg"); 
        this.container.setAttribute("width", this.SVG_WIDTH);
        this.container.setAttribute("height", this.SVG_HEIGHT);
    }

    render() {
        if (parseInt(this.getAttribute("isfloat"), 2)) {
            this.renderFloat();
        } else {
            this.renderTwoCompSVG();
        }
    }

    connectedCallback() {
        this.render();
    }

    renderTwoCompSVG() {
        const hex = this.getAttribute("hex");
        const hi = this.getAttribute("hi");
        const binarray = hexStringToArray(hex); 
        const hibinarray = hi ? hiliteArrayFromHex(hi) : new Array(32).fill(0);   

        /* draw up to most significant set bit */
        const offset = this.BIT_MAX_INDEX - binarray.length;
        let i,x,y,bit_group, bit_rect, bit_text, ishi;
        for (i=this.BIT_MAX_INDEX; i>offset; i--) {
            x = i*(this.RECT_WIDTH+this.RECT_GUTTER);
            y = 0;
            bit_group = document.createElementNS(this.SVG_NS, "g");
            bit_group.setAttribute("transform", `translate(${x}, ${y})`);
            bit_group.style = "font-family: input;";

            bit_rect = document.createElementNS(this.SVG_NS, "rect");
            bit_rect.setAttribute("rx", 2);
            bit_rect.setAttribute("ry", 2);

            bit_text = document.createElementNS(this.SVG_NS, "text");
            bit_text.innerHTML = binarray[i-offset-1];

            ishi = hibinarray[i];

            if (ishi) {
                bit_rect.setAttribute("width", this.RECT_WIDTH - 1);
                bit_rect.setAttribute("height", this.RECT_HEIGHT - 1);
                bit_rect.setAttribute("stroke-weight", 1);
                bit_rect.setAttribute("stroke", "#545454");
                bit_rect.setAttribute("fill", "#DAEA4D");
                bit_rect.setAttribute("x", 0.5);
                bit_rect.setAttribute("y", 0.5);

                bit_text.setAttribute("fill", "#545454"); 
                bit_text.setAttribute("y", 16); 
                bit_text.setAttribute("x", 4); 

            } else { 
                bit_rect.setAttribute("width", this.RECT_WIDTH);
                bit_rect.setAttribute("height", this.RECT_HEIGHT);
                bit_rect.setAttribute("fill", "#CADCF6");

                bit_text.setAttribute("fill", "#407CD2"); 
                bit_text.setAttribute("y", 16); 
                bit_text.setAttribute("x", 4); 
            }

            bit_group.append(bit_rect);
            bit_group.append(bit_text);
            this.container.append(bit_group);
        }

        /* draw ghost zeros */
        if (i >= 0)
        for (; i>=0; i--) {
            x = i*(this.RECT_WIDTH+this.RECT_GUTTER);
            y = 0;
            bit_group = document.createElementNS(this.SVG_NS, "g");
            bit_group.setAttribute("transform", `translate(${x}, ${y})`);
            bit_group.style = "font-family: input;";

            bit_rect = document.createElementNS(this.SVG_NS, "rect");
            bit_rect.setAttribute("rx", 2);
            bit_rect.setAttribute("ry", 2);

            bit_text = document.createElementNS(this.SVG_NS, "text");
            bit_text.setAttribute("y", 16); 
            bit_text.setAttribute("x", 4); 
            bit_text.innerHTML = "0";

            ishi = hibinarray[i];

            if (ishi) {
                bit_rect.setAttribute("width", this.RECT_WIDTH - 1);
                bit_rect.setAttribute("height", this.RECT_HEIGHT - 1);
                bit_rect.setAttribute("stroke-weight", 1);
                bit_rect.setAttribute("stroke", "#545454");
                bit_rect.setAttribute("fill", "#DAEA4D");
                bit_rect.setAttribute("x", 0.5);
                bit_rect.setAttribute("y", 0.5);

                bit_text.setAttribute("fill", "#545454"); 
                bit_text.setAttribute("y", 16); 
                bit_text.setAttribute("x", 4); 
            } else {
                bit_rect.setAttribute("width", this.RECT_WIDTH);
                bit_rect.setAttribute("height", this.RECT_HEIGHT);
                bit_rect.setAttribute("fill", "#f5f5f5");

                bit_text.setAttribute("fill", "#e8e8ed"); 
            }

            bit_group.append(bit_rect);
            bit_group.append(bit_text);
            this.container.append(bit_group);
        }
        
        this.append(this.container);
    }

    renderFloat() {
          /* create the bit elements for the first operand */ 
          const hex = this.getAttribute("hex");
          const hi = this.getAttribute("hi");
          let fbinarray = hexStringToArray(hex);
          const len = fbinarray.length;
          fbinarray = len < 32 ? new Array(32-len).fill(0).concat(fbinarray)
                               : fbinarray;
          const hibinarray = hi ? hiliteArrayFromHex(hi) : new Array(32).fill(0);   

          /* check for NaN/Inf */
          const mask = 0xFF;
          const exp = ((parseInt(hex,16) >>> 23) & mask);
           
          if (exp == mask) {
              let i,x,y,bit_group, bit_rect, bit_text, ishi;
              for (i=0; i<32; i++) {
                  x = i*(this.RECT_WIDTH+this.RECT_GUTTER);
                  y = 0;
                  ishi = hibinarray[i];

                  bit_group = document.createElementNS(this.SVG_NS, "g");
                  bit_group.setAttribute("transform", `translate(${x}, ${y})`);
                  bit_group.style = "font-family: input;";

                  bit_rect = document.createElementNS(this.SVG_NS, "rect");
                  bit_rect.setAttribute("rx", 2);
                  bit_rect.setAttribute("ry", 2);

                  bit_text = document.createElementNS(this.SVG_NS, "text");
                  bit_text.setAttribute("y", 16); 
                  bit_text.setAttribute("x", 4); 
                  bit_text.innerHTML = fbinarray[i];

                  if (ishi) {
                      bit_rect.setAttribute("width", this.RECT_WIDTH - 1);
                      bit_rect.setAttribute("height", this.RECT_HEIGHT - 1);
                      bit_rect.setAttribute("stroke-weight", 1);
                      bit_rect.setAttribute("stroke", "#545454");
                      bit_rect.setAttribute("fill", "#DAEA4D");
                      bit_rect.setAttribute("x", 0.5);
                      bit_rect.setAttribute("y", 0.5);

                      bit_text.setAttribute("fill", "#545454"); 
                  } else if (i == 0 || i > 8) {
                      bit_rect.setAttribute("width", this.RECT_WIDTH);
                      bit_rect.setAttribute("height", this.RECT_HEIGHT);
                      bit_rect.setAttribute("fill","#f5f5f5"); 
                      bit_text.setAttribute("fill", "#e8e8ed");
                  } else {
                      bit_rect.setAttribute("width", this.RECT_WIDTH-1);
                      bit_rect.setAttribute("height", this.RECT_HEIGHT-1);
                      bit_rect.setAttribute("stroke-width", 1);
                      bit_rect.setAttribute("x", 0.5);
                      bit_rect.setAttribute("y", 0.5);
                      bit_rect.setAttribute("stroke","#DF3232"); 
                      bit_rect.setAttribute("fill","#fff"); 
                      bit_text.setAttribute("fill", "#b36363");
                  }

                  bit_group.append(bit_rect);
                  bit_group.append(bit_text);
                  this.container.append(bit_group);
              }
          } else {
              let i,x,y,bit_group, bit_rect, bit_text, ishi; 
              for (i=0; i<32; i++) {
                  x = i*(this.RECT_WIDTH+this.RECT_GUTTER);
                  y = 0;
                  ishi = hibinarray[i];
                  bit_group = document.createElementNS(this.SVG_NS, "g");
                  bit_group.setAttribute("transform", `translate(${x}, ${y})`);
                  bit_group.style = "font-family: input;";

                  bit_rect = document.createElementNS(this.SVG_NS, "rect");
                  bit_rect.setAttribute("width", this.RECT_WIDTH);
                  bit_rect.setAttribute("height", this.RECT_HEIGHT);
                  bit_rect.setAttribute("stroke-width", 1);
                  bit_rect.setAttribute("rx", 2);
                  bit_rect.setAttribute("ry", 2);

                  bit_text = document.createElementNS(this.SVG_NS, "text");
                  bit_text.setAttribute("y", 16); 
                  bit_text.setAttribute("x", 4); 
                  bit_text.innerHTML = fbinarray[i];

                  if (ishi) {
                      bit_rect.setAttribute("width", this.RECT_WIDTH - 1);
                      bit_rect.setAttribute("height", this.RECT_HEIGHT - 1);
                      bit_rect.setAttribute("stroke-weight", 1);
                      bit_rect.setAttribute("stroke", "#545454");
                      bit_rect.setAttribute("fill", "#DAEA4D");
                      bit_rect.setAttribute("x", 0.5);
                      bit_rect.setAttribute("y", 0.5);

                      bit_text.setAttribute("fill", "#545454"); 
                  } else if (i == 0) {
                      bit_rect.setAttribute("x", 0.5);
                      bit_rect.setAttribute("width", this.RECT_WIDTH-1);
                      bit_rect.setAttribute("stroke","#888"); 
                      bit_rect.setAttribute("fill", "#fff");
                      bit_text.setAttribute("fill","#888"); 
                  } else if ( i > 0 && i < 9 ) { 
                      bit_rect.setAttribute("fill","#C0DC93"); 
                      bit_text.setAttribute("fill", "#84A739");
                  } else {
                      bit_rect.setAttribute("fill","#DE74AE"); 
                      bit_text.setAttribute("fill", "#B1397B");
                  }

                  bit_group.append(bit_rect);
                  bit_group.append(bit_text);
                  this.container.append(bit_group);
              }
          }

        this.append(this.container);
    }
}

// FIXME magic numbers
class EqualsBar extends HTMLElement {
    constructor() {
         super();
         
        /* create the equals bar */
        const style = `grid-column: 1 / 33;`;
        this.innerHTML = `<div style="${style}" class="bar"></div>`;
    }
}

const plus = `
<svg width="44px" height="41px" viewBox="0 0 44 41" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs></defs>
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-756.000000, -566.000000)">
            <g transform="translate(756.000000, 566.000000)">
                <rect fill="#DAD3D3" x="0" y="0" width="44" height="41"></rect>
                <polygon fill="#9A877E" points="19.9393939 29 19.9393939 21.5443038 14 21.5443038 14 17.4556962 19.9393939 17.4556962 19.9393939 10 24.0606061 10 24.0606061 17.4556962 30 17.4556962 30 21.5443038 24.0606061 21.5443038 24.0606061 29"></polygon>
            </g>
        </g>
    </g>
</svg>
`;

const leftshift = `
<svg width="44px" height="41px" viewBox="0 0 44 41" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-648.000000, -567.000000)">
            <g transform="translate(648.000000, 567.000000)">
                <rect fill="#DAD3D3" transform="translate(22.000000, 20.500000) scale(-1, 1) translate(-22.000000, -20.500000) " x="0" y="0" width="44" height="41"></rect>
                <path d="M8.38095238,16.6480423 L8.38095238,12.9473684 L20.4028819,17.9824861 L20.4028819,21.1053596 L8.38095238,26.1542345 L8.38095238,22.4398034 L16.0349141,19.7984302 L16.8497338,19.5232871 L16.0482718,19.2481441 L8.38095238,16.6480423 Z M22.9634314,16.6480423 L22.9634314,12.9473684 L34.9853608,17.9824861 L34.9853608,21.1053596 L22.9634314,26.1542345 L22.9634314,22.4398034 L30.6173931,19.7984302 L31.4322128,19.5232871 L30.6307508,19.2481441 L22.9634314,16.6480423 Z" id="&gt;&gt;" fill="#9A877E" transform="translate(21.683157, 19.550801) scale(-1, 1) translate(-21.683157, -19.550801) "></path>
            </g>
        </g>
    </g>
</svg>
`;

const rightshift = `
<svg width="44px" height="41px" viewBox="0 0 44 41" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-699.000000, -566.000000)">
            <g transform="translate(699.000000, 566.000000)">
                <rect fill="#DAD3D3" x="0" y="0" width="44" height="41"></rect>
                <path d="M8.38095238,16.6480423 L8.38095238,12.9473684 L20.4028819,17.9824861 L20.4028819,21.1053596 L8.38095238,26.1542345 L8.38095238,22.4398034 L16.0349141,19.7984302 L16.8497338,19.5232871 L16.0482718,19.2481441 L8.38095238,16.6480423 Z M22.9634314,16.6480423 L22.9634314,12.9473684 L34.9853608,17.9824861 L34.9853608,21.1053596 L22.9634314,26.1542345 L22.9634314,22.4398034 L30.6173931,19.7984302 L31.4322128,19.5232871 L30.6307508,19.2481441 L22.9634314,16.6480423 Z" id="&gt;&gt;" fill="#9A877E"></path>
            </g>
        </g>
    </g>
</svg>
`;

const not = `
<svg width="44px" height="41px" viewBox="0 0 44 41" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-482.000000, -568.000000)">
            <g transform="translate(482.000000, 568.000000)">
                <rect fill="#DAD3D3" x="0" y="0" width="44" height="41"></rect>
                <path d="M22.9964658,22.6009971 L19.3727679,22.6009971 L19.1436012,8.63157895 L23.2256324,8.63157895 L22.9964658,22.6009971 Z M18.8571429,28.1032072 C18.8571429,27.7786785 18.9096597,27.4787397 19.0146949,27.203382 C19.1197302,26.9280243 19.2725064,26.6870898 19.4730283,26.4805715 C19.6735501,26.2740532 19.9170373,26.1142498 20.203497,26.0011565 C20.4899568,25.8880631 20.8146063,25.8315173 21.1774554,25.8315173 C21.5307557,25.8315173 21.850631,25.8880631 22.1370908,26.0011565 C22.4235505,26.1142498 22.6670377,26.2740532 22.8675595,26.4805715 C23.0680814,26.6870898 23.2232447,26.9280243 23.3330543,27.203382 C23.4428639,27.4787397 23.4977679,27.7786785 23.4977679,28.1032072 C23.4977679,28.4179018 23.4428639,28.7129235 23.3330543,28.9882813 C23.2232447,29.263639 23.0680814,29.4996564 22.8675595,29.6963405 C22.6670377,29.8930246 22.4235505,30.047911 22.1370908,30.1610043 C21.850631,30.2740977 21.5307557,30.3306435 21.1774554,30.3306435 C20.8146063,30.3306435 20.4899568,30.2740977 20.203497,30.1610043 C19.9170373,30.047911 19.6735501,29.8930246 19.4730283,29.6963405 C19.2725064,29.4996564 19.1197302,29.263639 19.0146949,28.9882813 C18.9096597,28.7129235 18.8571429,28.4179018 18.8571429,28.1032072 Z" id="!" fill="#9A877E"></path>
            </g>
        </g>
    </g>
</svg>
`;

const or = `
<svg width="44px" height="41px" viewBox="0 0 44 41" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-593.000000, -568.000000)">
            <g transform="translate(593.000000, 568.000000)">
                <rect fill="#DAD3D3" x="0" y="0" width="44" height="41"></rect>
                <polygon fill="#9A877E" points="23.8648725 34.5258018 20 34.5258018 20 7 23.8648725 7"></polygon>
            </g>
        </g>
    </g>
</svg>
`;

const xor = `
<svg width="44px" height="41px" viewBox="0 0 44 41" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs></defs>
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-420.000000, -567.000000)">
            <g transform="translate(420.000000, 567.000000)">
                <rect fill="#DAD3D3" x="0" y="0" width="44" height="41"></rect>
                <polygon id="^" fill="#9A897E" points="18.3316925 25.905794 14.6666667 25.905794 19.8860562 12.9473684 23.1747624 12.9473684 28.3777902 25.905794 24.729126 25.905794 21.8494629 18.2554361 21.5058667 16.8399514 21.1622705 18.2554361"></polygon>
            </g>
        </g>
    </g>
</svg>
`;

const invert = `
<svg width="44px" height="41px" viewBox="0 0 44 41" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-535.000000, -568.000000)">
            <g transform="translate(535.000000, 568.000000)">
                <rect fill="#DAD3D3" x="0" y="0" width="44" height="41"></rect>
                <path d="M30.6796875,18.3252467 C30.6796875,19.1218173 30.5722667,19.8593716 30.3574219,20.5379317 C30.1425771,21.2164919 29.8417988,21.7991598 29.4550781,22.2859529 C29.0683574,22.7727461 28.6028673,23.1538158 28.0585938,23.4291735 C27.5143202,23.7045313 26.917538,23.8422081 26.2682292,23.8422081 C25.8480882,23.8422081 25.4542119,23.8028718 25.0865885,23.7241982 C24.7189652,23.6455246 24.3585087,23.5250573 24.0052083,23.362793 C23.651908,23.2005286 23.3033871,22.9964719 22.9596354,22.7506168 C22.6158837,22.5047617 22.2625886,22.2097399 21.8997396,21.8655428 C21.4318553,21.4721746 20.9830751,21.1673188 20.5533854,20.9509663 C20.1236958,20.7346138 19.684464,20.6264391 19.2356771,20.6264391 C18.9778633,20.6264391 18.7296019,20.692819 18.4908854,20.8255808 C18.2521689,20.9583426 18.0397145,21.1353556 17.8535156,21.3566252 C17.6673168,21.5778948 17.5193148,21.8311218 17.4095052,22.1163137 C17.2996956,22.4015057 17.2447917,22.6965274 17.2447917,23.0013877 L14.6666667,22.6768606 C14.6666667,21.88029 14.7717003,21.1501113 14.9817708,20.4863024 C15.1918413,19.8224936 15.4902324,19.2521183 15.8769531,18.7751593 C16.2636738,18.2982004 16.7267768,17.9269647 17.266276,17.6614412 C17.8057753,17.3959177 18.4001704,17.2631579 19.0494792,17.2631579 C19.8802125,17.2631579 20.6464809,17.4303369 21.3483073,17.7646998 C22.0501337,18.0990628 22.7543367,18.5858486 23.4609375,19.225072 C23.9288218,19.6381086 24.3752149,19.9478814 24.8001302,20.1543997 C25.2250455,20.360918 25.6523416,20.4641756 26.0820312,20.4641756 C26.339845,20.4641756 26.5833322,20.3953372 26.8125,20.2576583 C27.0416678,20.1199794 27.2421866,19.9380494 27.4140625,19.7118627 C27.5859384,19.485676 27.7243918,19.2275319 27.8294271,18.9374229 C27.9344623,18.6473139 27.9869792,18.3498336 27.9869792,18.0449733 L30.6796875,18.3252467 Z" id="~" fill="#9A877E"></path>
            </g>
        </g>
    </g>
</svg>
`;

const and = `
<svg width="44px" height="41px" viewBox="0 0 44 41" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-342.000000, -567.000000)">
            <g transform="translate(342.000000, 567.000000)">
                <g fill="#DAD3D3">
                    <rect x="0" y="0" width="44" height="41"></rect>
                </g>
                <path d="M16,24.1807553 C16,23.7359491 16.0623393,23.3282162 16.1870199,22.9575443 C16.3117004,22.5868724 16.4886093,22.2414788 16.7177519,21.9213531 C16.9468945,21.6012274 17.2215246,21.2996399 17.5416503,21.0165814 C17.861776,20.7335228 18.2206483,20.4538383 18.6182781,20.1775192 C18.2206483,19.5777048 17.9123214,19.0099114 17.693288,18.4741221 C17.4742546,17.9383327 17.3647396,17.3840181 17.3647396,16.8111616 C17.3647396,16.2315656 17.4574061,15.7058934 17.6427421,15.2341292 C17.828078,14.762365 18.092599,14.3613715 18.4363129,14.0311366 C18.7800268,13.7009016 19.1944991,13.4464898 19.6797423,13.2678933 C20.1649854,13.0892969 20.7075061,13 21.3073206,13 C21.8127822,13 22.2727454,13.0909817 22.6872239,13.2729479 C23.1017025,13.4549141 23.4555203,13.7025866 23.748688,14.0159728 C24.0418558,14.329359 24.2693101,14.6916011 24.4310578,15.1027099 C24.5928055,15.5138187 24.6736782,15.9485091 24.6736782,16.4067943 C24.6736782,16.7505083 24.6197631,17.0739988 24.5119313,17.3772758 C24.4040995,17.6805528 24.2558329,17.9652919 24.0671273,18.2315017 C23.8784216,18.4977115 23.6577067,18.7487537 23.4049758,18.9846358 C23.152245,19.2205179 22.8809847,19.4429176 22.5911867,19.6518418 L21.7824521,20.3089386 L24.2794201,23.5135493 C24.4950837,23.1293985 24.6618836,22.7081868 24.7798246,22.2499016 C24.8977656,21.7916164 24.9567353,21.2996411 24.9567353,20.773961 L27.3627206,20.773961 C27.3627206,21.6972709 27.2397268,22.5582276 26.9937355,23.356857 C26.7477441,24.1554864 26.3619142,24.8715463 25.8362341,25.5050582 L27.7367603,27.9312619 L24.5220405,27.9312619 L23.8649436,27.0921998 C23.3527425,27.4359137 22.8220158,27.6970649 22.2727475,27.8756614 C21.7234791,28.0542578 21.1017707,28.1435547 20.4076034,28.1435547 C19.726915,28.1435547 19.1136308,28.0458336 18.5677322,27.8503884 C18.0218337,27.6549432 17.5585008,27.3819981 17.1777197,27.0315447 C16.7969386,26.6810913 16.5054601,26.2632493 16.3032755,25.7780061 C16.1010908,25.2927629 16,24.7603513 16,24.1807553 Z M20.5289136,25.8892071 C20.8793669,25.8892071 21.2230757,25.8420314 21.5600501,25.7476785 C21.8970245,25.6533257 22.2205151,25.518538 22.5305316,25.3433113 L19.8718167,21.885971 L19.7909433,21.9466261 C19.5887586,22.1420713 19.4236436,22.3341438 19.2955933,22.5228495 C19.1675431,22.7115552 19.0681371,22.8935186 18.9973725,23.0687453 C18.9266078,23.243972 18.8794321,23.4107718 18.8558439,23.5691498 C18.8322557,23.7275278 18.8204618,23.8774792 18.8204618,24.0190084 C18.8204618,24.288588 18.8608981,24.5379453 18.941772,24.7670879 C19.0226458,24.9962305 19.1372154,25.1933576 19.2854842,25.358475 C19.4337529,25.5235925 19.6140315,25.6533257 19.8263254,25.7476785 C20.0386193,25.8420314 20.272813,25.8892071 20.5289136,25.8892071 Z M19.9122534,16.8111616 C19.9122534,17.1144386 19.9745928,17.4193959 20.0992733,17.7260426 C20.2239539,18.0326893 20.3941234,18.3578648 20.609787,18.7015787 L21.5499409,18.0040451 C21.7588651,17.8692553 21.9172407,17.7294131 22.0250725,17.5845141 C22.1329043,17.4396151 22.2087224,17.3014576 22.2525291,17.1700376 C22.2963358,17.0386176 22.3182388,16.9206783 22.3182388,16.8162162 C22.3182388,16.7117541 22.3182388,16.6291967 22.3182388,16.5685413 C22.3182388,16.4067935 22.2946509,16.2484179 22.2474745,16.0934097 C22.2002981,15.9384015 22.1329042,15.800244 22.0452909,15.6789332 C21.9576775,15.5576224 21.8515322,15.4599013 21.7268516,15.385767 C21.6021711,15.3116326 21.4623288,15.274566 21.3073206,15.274566 C21.0714385,15.274566 20.8658872,15.3150023 20.6906605,15.3958761 C20.5154338,15.47675 20.3705369,15.5879499 20.2559656,15.7294791 C20.1413943,15.8710084 20.0554671,16.0344385 19.9981815,16.2197745 C19.9408958,16.4051104 19.9122534,16.6022375 19.9122534,16.8111616 Z" fill="#9A897E"></path>
            </g>
        </g>
    </g>
</svg>
`;

class Opshape extends HTMLElement {
    constructor() {
        super();

        this.shapes = {};
        this.shapes['plus'] = plus;
        this.shapes['and'] = and;
        this.shapes['or'] = or;
        this.shapes['xor'] = xor;
        this.shapes['rightshift'] = rightshift;
        this.shapes['leftshift'] = leftshift;
        this.shapes['invert'] = invert;
        this.shapes['not'] = not;

        const op = this.getAttribute("op");

        switch (op) {
            case "+": {
            this.innerHTML = this.shapes.plus;
            break;
            }
            case "&": {
            this.innerHTML = this.shapes.and;
            break;
            }
            case "~": {
            this.innerHTML = this.shapes.invert;
            break;
            }
            case "!": {
            this.innerHTML = this.shapes.not;
            break;
            }
            case "|": {
            this.innerHTML = this.shapes.or;
            break;
            }
            case "^": {
            this.innerHTML = this.shapes.xor;
            break;
            }
            case ">>": {
            this.innerHTML = this.shapes.rightshift;
            break;
            }
            case "<<": {
            this.innerHTML = this.shapes.leftshift;
            break;
            }
        }
    }
}

export { Operator, OperatorSVG, Binary, BinarySVG, EqualsBar, Opshape };
