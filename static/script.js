function get_model(){
    return document.getElementById("model").value;
}

function glow(on){
    textarea_box = document.getElementById("textarea-box");
    if (on){
        textarea_box.style.animationName = "glow";
        return;
    }
    textarea_box.style.animationName = "none";
}

async function ask(to, task="", text="") {
    model = get_model();
    const response = await fetch(to, {
        method: 'POST',
        body: JSON.stringify({"task": task, "text": text, "model": model}),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.json();
}


function other_info_visibility(){
    document.getElementById('other-info').style.visibility = "visible";
}

function showAlert(description) {
    const overlay = document.createElement('div');
    overlay.className = 'alert-overlay';

    const alertBox = document.createElement('div');
    alertBox.className = 'alert-box';

    const header = document.createElement('div');
    header.className = 'alert-header';

    const title = document.createElement('h2');
    title.className = 'alert-title';
    title.textContent = 'You are cooked.';

    const closeButton = document.createElement('button');
    closeButton.className = 'alert-close';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = () => {
        document.body.removeChild(overlay);
    };

    const content = document.createElement('div');
    content.className = 'alert-content';
    content.innerHTML = description;

    header.appendChild(title);
    header.appendChild(closeButton);
    alertBox.appendChild(header);
    alertBox.appendChild(content);
    overlay.appendChild(alertBox);

    document.body.appendChild(overlay);
}


async function rewrite(task){
    glow(true)
    const textarea = document.getElementById('textbox');
    const time_box = document.getElementById('timebox')
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const selectedText = textarea.value.substring(start, end);

    if (selectedText === ""){
        showAlert("You think that giving a blank prompt will break the AI? Resource wasting human.<br>A prompt injection sure will though :3")
        return;
    }

    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(end);

    data = await ask("/rewrite", task, selectedText);

    if (data.hasOwnProperty("err")) {
        showAlert(data.err)
        return;
    }

    // Edit the text area such that the selection is replaced
    let receivedString = data.response;
    let time_taken = data.time;
    textarea.value = before + receivedString + after;
    textarea.focus();
    textarea.setSelectionRange(start, start + receivedString.length);

    time_box.innerHTML = 'rewrote in <b>' + time_taken + 's</b>';
    
    other_info_visibility();
    glow(false)
}

async function summarize(){
    glow(true)
    const textarea = document.getElementById('textbox');
    const time_box = document.getElementById('timebox')
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const selectedText = textarea.value.substring(start, end);
    
    if (selectedText === ""){
        showAlert("Why must you waste resources by giving a blank message?<br>You are the reason we can't have good things, you know!")
        return;
    }

    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(end);

    data = await ask("/summarize", "ToDo", selectedText);

    if (data.hasOwnProperty("err")) {
        showAlert(data.err)
        return;
    }

    let receivedString = data.response;
    let time_taken = data.time;
    textarea.value = before + receivedString + after;
    textarea.focus();
    textarea.setSelectionRange(start, start + receivedString.length);

    time_box.innerHTML = 'summarized in <b>' + time_taken + 's</b>';
    
    other_info_visibility();
    glow(false)
}

async function random(){
    glow(true)
    const textarea = document.getElementById('textbox');
    
    if (textarea.value !== ""){
        return;
    }
    const time_box = document.getElementById('timebox')

    data = await ask("/random")
    time_taken = data.time;

    if (data.hasOwnProperty("err")) {
        showAlert(data.err)
        return;
    }

    textarea.value = data.response;
    textarea.focus();

    time_box.innerHTML = 'randomized in <b>' + time_taken + 's</b>';
    
    other_info_visibility();
    glow(false)
}

document.addEventListener("keydown", e =>{
    if (e.key.toLowerCase() == "s" && e.ctrlKey) {
        e.preventDefault();
        summarize();
    }
    else if (e.key.toLowerCase() == "q" && e.ctrlKey) {
        e.preventDefault();
        rewrite("professional");
    }
    else if (e.key.toLowerCase() == "e" && e.ctrlKey){
        e.preventDefault();
        rewrite("casual");
    }
    else if (e.key.toLowerCase() == "m" && e.ctrlKey){
        e.preventDefault();
        random();
    }
    else if (e.key.toLowerCase() == "c" && e.ctrlKey && e.shiftKey){
        e.preventDefault();
        other_info_visibility();
    }
})
