const input = document.querySelector("input");
const button = document.querySelector("button");
const messages = document.querySelector(".messages");

button.onclick = async function() {

    let text = input.value.trim();

    if (text === "") return;

    messages.innerHTML += `
    <div class="message user">${text}</div>
    `;

    input.value = "";

    messages.innerHTML += `
    <div class="message ai">Nebula AI is thinking...</div>
    `;

    setTimeout(() => {
         fetch("/chat", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        message: text
    })
})
.then(response => response.json())
.then(data => {

    let aiBox = document.createElement("div");
    aiBox.className = "message ai";
    messages.appendChild(aiBox);

    let i = 0;

    let typing = setInterval(() => {
        aiBox.innerHTML += data.reply.charAt(i);
        i++;

        if (i >= data.reply.length) {
            clearInterval(typing);
        }

    }, 50);

});

}, 1000);

};
