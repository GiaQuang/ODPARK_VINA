/** @format */

let val = 3702;
let gio = Math.floor(val / 3600)
	.toString()
	.padStart(2, '0');
let phut = Math.floor((val % 3600) / 60)
	.toString()
	.padStart(2, '0');
let giay = Math.floor(val % 60)
	.toString()
	.padStart(2, '0');
console.log(gio, phut, giay);
