const responses = [{
  regex: /^1$/i,
  responses: ['1'],
  repeatable: true,
}, {
  regex: /^LUL$|^LOL$|^HA$|^m60LUL$|^KEKW$/i,
  responses: ['LUL', 'LOL', 'lmfao', 'Hahaha', 'LULW', 'LMFAO', 'lol', 'lul', 'HAHAHA', 'KEKW', 'm60LUL'],
}, {
  regex: /^9\/11$/i,
  responses: ['11/11'],
}, {
  regex: /^\^/i,
  responses: ['^'],
}, {
  regex: /^omg|^omfg/i,
  responses: ['OMG', 'OMFG', 'omg', 'omfg'],
}, {
  regex: /kreygasm/i,
  responses: ['Kreygasm'],
}, {
  regex: /🎡/g,
  responses: ['🎡🎡🎡🎡🎡🎡🎡🎡🎡🎡🎡🎡🎡🎡🎡🎡🎡🎡🎡🎡🎡🎡🎡🎡🎡🎡🎡🎡🎡🎡🎡🎡🎡🎡🎡🎡🎡🎡🎡🎡🎡🎡🎡'],
}, {
  regex: /Pog/g,
  responses: ['Pog', 'PogChamp', 'm60WOW', 'POGGERS'],
}, {
  regex: /^Clap/gi,
  responses: ['Clap', 'peepoClap'],
  repeatable: true,
}, {
  regex: /poggies/gi,
  responses: ['POGGIES'],
}, {
  regex: /pogchamp/gi,
  responses: ['PogChamp'],
}, {
  regex: /PepeHands/gi,
  responses: ['PepeHands'],
}, {
  regex: /peepoBlanket/gi,
  responses: ['peepoBlanket'],
}, {
  regex: /duDudu/g,
  responses: ['duDudu'],
  repeatable: true,
}, {
  regex: /taco bell/g,
  responses: ['TACO BELL!'],
}, {
  regex: /just dance/g,
  responses: ['JUST DANCE POGGIES'],
}, {
  regex: /^!raid/gi,
  responses: ['!raid'],
}, {
  regex: /^my poops/gi,
  responses: ['MY POOPS'],
}, {
  regex: /^catjam/gi,
  responses: ['catJAM'],
  repeatable: true,
}, {
  regex: /^jammies/gi,
  responses: ['Jammies'],
  repeatable: true,
}, {
  regex: /^rickpls/gi,
  responses: ['RickPls'],
  repeatable: true,
}, {
  regex: /^peped/gi,
  responses: ['pepeD'],
  repeatable: true,
}, {
  regex: /^partykirby/gi,
  responses: ['PartyKirby'],
  repeatable: true,
}, {
  regex: /^sourpls/gi,
  responses: ['SourPls'],
  repeatable: true,
}, {
  regex: /^pepehands/gi,
  responses: ['pepeHands'],
}, {
  regex: /^#6945/gi,
  responses: ['#6945 never forget'],
}, {
  regex: /^D:|^m60d/gi,
  responses: ['D:'],
}, {
  regex: /^wutface/gi,
  responses: ['WutFace'],
}, {
  regex: /^yeah shit cum|^yea shit cum/gi,
  responses: ['YEA shit cum YEA shit cum YEA shit cum YEA shit cum YEA shit cum'],
}, {
  regex: /BOGO/g,
  responses: ['LETS GO BOGO!!'],
}, {
  regex: /^m60Star/gi,
  responses: ['m60Star m60Star m60Star m60Star m60Star m60Star m60Star m60Star m60Star m60Star m60Star m60Star m60Star m60Star m60Star m60Star m60Star m60Star m60Star m60Star m60Star'],
}, {
  regex: /spin the wheel/gi,
  responses: ['SPIN. THAT. WHEEL!'],
}, {
  regex: /fall guy/gi,
  responses: ['FALL GUYS!'],
}, {
  regex: /marbles/gi,
  responses: ['LET GO MARBLES!'],
}, {
  regex: /potfriend/gi,
  responses: ['PotFriend'],
  repeatable: false,
}, {
  regex: /^nooo/gi,
  responses: ['NOOOO'],
  repeatable: false,
}, {
  regex: /^ooooooo/gi,
  responses: ['oooOOOooooo', 'ooOOoOOOOoooo', 'oooOOooOOoo'],
  repeatable: false,
}, {
  regex: /^!play/gi,
  responses: ['!play'],
  repeatable: false,
}, {
  regex: /^yess/gi,
  responses: ['YESSSS'],
  repeatable: false,
}, {
  regex: /^who$/gi,
  responses: ['WH OMEGALUL'],
  repeatable: false,
}, {
  regex: /^omegalul/gi,
  responses: ['OMEGALUL'],
  repeatable: false,
}, {
  regex: /^PepegaHands/gi,
  responses: ['PepegaHands'],
  repeatable: false,
}, {
  regex: /^widepeepoSad/gi,
  responses: ['widepeepoSad'],
  repeatable: false,
}, {
  regex: /^widepeepoHappy/gi,
  responses: ['widepeepoHappy'],
  repeatable: false,
}, {
  regex: /^VoteYea/gi,
  responses: ['VoteYea'],
  repeatable: false,
}, {
  regex: /^VoteNay/gi,
  responses: ['VoteNay'],
  repeatable: false,
}, {
  regex: /monkaS/gi,
  responses: ['monkaS', 'monkaW'],
  repeatable: false,
}, {
  regex: /BibleThump/gi,
  responses: ['BibleThump'],
  repeatable: false,
}, {
  regex: /AngelThump/gi,
  responses: ['AngelThump'],
  repeatable: false,
}, {
  regex: /^tru$|^true$/gi,
  responses: ['trueee', 'TRUUU', 'truuueee', 'trrruuuuu'],
  repeatable: false,
}, {
  regex: /^!play$/gi,
  responses: ['!play'],
  repeatable: false,
}, {
  regex: /^Dancer$/gi,
  responses: ['Dancer'],
  repeatable: false,
}, {
  regex: /^!boost$/gi,
  responses: ['!boost'],
  repeatable: false,
}, {
  regex: /choo choo/gi,
  responses: ['Choo choo m60T']
}, {
  regex: /on the floor/gi,
  responses: ['ON THE FLOOR!']
}, {
  regex: /^hi$/gi,
  responses: ['omg hi!']
}, {
  regex: /^m60T$/gi,
  responses: ['m60T']
}, {
  regex: /^w$/gi,
  responses: ['W']
}, {
  regex: /^yes$/gi,
  responses: ['yes']
}, {
  regex: /^wtf$/gi,
  responses: ['wtf']
}, {
  regex: /^Hearding$/gi,
  responses: ['Hearding']
}, {
  regex: /^AmberPain$/gi,
  responses: ['AmberPain']
}, {
  regex: /^\?\?\?$/gi,
  responses: ['???']
}, {
  regex: /<3/gi,
  responses: ['<3']
}, {
  regex: /TTours/gi,
  responses: ['TTours']
}, {
  regex: /ImTyping/gi,
  responses: ['ImTyping']
}, {
  regex: /LaundryBasket/gi,
  responses: ['LaundryBasket']
}, {
  regex: /^encore$/gi,
  responses: ['ENCORE!!!', 'ENCORE ENCORE', 'encore! encore!']
}]

export default responses;