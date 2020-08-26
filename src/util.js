function makeMap(str, separator, expectsLowerCase) {
  var map = Object.create(null);
  var list = separator ? str.split(separator) : str.split(',')

  for (var i = 0; i < list.length; i++) {
    map[list[i].trim()] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

var isUnit = makeMap("vmax,vmin,vh,vw,rem,ch,em,ex,%,px,cm,mm,in,pt,pc")

var isHex = /[0-9A-Za-z]/ // validate 3 or 6/length
