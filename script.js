document.addEventListener("DOMContentLoaded", function () {
    const sendButton = document.getElementById('send-btn');
    const input = document.getElementById('input');
    const chatBox = document.getElementById('chat-box');

    sendButton.addEventListener('click', async function () {
        const userInput = input.value.trim();
        
        if (!userInput) {
            alert("Vui lòng nhập câu hỏi.");
            return;
        }

        // Hiển thị tin nhắn của người dùng
        appendMessage(userInput, 'user');
        input.value = '';

        // Hiển thị tin nhắn tạm thời "AI đang trả lời..."
        const loadingMessage = appendMessage("AI đang trả lời...", 'ai');

        // Gửi yêu cầu tới Gemini API
        const apiKey = "AIzaSyBdMdoRPvwLvMnztr13CcU3hzbZo-MA6D8";
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
        
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: userInput }] }]
                })
            });

            const result = await response.json();
            console.log(result); // Kiểm tra phản hồi từ API

            if (!response.ok || !result.candidates || result.candidates.length === 0) {
                throw new Error("Không có phản hồi từ AI.");
            }

            let aiResponse = result.candidates[0].content.parts[0].text || "❌ Không có phản hồi từ AI.";
            
            // Chuyển đổi xuống dòng thành thẻ <br>
            aiResponse = aiResponse.replace(/\n/g, "<br>");

            // Xóa dòng "AI đang trả lời..."
            chatBox.removeChild(loadingMessage);

            // Hiển thị phản hồi từ AI với format đẹp
            appendMessage(aiResponse, 'ai', true);

        } catch (error) {
            console.error("Lỗi kết nối:", error);

            // Xóa dòng "AI đang trả lời..."
            chatBox.removeChild(loadingMessage);

            appendMessage(`⚠️ Lỗi kết nối: ${error.message}`, 'ai', true);
        }
    });

    function appendMessage(text, sender, isHTML = false) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        
        if (isHTML) {
            messageElement.innerHTML = text; // Giữ format HTML
        } else {
            messageElement.textContent = text; // Hiển thị bình thường
        }

        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
        return messageElement;
    }
});
