function showShellInput(){
    let input = document.createElement('input');
    input.id = 'shellInput';
    input.style.backgroundColor = 'rgba(0,0,0,0.7)';
    input.style.color = 'lightgreen';
    input.style.position = 'fixed';
    input.style.bottom = '0';
    input.style.width = '100%';
    input.style.height = '200px';
    input.style.zIndex = '9999';
    input.style.fontSize = '32px';
    input.style.fontWeight = 'bold';
    input.style.textAlign = 'center';
    input.setAttribute('autocomplete', 'off');
    document.body.appendChild(input);
}

showShellInput();

var globalCommand = '/* I start by visiting ' + window.location.href + ', and incrementally modify it via <script> injection. Written for Chrome. */\n/* COMMAND: Add "Hello World", by adding an HTML DOM node */\nvar helloWorld = document.createElement(\'div\');\nhelloWorld.innerHTML = \'Hello World\';\ndocument.body.appendChild(helloWorld);\n/* COMMAND: remove the previous added child */\ndocument.body.removeChild(helloWorld);\n';

function requestAPI(prompt){
    if(prompt === ''){
        return;
    }
    prompt = '/* COMMAND: ' + prompt + ' */\n';
    globalCommand += prompt;
    let url = 'https://api.openai.com/v1/engines/davinci-codex/completions';
    let params = {
        prompt: globalCommand,
        temperature: 0,
        max_tokens: 1000,
        stop: '/* COMMAND:',
    };
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + '<USE-YOUR-OWN-API-TOKEN>'
        },
        body: JSON.stringify(params)
    };
    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            let output = data.choices[0].text;
            output = output.split('\n');
            output.pop();
            output = output.join('\n');
            eval(output);
            globalCommand += output + '\n';
        })
        .catch(error => console.log(error));
}

document.getElementById('shellInput').addEventListener('keyup', function(event){
    if(event.keyCode === 13){
        requestAPI(this.value);
        this.value = '';
    }
});