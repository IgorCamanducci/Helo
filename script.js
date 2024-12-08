document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("rsvpForm");
    const attendanceSelect = document.getElementById("attendance");
    const accompanimentField = document.getElementById("accompanimentField");

    // URL do Google Apps Script
    const scriptURL = "https://script.google.com/macros/s/AKfycbwmJnpGC0aSqTjg4scu8k0_Ru5d6RmHRyNBKhnqdSrpwsFnPBW4BIdEdUUfikFiHRXf/exec"; 

    // Mostra/esconde o campo de acompanhantes com base na escolha
    attendanceSelect.addEventListener("change", () => {
        accompanimentField.style.display = attendanceSelect.value === "Sim" ? "block" : "none";
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Impede o envio do formulário
        
        const name = document.getElementById("name").value.trim();
        const attendance = document.getElementById("attendance").value;
        const accompaniments = document.getElementById("accompaniments").value || "0"; // "0" se vazio

        // Verificar se os campos obrigatórios estão preenchidos
        if (!name || !attendance) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        // Mensagem imediata para o usuário
        let message = "";
        if (attendance === "Sim") {
            message = `Obrigado, ${name}, por confirmar sua presença! Estamos ansiosos para te ver!`;
            if (accompaniments > 0) {
                message += ` Você está acompanhado(a) de ${accompaniments} pessoa(s).`;
            }
        } else if (attendance === "Não") {
            message = `Que pena, ${name}, que você não poderá vir. Sentiremos sua falta!`;
        }

        alert("Enviando sua resposta...");

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

            // Exibe a resposta do servidor (mensagem de confirmação)
            const result = await response.text();

            // Exibe a resposta do servidor e a mensagem de confirmação
            alert(result + "\n\n" + message); // Pop-up com resposta imediata

        } catch (error) {
            alert("Erro ao salvar os dados. Tente novamente mais tarde.");
            console.error("Erro:", error);
        }
    });
});
