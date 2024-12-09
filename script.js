document.addEventListener("DOMContentLoaded", () => {
    console.log("Script JS carregado corretamente."); // Teste básico

    const form = document.getElementById("rsvpForm");
    const attendanceSelect = document.getElementById("attendance");
    const accompanimentField = document.getElementById("accompanimentField");
    const submitButton = document.getElementById("submitButton"); // ID correto

    // URL do Google Apps Script
    const scriptURL = "https://script.google.com/macros/s/AKfycbwmJnpGC0aSqTjg4scu8k0_Ru5d6RmHRyNBKhnqdSrpwsFnPBW4BIdEdUUfikFiHRXf/exec";

    // Mostra/esconde o campo de acompanhantes com base na escolha
    attendanceSelect.addEventListener("change", () => {
        accompanimentField.style.display = attendanceSelect.value === "Sim" ? "block" : "none";
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Impede o envio do formulário

        // Desabilita o botão para evitar múltiplos envios
        submitButton.disabled = true;
        submitButton.innerText = "Enviando...";

        const name = document.getElementById("name").value.trim();
        const attendance = document.getElementById("attendance").value;
        const accompaniments = document.getElementById("accompaniments").value || "0"; // "0" se vazio

        // Verificar se os campos obrigatórios estão preenchidos
        if (!name || !attendance) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            submitButton.disabled = false; // Reativa o botão
            submitButton.innerText = "Enviar";
            return;
        }

        // Mensagem imediata para o usuário
        let message = "";
        if (attendance === "Sim") {
            message = `Obrigado, ${name}, por confirmar sua presença! Estamos ansiosos para te ver!`;
            if (accompaniments > 0) {
                message += ` Você estará acompanhado(a) de ${accompaniments} pessoa(s).`;
            }
        } else if (attendance === "Não") {
            message = `Que pena que você não virá ${name}. Sentiremos sua falta!`;
        }

        alert("Enviando sua resposta, clique em 'OK' e aguarde a confirmação ...");

        // Preparando os dados para envio
        const formData = new URLSearchParams({
            name,
            attendance,
            accompaniments
        });

        try {
            // Envia os dados via POST para o Google Apps Script
            const response = await fetch(scriptURL, {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error("Falha no envio dos dados.");
            }

            // Exibe a resposta do servidor
            const result = await response.text();
            alert(result + "\n\n" + message);
        } catch (error) {
            alert("Erro ao salvar os dados. Tente novamente mais tarde.");
            console.error("Erro:", error);
        } finally {
            // Reativa o botão após o envio (ou erro)
            submitButton.disabled = false;
            submitButton.innerText = "Enviar";

            // Limpa os campos do formulário
            form.reset();
            accompanimentField.style.display = "none"; // Esconde o campo de acompanhantes, se necessário
        }
    });
});
