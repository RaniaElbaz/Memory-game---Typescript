//#endregion
//#region Variables Declaration
const prepare = {};
prepare.cards = [];
prepare.progress = 0;
prepare.fullTrack = new Audio('./assets/audio/fulltrack.mp3');
prepare.failAudio = new Audio('./assets/audio/fail.mp3');
prepare.flipAudio = new Audio('./assets/audio/flip.mp3');
prepare.goodAudio = new Audio('./assets/audio/good.mp3');
prepare.gameOverAudio = new Audio('./assets/audio/game-over.mp3');
prepare.fullTrack.loop = true;
const numberOfCards = 20;
const tempNumbers = [];
let cardsHTMLContent = '';
//#endregion
//#region Functions Declarations
const getRandomInt = (min, max) => {
    let result;
    let exists = true;
    min = Math.ceil(min);
    max = Math.floor(max);
    while (exists) {
        result = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!tempNumbers.find(no => no === result.toString())) {
            exists = false;
            tempNumbers.push(result.toString());
        }
    }
    return result;
};
const toggleFlip = (index) => {
    prepare.fullTrack.play();
    const card = prepare.cards[index];
    if (!card.flip && card.clickable) {
        flip(card, index);
        selectCard(card, index);
    }
};
const flip = (card, index) => {
    prepare.flipAudio.play();
    if (card) {
        card.flip = card.flip === '' ? 'flip' : '';
        let flippedCard = document.getElementById(`card-flip-${index}`);
        flippedCard.classList.value = card.flip;
    }
};
const selectCard = (card, index) => {
    if (!prepare.selectedCard_1) {
        prepare.selectedCard_1 = card;
        prepare.selectedIndex_1 = index;
    }
    else if (!prepare.selectedCard_2) {
        prepare.selectedCard_2 = card;
        prepare.selectedIndex_2 = index;
    }
    if (prepare.selectedCard_1 && prepare.selectedCard_2) {
        if (prepare.selectedCard_1.src === prepare.selectedCard_2.src) {
            prepare.selectedCard_1.clickable = false;
            prepare.selectedCard_2.clickable = false;
            prepare.selectedCard_1 = null;
            prepare.selectedCard_2 = null;
            prepare.failAudio.pause();
            prepare.failAudio.currentTime = 0;
            prepare.goodAudio.pause();
            prepare.goodAudio.currentTime = 0;
            prepare.goodAudio.play();
            changeProgress();
            checkFinish();
        }
        else {
            setTimeout(() => {
                prepare.failAudio.pause();
                prepare.failAudio.currentTime = 0;
                prepare.goodAudio.pause();
                prepare.goodAudio.currentTime = 0;
                prepare.failAudio.play();
                flip(prepare.selectedCard_1, prepare.selectedIndex_1);
                flip(prepare.selectedCard_2, prepare.selectedIndex_2);
                prepare.selectedCard_1 = null;
                prepare.selectedCard_2 = null;
            }, 1000);
        }
    }
};
const changeProgress = () => {
    const progress = prepare.cards.filter(card => !card.clickable).length / numberOfCards * 100;
    let progressElement = document.getElementById('progress');
    progressElement.style.width = `${progress}%`;
    progressElement.innerText = `${progress}%`;
};
const checkFinish = () => {
    if (prepare.cards.filter(card => !card.clickable).length === numberOfCards) {
        prepare.failAudio.pause();
        prepare.failAudio.currentTime = 0;
        prepare.goodAudio.pause();
        prepare.goodAudio.currentTime = 0;
        prepare.fullTrack.pause();
        prepare.fullTrack.currentTime = 0;
        prepare.gameOverAudio.play();
    }
};
//#endregion
//#region Game Logic
for (let index = 0; index < numberOfCards / 2; index++) {
    prepare.cards.push({
        id: getRandomInt(0, numberOfCards),
        src: `./assets/images/${index}`,
        flip: '',
        clickable: true,
        index
    });
    prepare.cards.push({
        id: getRandomInt(0, numberOfCards),
        src: `./assets/images/${index}`,
        flip: '',
        clickable: true,
        index
    });
}
prepare.cards.sort((a, b) => a.id > b.id ? 1 : -1);
prepare.cards.forEach((item, index) => {
    cardsHTMLContent +=
        `<span class="col-sm-3 col-lg-2">
        <div onclick="toggleFlip(${index})" class="card-flip">
            <div id="card-flip-${index}">
                <div class="front">
                    <div class="card">
                        <img class="card-image" src="./assets/back.jpg" alt=""Loading.."/>
                        <span class="card-content">${index + 1}</span>
                    </div>
                </div>
                <div class="back">
                    <div class="card">
                        <img src="./assets/images/${item.index}.jpg" alt="Loading.."
                        style="width:100%; height:120px; display: block;"/>
                    </div>
                </div>
            </div>
        </div>
    </span>`;
});
let cards = document.getElementById('cards');
cards.innerHTML = cardsHTMLContent;
//#endregion
