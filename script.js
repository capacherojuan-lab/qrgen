const typeButtons = document.querySelectorAll(".type-btn");
const forms = document.querySelectorAll(".form-section");

const generateBtn = document.getElementById("generateBtn");
const qrResult = document.getElementById("qrResult");
const qrcodeDiv = document.getElementById("qrcode");
const downloadBtn = document.getElementById("downloadBtn");
const message = document.getElementById("message");

let currentType = "url";

// CAMBIAR TIPO DE QR
typeButtons.forEach(button => {
    button.addEventListener("click", () => {

        typeButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentType = button.dataset.type;

        forms.forEach(form => {
            form.classList.remove("active");
        });

        const selectedForm = document.getElementById(
            currentType + "Form"
        );

        if (selectedForm) {
            selectedForm.classList.add("active");
        }

        qrResult.style.display = "none";
        qrcodeDiv.innerHTML = "";
        message.textContent = "";
    });
});


// GENERAR QR
generateBtn.addEventListener("click", () => {

    let qrData = "";

    message.textContent = "";

    // URL
    if (currentType === "url") {

        const url = document
            .getElementById("urlInput")
            .value
            .trim();

        if (!url) {
            showError("Escribe un enlace.");
            return;
        }

        qrData = url;
    }


    // WHATSAPP
    if (currentType === "whatsapp") {

        const phone = document
            .getElementById("phoneInput")
            .value
            .trim();

        const whatsappMessage = document
            .getElementById("whatsappMessage")
            .value
            .trim();

        if (!phone) {
            showError("Escribe un número de WhatsApp.");
            return;
        }

        const cleanPhone = phone.replace(/\D/g, "");

        if (cleanPhone.length < 7) {
            showError("Escribe un número de teléfono válido.");
            return;
        }

        qrData = "https://wa.me/" + cleanPhone;

        if (whatsappMessage) {
            qrData += "?text=" + encodeURIComponent(whatsappMessage);
        }
    }


    // WIFI
    if (currentType === "wifi") {

        const name = document
            .getElementById("wifiName")
            .value
            .trim();

        const password = document
            .getElementById("wifiPassword")
            .value
            .trim();

        const security = document
            .getElementById("wifiSecurity")
            .value;

        if (!name) {
            showError("Escribe el nombre de la red WiFi.");
            return;
        }

        qrData =
            "WIFI:T:" +
            security +
            ";S:" +
            escapeWifi(name) +
            ";P:" +
            escapeWifi(password) +
            ";;";
    }


    // EMAIL
    if (currentType === "email") {

        const email = document
            .getElementById("emailInput")
            .value
            .trim();

        const subject = document
            .getElementById("emailSubject")
            .value
            .trim();

        const body = document
            .getElementById("emailBody")
            .value
            .trim();

        if (!email) {
            showError("Escribe un correo electrónico.");
            return;
        }

        qrData = "mailto:" + email;

        const params = [];

        if (subject) {
            params.push("subject=" + encodeURIComponent(subject));
        }

        if (body) {
            params.push("body=" + encodeURIComponent(body));
        }

        if (params.length > 0) {
            qrData += "?" + params.join("&");
        }
    }


    // TEXTO
    if (currentType === "text") {

        const text = document
            .getElementById("textInput")
            .value
            .trim();

        if (!text) {
            showError("Escribe algún texto.");
            return;
        }

        qrData = text;
    }


    // CREAR QR
    qrcodeDiv.innerHTML = "";

    try {

        const qrColor = document.getElementById("qrColor").value;
const qrBackground = document.getElementById("qrBackground").value;

new QRCode(qrcodeDiv, {
    text: qrData,
    width: 250,
    height: 250,
    colorDark: qrColor,
    colorLight: qrBackground,
    correctLevel: QRCode.CorrectLevel.H
});

        qrResult.style.display = "block";

        message.style.color = "#16a34a";
        message.textContent =
            "¡Código QR creado correctamente!";

        qrResult.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    } catch (error) {

        showError("No se pudo crear el código QR.");

        console.error(error);
    }
});


// DESCARGAR QR
downloadBtn.addEventListener("click", () => {

    const canvas = qrcodeDiv.querySelector("canvas");
    const img = qrcodeDiv.querySelector("img");

    let imageURL = "";

    if (canvas) {
        imageURL = canvas.toDataURL("image/png");
    } else if (img) {
        imageURL = img.src;
    }

    if (!imageURL) {
        showError("Primero genera un código QR.");
        return;
    }

    const link = document.createElement("a");

    link.href = imageURL;
    link.download = "mi-codigo-qr.png";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
});


// MENSAJE DE ERROR
function showError(text) {

    message.style.color = "#dc2626";
    message.textContent = text;
}


// ESCAPAR CARACTERES WIFI
function escapeWifi(text) {

    return text
        .replace(/\\/g, "\\\\")
        .replace(/;/g, "\\;")
        .replace(/,/g, "\\,")
        .replace(/:/g, "\\:");
}
        
