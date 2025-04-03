document.addEventListener("DOMContentLoaded", function () {
    const sendButton = document.getElementById('send-btn');
    const input = document.getElementById('input');
    const chatBox = document.getElementById('chat-box');
    const endpoint = "http://localhost:3000/chat";

    sendButton.addEventListener('click', sendMessage);
    input.addEventListener("keypress", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });

    async function sendMessage() {
        const userInput = input.value.trim();
        if (!userInput) {
            alert("Vui lòng nhập câu hỏi.");
            return;
        }

        appendMessage(userInput, 'user');
        input.value = '';

        const loadingMessage = appendMessage("AI đang trả lời...", 'ai');

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userInput })
            });
            const result = await response.json();
            chatBox.removeChild(loadingMessage);
            
            if (!response.ok || !result.candidates || result.candidates.length === 0) {
                throw new Error("Không có phản hồi từ AI.");
            }
            
            let aiResponse = result.candidates[0].content.parts[0].text || "❌ Không có phản hồi từ AI.";
            aiResponse = aiResponse.replace(/\n/g, "<br>");
            appendMessage(aiResponse, 'ai', true);
        } catch (error) {
            console.error("Lỗi kết nối:", error);
            chatBox.removeChild(loadingMessage);
            appendMessage(`⚠️ Lỗi kết nối: ${error.message}`, 'ai', true);
        }
    }

    function appendMessage(text, sender, isHTML = false) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        
        if (isHTML) {
            messageElement.innerHTML = text;
        } else {
            messageElement.textContent = text;
        }

        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
        return messageElement;
    }
});