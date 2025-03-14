let responses = [];

document.addEventListener("DOMContentLoaded", () => {
    fetchNextQuestion();
});

function fetchNextQuestion() {
    fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses })
    })
    .then(response => response.json())
    .then(data => {
        if (data.question) {
            addMessage("Bot", data.question);
        } else if (data.recommendation) {
            addMessage("Bot", `Based on your answers, you should try: ${data.recommendation}`);
        }
    });
}

function sendMessage() {
    let inputField = document.getElementById("user-input");
    let userInput = inputField.value.trim();

    if (userInput) {
        addMessage("You", userInput);
        responses.push(userInput);
        inputField.value = "";
        fetchNextQuestion();
    }
}

function addMessage(sender, message) {
    let chatBox = document.getElementById("chat-box");
    let messageElement = document.createElement("p");
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}
