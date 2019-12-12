const data = require('./data.json');
const seedrandom = require('seedrandom'); 

const randomElement = (rand, a) => a[Math.floor(rand * a.length)];

const prediction = seed => {
    if (!seed) {
        seed = Math.floor(Math.random() * 10000000);
    }

    const rng = seedrandom(String(seed));
    const adj = randomElement(rng(), data.adjective);
    const noun = randomElement(rng(), data.noun);
    const mrkt = randomElement(rng(), data.marketsegment);
    const timeline = randomElement(rng(), data.timeline);
    const likelihood = randomElement(rng(), data.likelihood);
    let prediction = `${adj} ${noun} for ${mrkt}`;
    let preamble = `${select(timeline)} ${select(likelihood)}`;
    let sentence = `${preamble} ${prediction}.`;
    sentence = sentence[0].toUpperCase() + sentence.substring(1);
    return { sentence, prediction, preamble, seed, adj, noun, mrkt };
};

const newSeed = ()=> Math.floor(Math.random()*1000000000000);
const tagify = (s)=> s.replace(/[\s\W]/g,'');
const select = (s, rand)=> { // in a string in which things are enclosed in square brackets replace the thinsg with one option from within
    console.log('S',s )
    if(!rand){
        rand = Math.random();
    }
    if(s.indexOf('[') < 0){
        return s;
    }
    //is it a range or a select? // \[(\d+-\d+)\]
    if(s.match(/\[\d+-\d+\]/)){ //it's a range
        const range = s.match(/\[\d+-\d+\]/)
        const numericalRange = range[0].replace(/[\[\]]/g,'').split('-').map(d=>Number(d));
        return s.replace(/\[\d+-\d+\]/, numericalRange[0] + Math.floor(rand*(numericalRange[1]-numericalRange[0])))
    }
    const options = s.match(/\[(.+)\]/)[0].split('|');
    return s
        .replace(/\[(.+)\]/, randomElement(rand, options))
        .replace(/[\[\]]/g,'');
}

window.onload = ()=>{
    console.log( select('In a [short|long|medium|narrow] time frame') );
    console.log( select('around [2020-2050]') );

    const urlParams = new URLSearchParams(window.location.search);
    const querySeed = urlParams.get('seed');
    const seed = querySeed ? querySeed : newSeed();
    urlParams.set('seed', seed);
    urlParams.append('seed',seed);
    const result = prediction(seed);
    document.querySelector('#prediction-fragment').innerHTML = result.sentence;
    document.querySelector('#refresh').href = `/?seed=${newSeed()}`;
    document.querySelector('#seed-link').innerHTML = seed;
    document.querySelector('.tweet-link').href = `https://twitter.com/share?text=Prediction: ${result.prediction}&url=${window.location}&hashtags=2020,predictions,thoughtleadership,${tagify(result.mrkt)},${tagify(result.noun)}`;
}
