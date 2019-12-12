
const prediction = require('./generator');

const newSeed = ()=>{
    const seed = Math.floor(Math.random()*1000000000000);
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('seed', seed);
    window.history.pushState({}, '', `${location.pathname}?${urlParams}`);
    return seed;
};

const tagify = (s)=> s.replace(/[\s\W]/g,'');

const newPrediction = (seed)=>{
    const result = prediction( seed );
    document.querySelector('#prediction-fragment').innerHTML = result.sentence;
    document.querySelector('#seed-link').innerHTML = seed;
    document.querySelector('.tweet-link').href = `https://twitter.com/share?text=Prediction: ${result.prediction}&url=${window.location}&hashtags=2020,predictions,thoughtleadership,${tagify(result.mrkt)},${tagify(result.noun)}`;
}

window.onload = ()=>{
    const urlParams = new URLSearchParams(window.location.search);
    const querySeed = urlParams.get('seed');
    const seed = querySeed ? querySeed : newSeed();

    newPrediction(seed);
    document.querySelector('#refresh').onclick = (e)=>{
        console.log('refresh')
        e.preventDefault();
        newPrediction(newSeed());
        return false;
    }
}
