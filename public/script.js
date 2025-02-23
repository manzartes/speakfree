document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chat-box");
  const userInput = document.getElementById("user-input");

  window.sendMessage = async () => {
      const message = userInput.value.trim();
      if (!message) return;

      // Exibir mensagem do usuário
      displayMessage("Você", message, "user");

      // Limpar o campo de texto
      userInput.value = "";

      // Mostrar indicador de "Digitando..."
      displayTypingIndicator(true);

      try {
          const response = await fetch("http://localhost:3000/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ message }),
          });

          const data = await response.json();
          let aiResponse = data.response;

          // Adicionar ocasionalmente "Fale-me mais sobre isso"
          if (Math.random() < 0.3) {
              aiResponse += " Fale-me mais sobre isso.";
          }

          displayMessage("Terapeuta", aiResponse, "ai");
      } catch (error) {
          displayMessage("Erro", "Ocorreu um problema ao processar a resposta.", "ai");
      } finally {
          displayTypingIndicator(false);
      }
  };

  function displayMessage(sender, text, senderType) {
      const msgElement = document.createElement("div");
      msgElement.classList.add("message", senderType);
      msgElement.innerHTML = `<strong>${sender}:</strong> ${text}`;
      chatBox.appendChild(msgElement);
      chatBox.scrollTop = chatBox.scrollHeight;
  }

  function displayTypingIndicator(show) {
      let typingIndicator = document.getElementById("typing-indicator");
      if (show) {
          if (!typingIndicator) {
              typingIndicator = document.createElement("div");
              typingIndicator.id = "typing-indicator";
              typingIndicator.classList.add("message", "ai");
              typingIndicator.innerHTML = `<em>Terapeuta está digitando...</em>`;
              chatBox.appendChild(typingIndicator);
              chatBox.scrollTop = chatBox.scrollHeight;
          }
      } else {
          if (typingIndicator) {
              typingIndicator.remove();
          }
      }
  }

  userInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
          e.preventDefault();
          sendMessage();
      }
  });
});
