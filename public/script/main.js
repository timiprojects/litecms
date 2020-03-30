import useFetch from './api.js';

const inlineSnack = document.querySelector('[data-name="snack"]')
const Items = document.querySelector('[data-name="lists"]')

const oldItems = JSON.parse(localStorage.getItem('urls')) || []
let interval = ""

window.onload = () => {
    document.shorturl.longurl.focus()
}

function clearStorage() {
    //wait one day from now
    clearInterval(interval)
    if(localStorage.length > 0){
        interval = setInterval(() => {
            localStorage.clear()
            //console.count("clicked")
        }, 1000 * 60 * 60 * 24 * 1)
    }
}

;(function() {
    //localStorage.clear()
    displayItems(oldItems)
    //clearStorage()
})()

function displayItems(items,comp=null){
    Items.innerHTML = ""
    if(items) {
        items.forEach(item => {
            //console.log(item)
            // if(comp === item.longLink)
            //     return;
            return (item) ? Items.innerHTML += `
            <li class="item">
            <p class="item-longurl">${item["longLink"]}</p>
            <a href="${item.shortLink}" target="_blank" class="item-shorturl">${item.shortLink}</a>
            </li>
            ` : Items.innerHTML = `<li class="item"><p class="item-longurl">No links available</p></li>`
        })
    }
}


document.shorturl.addEventListener("submit", async function(e){
    e.preventDefault()
    const _data = {
        longUrl: document.shorturl.longurl.value
    }
    const fetchData = useFetch('/link/shorten', 'post')

    const { response } = await fetchData({data: _data})
    if(response) {
        const { status, message, data } = response
        simpleSnackbar(message, status)
        oldItems.unshift(data)
        localStorage.setItem("urls", JSON.stringify(oldItems))
        displayItems(oldItems,data.longLink)
    }
})

//simple javascript snackbar
function simpleSnackbar(message, status) {
    let div = document.createElement("div")
    div.className = `snackbar snackbar-${status}`
    let p = document.createElement("p")
    p.className = "snackbar-text"
    p.textContent = message
    div.appendChild(p)

    inlineSnack.appendChild(div)

    setTimeout(() => {
        div.style.setProperty("direction", "reverse")
        inlineSnack.removeChild(div)
    }, 5000)
}

