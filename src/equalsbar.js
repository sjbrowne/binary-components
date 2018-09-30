// FIXME magic numbers
export class EqualsBar extends HTMLElement {
    constructor() {
         super()
         
        /* create the equals bar */
        const style = `grid-column: 1 / 33;`
        this.innerHTML = `<div style="${style}" class="bar"></div>`
    }
}
