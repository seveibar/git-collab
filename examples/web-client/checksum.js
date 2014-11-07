
// Checksum/Hash function borrowed from
// http://stackoverflow.com/a/15710692/559475
function checksum(s){
    return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
}
