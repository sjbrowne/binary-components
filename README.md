# Binary Components
This is a set of [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
for displaying the binary encoding of either two's complement or IEEE 754 floating point.

[Example](https://sjbrowne.github.io/datalab/).

## Usage

Include the css.
```html
    <link href="dist/binary.css" type="text/css" rel="stylesheet">
```

  
Include the componennts and instantiate the elements.
```html
    <script type="module">
        import {
           Binary,
           BinarySVG, 
           Operator,
           OperatorSVG,
           Opshape,
           EqualsBar
        } from './dist/binary-components.js'
        window.customElements.define("bin-ary", Binary)
        window.customElements.define("bin-ary-svg", BinarySVG)
        window.customElements.define("op-er", Operator)
        window.customElements.define("op-er-svg", OperatorSVG)
        window.customElements.define("op-shape", Opshape)
        window.customElements.define("eq-bar", EqualsBar)
    </script>
```

Add elements.
```html
    <bin-ary hex="0xdeadbeef" isfloat="0">
    </bin-ary>
    <bin-ary hex="0xdeadbeef" isfloat="1">
    </bin-ary>
    <bin-ary-svg hex="0xdeadbeef" isfloat="0">
    </bin-ary-svg>
    <bin-ary-svg hex="0xdeadbeef" isfloat="1">
    </bin-ary-svg>
    <op-er x="0xdeadbeef" y="0x1" op=">>">
    </op-er>
    <op-er-svg x="0xdeadbeef" y="0x1" op=">>">
    </op-er-svg>
```

## Components

<a href="#Binary" name="Binary">&#182;</a> _class_ Binary <a href="#">></a>  
<a href="#BinarySVG" name="BinarySVG">&#182;</a> _class_ BinarySVG <a href="#">></a>  
<a href="#Operator" name="Operator">&#182;</a> _class_ Operator <a href="#">></a>  
<a href="#OperatorSVG" name="OperatorSVG">&#182;</a> _class_ OperatorSVG <a href="#">></a>  
<a href="#Opshape" name="Opshape">&#182;</a> _class_ Opshape <a href="#">></a>  
<a href="#EqualsBar" name="EqualsBar">&#182;</a> _class_ EqualsBar <a href="#">></a>  
