let boxs = document.querySelector(".boxs")
let popup = document.querySelector(".popup")
function getQuran () {
    let quranAPI = "https://api.alquran.cloud/v1/meta"
    fetch(quranAPI)
    .then((response) => response.json())
    .then((data) => {
        for (let i = 0; i < 114; i++) {
            let box = document.createElement("div")
            box.className = "box"
            box.dataset.index = i;
            boxs.appendChild(box)
            let boxH2 = document.createElement("h2")
            let boxH4 = document.createElement("h4")
            boxH2.appendChild(document.createTextNode(data.data.surahs.references[i].name))
            boxH4.appendChild(document.createTextNode(data.data.surahs.references[i].englishName))
            box.appendChild(boxH2)
            box.appendChild(boxH4)
        }
        let allboxs = document.querySelectorAll(".box")
        let open = document.querySelector(".open")
        allboxs.forEach(box => {
            box.onclick = () => {
                popup.style.left = 0;
                for (let i = 0; i < 114; i++) {
                    if (parseInt(box.dataset.index) == i) {
                        fetch( `https://api.alquran.cloud/v1/surah/${i+1}`)
                        .then((response) => response.json())
                        .then((data) => {
                            let len = data.data.ayahs.length
                            for(let ind = 0; ind < len; ind++){
                                document.querySelector(".quran .data").innerHTML += `<p>${data.data.ayahs[ind].text}</p>${ind+1}`
                            }
                            fetch('data.json')
                            .then((response) => response.json())
                            .then((data) => {
                                open.onclick = () => {
                                    let current = 0;
                                    let audio = document.querySelector("audio")
                                    audio.src = data.data.surahs[i].ayahs[current].audio;
                                    audio.play()
                                    for(let indexo = 0; indexo < len; indexo++){
                                        document.querySelectorAll(".quran p")[current].classList.add("active")
                                    audio.onended = () => {
                                        current++
                                        current == 1 ? document.querySelectorAll(".quran p")[current-1].classList.remove("active") :
                                        document.querySelectorAll(".quran p").forEach(p => p.classList.remove("active"))
                                        document.querySelectorAll(".quran p")[current].classList.add("active")
                                        document.querySelectorAll(".quran p")[current].scrollIntoView({behavior: "smooth", block: "nearest"})
                                        audio.src = data.data.surahs[i].ayahs[current].audio;
                                        audio.play()
                                        if (current+1 == len) {
                                            document.querySelectorAll(".quran p")[current - 1].classList.remove("active")
                                            current = 0-1;
                                        }
                                    }
                                }
                                }
                            });
                        });
                    }
                }
            }
        })
    })
}
getQuran()
document.querySelector(".close").onclick = () => {
    document.querySelector(".quran .data").innerHTML = ""
    document.querySelector("audio").pause();
    document.querySelector(".popup").style.left = "100%"
}

let getRandomAya = () => {
    let randomNumfor = Math.floor(Math.random() * 114);
    fetch(`https://api.alquran.cloud/v1/surah/${randomNumfor}`)
    .then((response) => response.json())
    .then((data) => {
        let lengthOfTheSora = data.data.ayahs.length;
        document.querySelectorAll(".random").forEach(sec => {
            let randomNum = Math.floor(Math.random() * lengthOfTheSora);
            sec.innerHTML = `<div class="para">${data.data.ayahs[randomNum].text}</div>`
            setInterval(() => {
                randomNum =  Math.floor(Math.random() * lengthOfTheSora);
                sec.innerHTML = `<div class="para">${data.data.ayahs[randomNum].text}</div>`
            }, 8000)
        })
    });
}
getRandomAya()

function getHadith() {
    fetch('azkar.json')
    .then((response) => response.json())
    .then((data) => {
        let tabs = document.querySelectorAll(".azkar .tab")
        let contentBoxs = document.querySelector(".azkar .boxs")
        tabs.forEach(tb => tb.dataset.cat == "أذكار الصباح" ? tb.classList.add("activeTab") : "")
        for(let i = 0; i < 61; i++) {
            if (data[i].category == "أذكار الصباح") {
                contentBoxs.innerHTML += 
                `<div class="boxA">
                    <p>${data[i].zekr}</p>
                    <div class"info">
                    <h4>${data[i].description}</h4>
                    <h5>count: <span>${data[i].count}</span></h5>
                    </div>
                </div>`
            }
        }
        tabs.forEach(tab => {
            tab.onclick = () => {
                tabs.forEach(tb => tb.classList.remove("activeTab"))
                tab.classList.add("activeTab")
                contentBoxs.innerHTML = ``
                for(let i = 0; i < 61; i++) {
                    if (data[i].category == tab.dataset.cat) {
                        contentBoxs.innerHTML += 
                        `<div class="boxA">
                            <p>${data[i].zekr}</p>
                            <div class"info">
                            <h4>${data[i].description}</h4>
                            <h5>count: <span>${data[i].count}</span></h5>
                            </div>
                        </div>`
                    }
                }
                }
            })
    });
}
getHadith()

function scrolling(onClicking, scrollingTo) {
    document.querySelector(onClicking).onclick = () => {
        document.querySelector(scrollingTo).scrollIntoView()
    }
}
scrolling("header .btns button:first-child", "section.quran")
scrolling("header .btns button:last-child", "section.azkar")

window.onscroll = () => {
    if (window.scrollY >= 300) {
        document.querySelector("nav").classList.add("active")
        document.querySelector(".smLinks").classList.add("activeWhenScroll")
        document.querySelector(".topBtn").classList.add("op1")
    } else {
        document.querySelector("nav").classList.remove("active")
        document.querySelector(".smLinks").classList.remove("activeWhenScroll")
        document.querySelector(".topBtn").classList.remove("op1")
    }
}
function getTime() {
    fetch('https://api.aladhan.com/v1/timingsByAddress?address=Egypt,%20UK&method=99&methodSettings=18.5,null,17.5&tune=1,2,3,4,5')
    .then((response) => response.json())
    .then((data) => {
        for (let i = 0; i < Object.keys(data.data.timings).length; i++) {
            document.querySelector(".boxsPray").innerHTML += 
            `
            <div class="boxPray">
                <h3>${Object.keys(data.data.timings)[i]}</h3>
                <small>${Object.values(data.data.timings)[i]}</small>
            </div>
            `
        }
    });
}
getTime()

document.querySelector(".toggle").onclick = () => {
    document.querySelector(".toggle").classList.toggle("active")
    document.querySelector(".smLinks").classList.toggle("active")
}
let ND = new Date;
document.querySelector(".date").innerHTML = ND.getFullYear();

document.querySelector(".topBtn").onclick = () => {
    scrollTo({top: 0})
}