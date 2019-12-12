
const prediction = require('./generator');

let pullDeltaX = 0;
let deg = 0;
let decisionThreshold = 150;
let swiping = true;
const dragOrigin = [];


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

function startSwipe(e){
    dragOrigin[0] = e.pageX || e.originalEvent.touches[0].pageX;
    dragOrigin[1] = e.pageY || e.originalEvent.touches[0].pageY;
    swiping = true;
    console.log('start', this);
}

function stopSwipe(e){
    swiping = false;
    console.log('stop', this);
    const card = this;
    if (Math.abs(pullDeltaX) < decisionThreshold) {
        card.classList.add('reset');
    }

    setTimeout(()=>{
        card.classList.remove('reset');
        card.style.transform = '';
        pullDeltaX = 0;
        }, 300);
}

function move(e){
    if(!swiping) return;
    var x = e.pageX || e.originalEvent.touches[0].pageX;
    pullDeltaX = (x - dragOrigin[0]);
    if (!pullDeltaX) return;
    pullChange(document.querySelector('.card.active'));
}

function discard(activeCard){
    activeCard.classList.add('inactive');
    activeCard.classList.remove('active');
    if (pullDeltaX >= decisionThreshold) {
        activeCard.classList.add('to-right');
    } else if (pullDeltaX <= -decisionThreshold) {
        activeCard.classList.add('to-left');
    }
    // set new active card
}

function pullChange(activeCard) {
    console.log(activeCard, pullDeltaX);
    activeCard.style.transform = `translateX(${pullDeltaX}px) rotate(${pullDeltaX/10}deg)`;
    if(Math.abs(pullDeltaX)>decisionThreshold){
        discard(activeCard)
    }
}

const swipeable = ()=>{
    document.querySelector('.card.active').addEventListener('mousedown', startSwipe);
    document.querySelector('.card.active').addEventListener('mouseup', stopSwipe);
    document.querySelector('.card.active').addEventListener('mouseout', stopSwipe);
    document.addEventListener('mousemove', move)
}

window.onload = ()=>{
    const urlParams = new URLSearchParams(window.location.search);
    const querySeed = urlParams.get('seed');
    const seed = querySeed ? querySeed : newSeed();
    swipeable();
    newPrediction(seed);
    document.querySelector('#refresh').onclick = (e)=>{
        console.log('refresh')
        e.preventDefault();
        newPrediction(newSeed());
        return false;
    }
}
