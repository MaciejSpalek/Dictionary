// html
const $button = $('.search__button');
const $return = $('.content__arrow');
const $content = $('.content');
const $bottomBox = $('.content__bottom-box');
const $main = $('.main');
const $input = $('.search__input');
const $inputText = $('.search__input-text')
// API
const key = "62e83ebc-e927-45de-a312-e4c77ad0f308"
const proxy = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/';


function fadingSection(fadeOut, duration) {
    if (fadeOut) {
        $($weatherSection).fadeOut(duration);
    } else {
        $($weatherSection).fadeIn(duration).css('display', 'flex');
    }
}

function setWord() {
    return $input.val();
}
function setURL(word) {
    return `${proxy}${word}?key=${key}`
}
function searchButton() {
    $button.click((e) => {
        e.preventDefault();
        if($input.val() != "") {
            const word = setWord();
            const url = setURL(word);
            sendRequest(url, word);
        }
    })
}
function playAudio(audio) { 
    $(audio)[0].load();
    $(audio)[0].play();
} 
function clearInput() {
    $input.val('');
}
function listeners() {
    $($content).on('click', e => {
        if(e.target.closest('.content__arrow') !== null) {
            $content.removeClass('content--transform');
            $main.removeClass('main--transform');
            clearInput();
            setTimeout(()=> {
                $('.content__top-box').remove();
                $('.content__bottom-box').remove();
            }, 2000)
        }

        if(e.target.closest('.fa-volume-up') !== null) {
            const audio = e.target.firstElementChild;
            playAudio(audio);
        }
    });
}

function setSubdirectory(string) {
    const testRegex1 = /^bix/;
    const testRegex2 = /^gg/;
    const testRegex3 = /^[0-9]/;
    const testRegex4 = /^[.,;:'"`~!?_-]/;

    if(testRegex1.test(string)) {
        return "bix";
    } else if(testRegex2.test(string)) {
        return "gg";
    } else if(testRegex3.test(string) || testRegex4.test(string)) {
        return "number";
    } else {
        return string[0];
    }
} 

function sendRequest(url, phrase) {
    fetch(url)
        .then(response => response.json())
        .then(response => {
            
            if(typeof response[0].meta.id != "undefined") {

                $content.addClass('content--transform');
                $main.addClass('main--transform');

                const contentTopBox = $('<div>').addClass('content__top-box');
                const contentPhrase = $('<h2>').addClass('content__phrase element--color').html(phrase);
                const contentBottomBox = $('<div>').addClass('content__bottom-box style');
                const contentArrowIcon = $('<div>').addClass('content__arrow').html("&#8634");
                
                $content.append(contentTopBox);
                $content.append(contentBottomBox);
                contentTopBox.append(contentPhrase);
                contentTopBox.append(contentArrowIcon);
                
                [...response].forEach((respElement, respIndex) => {
                    const {
                        meta: {id: wordName},
                        hwi: {prs: pronunciation},
                        fl: partOfSpeech,
                        shortdef: definition 
                    } = respElement;
                    const contentBox = $('<div>').addClass('content__box');
                    const contentWordBox = $('<div>').addClass('content__word-box');
                    const pronunciationBox = $('<div>').addClass('content__pronunciation-box');
                    const contentWord = $('<h3>').addClass('content__word element--color word--color').html(`${wordName}`);
                   
                    contentBottomBox.append(contentBox);

                    contentBox.append(contentWordBox);
                    contentWordBox.append(contentWord);
                    contentWordBox.append(pronunciationBox);

                    if(typeof pronunciation != "undefined") {
                        const contentPronunciationText = $('<h3>').addClass('content__pronunciation-text element--color word--color').html(`/${pronunciation[0].mw}/`);
                        const contentAudioIcon = $('<span>').addClass('fas fa-volume-up element--color word--color');
                        

                        let filename;
                        if(pronunciation[0].hasOwnProperty("sound")) {
                            filename = pronunciation[0].sound.audio;
                        } else {
                            filename = pronunciation[1].sound.audio;
                        }

                        const subdirectory = setSubdirectory(filename);
                        const audioURL = `https://media.merriam-webster.com/soundc11/${subdirectory}/${filename}.wav`
                        const audio = $('<audio>').attr('id', `audio_${respIndex}`).addClass('audio');
                        const source = $('<source>').attr({
                            'id': `source_${respIndex}`,
                            'src': audioURL
                        });
                        
                        pronunciationBox.append(contentPronunciationText);
                        pronunciationBox.append(contentAudioIcon);
                        contentAudioIcon.append(audio);
                        audio.append(source);
                    }

                    if(typeof partOfSpeech != "undefined") {
                        const contentPartOfSpeech = $('<h3>').addClass('content__part-of-speech element--color partOfSpeech--color').html(partOfSpeech);
                        contentBox.append(contentPartOfSpeech);
                    }
                   
                    [...definition].forEach((defElement, defIndex)=> {
                        const contentDefinition = $('<h3>').addClass('content__definition').html(`<span class="element--color"> def:</span> ${defElement}`);
                        contentBox.append(contentDefinition);
                    })
                })
                $inputText.html("Enter english word...")
            }
        })
        
        .catch(err => {
            console.log(err);
            $inputText.html("Incorrect word!")
        });
}

searchButton();
listeners();