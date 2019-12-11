const data = require('./data.json');
const seedrandom = require('seedrandom'); 

const randomElement = (rand, a) => a[Math.floor(rand * a.length)];

const prediction = seed => {
    if (!seed) {
        seed = Math.floor(Math.random() * 10000000);
    }
    const rng = seedrandom(String(seed));
    const adj = randomElement(rng(), data.adjectives);
    const noun = randomElement(rng(), data.nouns);
    const mrkt = randomElement(rng(), data.markets);
    let sentence = `${adj} ${noun} for ${mrkt}.`;
    sentence = sentence[0].toUpperCase() + sentence.substring(1);
    return {
        sentence: sentence,
        seed
    };
};

window.onload = ()=>{
    let seed = Math.random();
    console.log(prediction(seed));
}
