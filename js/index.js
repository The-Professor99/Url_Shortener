async function getShortLink(input) {
    try {
        const res = await fetch('https://cors-anywhere.herokuapp.com/https://cleanuri.com/api/v1/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `url=${encodeURI(input)}`
        });
        const resultJson = await res.json();
        return resultJson["result_url"]
    } catch (err) {
        return console.error('Oops,failed to fetch', err);
    }
}

function displayLink(longLink, shortLink) {
    const generatedBox = document.createElement("div");
    generatedBox.className = "generated-box row container";
    generatedBox.innerHTML = `
    <div class="main-link col-lg-6">
        <p><a href="${longLink}">${longLink}</a></p>   
    </div>
    <hr>
    <div class="short-link col-lg-6">
        <p class="d-inline-block col-lg"><a href="${shortLink}" target="_blank" class="shortLink">${shortLink}</a></p>
        <button class="btn btn-block col-lg copy">Copy</button>
    </div>
    `;
    const boxParent = document.querySelector(".container-fluid.container-2");
    const nextSibling = document.querySelector("section.cards-container");
    boxParent.insertBefore(generatedBox, nextSibling);
}

function setCopy() {
    const parent = document.querySelector(".container-fluid.container-2");
    parent.addEventListener("click", function(e) {
        if(e.target.className === "btn btn-block col-lg copy") {
            let textCopy = e.target.previousSibling.previousSibling.textContent;
            copyTextToClipboard(textCopy);
            e.target.className = "btn btn-block col-lg copied";
            e.target.innerHTML = "Copied";
        }
    })
}

function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Avoid scrolling to  bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
  
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
  
    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
  
    document.body.removeChild(textArea);
}

function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(function() {
      console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
      console.error('Async: Could not copy text: ', err);
    });
}

function removeLoader() {
    document.getElementById('loading').style.display = "none";
}

function validatedInput() {
    const inputTag = document.getElementById("formGroupExampleInput");
    let validateMessage = document.getElementById("validateMessage");
    if (inputTag.checkValidity() == false) {
        validateMessage.style.visibility = "visible";
        return undefined
    } else {
        validateMessage.style.visibility = "hidden";
        let input = inputTag.value;
        if(!input.includes("http")){
            input = `https://${input}`
        } 
        return input
    } 
}

async function ctrlApp(input) {
    shortLink = await getShortLink(input);
    removeLoader();
    if(shortLink) {
        displayLink(input, shortLink);
        setCopy()
    } else {
        alert("Failed to fetch, Check Network connection and try again?");
        console.log("No link returned")
    }
}

document.getElementById('url-form').addEventListener('submit', function(e){
    const input = validatedInput();
    if (input) {
        document.getElementById('loading').style.display = 'flex';
        ctrlApp(input)
    }

    e.preventDefault()
})

