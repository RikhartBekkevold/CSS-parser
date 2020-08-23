export function makeMap(str, separator, expectsLowerCase) {
  var map = Object.create(null);
  var list = separator ? str.split(separator) : str.split(',') // true or false, or any value

  for (var i = 0; i < list.length; i++) {
    map[list[i].trim()] = true; // wont remove "" though
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}
// import makeMap as mm form "./util"

// exe one, timer or make mape, then use map

// run in browser or babel?

// whitepsace and encoding

// rxes

// can import util as u
// or just import the fn itself


// only a prob when wanna import all
