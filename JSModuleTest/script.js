import { sum, difference, product, quotient } from './functions.js'
import {vec22} from './gl-matrix-modified.js'
//const Ls = vec3(1.0,1.0,1.0)
const x = 10
const y = 5
const moo = vec22(1,2)
document.getElementById('x').textContent = x
document.getElementById('y').textContent = y

document.getElementById('addition').textContent = sum(x, y)
document.getElementById('subtraction').textContent = difference(x, y)
document.getElementById('multiplication').textContent = product(x, y)
document.getElementById('division').textContent = quotient(x, y)
//console.log(moo.create())
document.getElementById('test import').textContent = moo