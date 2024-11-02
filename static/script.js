
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


function rewrite(task){
    const textarea = document.getElementById('textbox');
    const other_info = document.getElementById('other-info')
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

    fetch('/rewrite', {
        method: 'POST',
        body: JSON.stringify({"task": task, "text": selectedText}),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        let receivedString = data.response;
        let time_taken = data.time;
        textarea.value = before + receivedString + after;
        textarea.focus();
        textarea.setSelectionRange(start, start + receivedString.length);

        time_box.innerHTML = 'rewrote in <b>' + time_taken + 's</b>';
        
        other_info.style.visibility = "visible";
    });
}

function summarize(){
    const textarea = document.getElementById('textbox');
    const other_info = document.getElementById('other-info')
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

    fetch('/summarize', {
        method: 'POST',
        body: JSON.stringify({"text": selectedText}),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        let receivedString = data.response;
        let time_taken = data.time;
        textarea.value = before + receivedString + after;
        textarea.focus();
        textarea.setSelectionRange(start, start + receivedString.length);

        time_box.innerHTML = 'summarized in <b>' + time_taken + 's</b>';
        
        other_info.style.visibility = "visible";
    });
}

function random(){
    const textarea = document.getElementById('textbox');
    
    if (textarea.value !== ""){
        return;
    }
    const other_info = document.getElementById('other-info')
    const time_box = document.getElementById('timebox')

    fetch('/random', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        textarea.value = data.response;
        other_info.style.visibility = "visible";
        time_box.innerHTML = "randomized in <b>" + data.time + "s</b>";
    })
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
})
