import {
  plus,
  and,
  or,
  xor,
  invert,
  not,
  leftshift,
  rightshift
  } from './opsvg'

export class Opshape extends HTMLElement {
    constructor() {
        super()

        this.shapes = {}
        this.shapes['plus'] = plus
        this.shapes['and'] = and
        this.shapes['or'] = or
        this.shapes['xor'] = xor
        this.shapes['rightshift'] = rightshift
        this.shapes['leftshift'] = leftshift
        this.shapes['invert'] = invert
        this.shapes['not'] = not

        const op = this.getAttribute("op")

        switch (op) {
            case "+": {
            this.innerHTML = this.shapes.plus
            break;
            }
            case "&": {
            this.innerHTML = this.shapes.and
            break;
            }
            case "~": {
            this.innerHTML = this.shapes.invert
            break;
            }
            case "!": {
            this.innerHTML = this.shapes.not
            break;
            }
            case "|": {
            this.innerHTML = this.shapes.or
            break;
            }
            case "^": {
            this.innerHTML = this.shapes.xor
            break;
            }
            case ">>": {
            this.innerHTML = this.shapes.rightshift
            break;
            }
            case "<<": {
            this.innerHTML = this.shapes.leftshift
            break;
            }
        }
    }
}
