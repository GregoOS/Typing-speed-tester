"use strict";

const previousText=document.getElementById("previous");
const repeatAction=document.getElementById("redo");
const nextText=document.getElementById("next");
const sourceText=document.getElementById("source");
const uInput=document.getElementById("user-input");
const lastRes=document.getElementById("last");
const bestRes=document.getElementById("best");
const notification_div = document.getElementById("notifications");

const last_wpm=document.querySelector("#last .wpm");
const last_ppm=document.querySelector("#last .ppm");
const last_pressed=document.querySelector("#last .pressed");
const last_accuracy=document.querySelector("#last .accuracy");

const best_wpm=document.querySelector("#best .wpm");
const best_ppm=document.querySelector("#best .ppm");
const best_pressed=document.querySelector("#best .pressed");
const best_accuracy=document.querySelector("#best .accuracy");

let textNumber=0;
let originalText=sourceText.innerText;
let act =false;
let inicio=0;

let correct,nextWord,text,wordNumber,pressed,totalWords,totalLetters,words;

function main(){
    sourceText.innerText=textRepository(textNumber);
    originalText=sourceText.innerText;

    if(localStorage.getItem("bestWPM")===null){
        localStorage.setItem("bestWPM",0);
        localStorage.setItem("bestPPM", 0);
        localStorage.setItem("bestPressed", 0);
        localStorage.setItem("bestAccuracy", "0%");
    }else{
        best_wpm.innerHTML=localStorage.getItem("bestWPM");
        best_ppm.innerHTML=localStorage.getItem("bestPPM");
        best_pressed.innerHTML=localStorage.getItem("bestPressed");
        best_accuracy.innerHTML=localStorage.getItem("bestAccuracy");
    }


    uInput.addEventListener('click', start);

    previousText.addEventListener('click',previous);

    nextText.addEventListener('click',next);

    repeatAction.addEventListener('click',repeat);

}

function start(){
    if(!act){
        sourceText.innerHTML=originalText;
        correct=""
        inicio = new Date().getTime();
        wordNumber=0;
        text=originalText;
        words=text.split(" ");
        nextWord=words[wordNumber];
        act=true;
        totalWords = words.length;
        totalLetters = text.length;
        pressed=-1;
        window.addEventListener("keydown", type);
    }
}

function finish(words, letters, pressed, time){
    let lastWPM=Math.floor(words/(time/(60*1000)));
    let lastPPM=Math.floor(letters/(time/(60*1000)));
    let lastPressed=pressed;
    let lastAccuracy=Math.floor((letters/pressed)*100)+"%";

    last_wpm.innerText=lastWPM;
    last_ppm.innerText=lastPPM;
    last_accuracy.innerText=lastAccuracy;
    last_pressed.innerText=lastPressed;

    let bestPPM=localStorage.getItem("bestPPM");
    if(bestPPM<lastPPM){
        best_wpm.innerHTML=lastWPM;
        best_ppm.innerHTML=lastPPM;
        best_pressed.innerHTML=lastPressed;
        best_accuracy.innerHTML=lastAccuracy;

        localStorage.setItem("bestWPM",lastWPM);
        localStorage.setItem("bestPPM", lastPPM);
        localStorage.setItem("bestPressed", lastPressed);
        localStorage.setItem("bestAccuracy", lastAccuracy);
    }
    uInput.blur();
    window.removeEventListener("keydown", type);
    act=false;
}

function type(event){
    if(event.key!=="Shift"){
        pressed+=1;
    }
    if(event.key===" "){
        if(nextWord===uInput.value.trim()){
            correct=correct+ nextWord+" ";
            text=text.substring(nextWord.length+1);
            sourceText.innerHTML=` <span style="background-color:green;color:white;">${correct}</span>` + text;
            uInput.value="";
            if(wordNumber===totalWords-1){
                finish(totalWords,totalLetters,pressed,new Date().getTime()-inicio);
            }else{
                wordNumber+=1;
                nextWord=words[wordNumber];
            }
        }else{
            createNotification(`Not correct, ${uInput.value} is diferent from ${nextWord}`);
        }
    }
    
}

function previous(){
    textNumber-=1;
    sourceText.innerText=textRepository(Math.abs(textNumber));
    originalText=sourceText.innerText;
}

function next(){
    textNumber+=1;
    sourceText.innerText=textRepository(Math.abs(textNumber));
    originalText=sourceText.innerText;
}

function textRepository(i){
    let list=[
        "This is a very fast example.",
        "Peaky Blinders is a British period crime drama television series created by Steven Knight. Set in Birmingham, England, the series follows the exploits of the Shelby crime family in the direct aftermath of the First World War. The fictional family is loosely based on a real urban youth gang of the same name, who were active in the city from the 1890s to the early 20th century.",
        "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source."
    ]
    return list[i%list.length]
}

function repeat(){
    window.removeEventListener("keydown", type);
    sourceText.innerHTML=originalText;
    act=false;
}

function createNotification(data){
    const notif=document.createElement("div");
    notif.classList.add("toast");

    notif.innerText=data;

    notification_div.appendChild(notif);

    setTimeout(function(){
        $(notif).fadeTo(1000, 0.01, function(){ 
            $(this).slideUp(150, function() {
                $(this).remove(); 
            }); 
        });
    },1750);
}


















document.addEventListener("DOMContentLoaded", main); 