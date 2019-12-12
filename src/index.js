
const prediction = require('./generator');

let pullDeltaX = 0;
let decisionThreshold = 150;
let swiping = false;
const dragOrigin = [];
let mouse= false;


const newSeed = ()=>{
    console.log('new seed');
    const seed = Math.floor(Math.random()*1000000000000);
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('seed', seed);
    window.history.pushState({}, '', `${location.pathname}?${urlParams}`);
    return seed;
};

const tagify = (s)=> s.replace(/[\s\W]/g,'');

const newPrediction = (seed)=>{
    console.log('newPrediction');
    const result = prediction( seed );
    document.querySelector('.card.active')
        .innerHTML = `<div>${result.sentence}</div>
            <div>${seed}</div>
            <div>
                <a class="tweet-link" href="https://twitter.com/share?text=Prediction: ${result.prediction}&url=${window.location}&hashtags=2020,predictions,thoughtleadership,${tagify(result.mrkt)},${tagify(result.noun)}"></a>
            </div>`;
}

function startSwipeMouse(e){
    mouse = true;
    dragOrigin[0] = e.pageX || e.originalEvent.touches[0].pageX;
    dragOrigin[1] = e.pageY || e.originalEvent.touches[0].pageY;
    swiping = true;
}

function stopSwipe(e){
    swiping = false;
    const card = this;
    if(Math.abs(pullDeltaX)>decisionThreshold){
        discard(card);
    }else{
        card.classList.add('reset');
        setTimeout(()=>{
            card.classList.remove('reset');
            card.style.transform = '';
            pullDeltaX = 0;
            }, 300);
    }
}

function move(e){
    if(!swiping) return;
    var x = e.pageX || e.originalEvent.touches[0].pageX;
    pullDeltaX = (x - dragOrigin[0]);
    if (!pullDeltaX) return;
    pullChange(document.querySelector('.card.active'));
}

function discard(card){
    console.log('discard');
    card.classList.add('inactive');
    card.classList.remove('active');
    if (pullDeltaX >= decisionThreshold) {
        card.classList.add('to-right');
    } else if (pullDeltaX <= -decisionThreshold) {
        card.classList.add('to-left');
    }
    newActiveCard();
    setTimeout(()=>{
        //TODO REMOVE THIS card and set the next card in the stack to active, get a prediction and pop a new card underneath it
        card.remove();
        pullDeltaX = 0;
        }, 500);

    // set new active card
}

function pullChange(card) {
    card.style.transform = `translateX(${pullDeltaX}px) rotate(${pullDeltaX/10}deg)`;
    if(Math.abs(pullDeltaX)>decisionThreshold && !mouse){
        discard(card)
    }
}

function newActiveCard(){
    console.log('newActiveCard');
    if (document.querySelector('.active.card') == null){
        const newCard = document.createElement('div'); 
        newCard.classList.add('card');
        newCard.classList.add('active');
        document.querySelector('.card-stack')
            .append(newCard);            
    }
    newPrediction(newSeed());
    swipeable();
}

const swipeable = ()=>{
    console.log('swipeable');
    document.querySelector('.card.active').addEventListener('mousedown', startSwipeMouse);
    document.querySelector('.card.active').addEventListener('mouseup', stopSwipe);
    document.querySelector('.card.active').addEventListener('mouseout', stopSwipe);
    document.addEventListener('mousemove', move);
}

window.onload = ()=>{
    const urlParams = new URLSearchParams(window.location.search);
    const querySeed = urlParams.get('seed');
    const seed = querySeed ? querySeed : newSeed();
    swipeable();
    newPrediction(seed);
}
