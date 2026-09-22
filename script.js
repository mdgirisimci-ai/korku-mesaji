let stream;
let seconds = 5 * 60 * 60;
let userPhone = "";

function show(id) {
    document.querySelectorAll(".screen section").forEach(x => {
        x.classList.add("hidden");
    });

    document.getElementById(id).classList.remove("hidden");
}

function phoneStep() {
    userPhone = document.getElementById("phone").value.trim();

    if (userPhone.length < 10) {
        alert("Geçerli bir telefon numarası gir.");
        return;
    }

    show("confirm");
}

async function cameraStep() {
    try {
        const response = await fetch("http://localhost:3000/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                phone: userPhone,
                communicationConsent: true
            })
        });

        const result = await response.json();

        if (!result.success) {
            alert(result.message);
            return;
        }

        show("camera");

        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "user"
            },
            audio: false
        });

        document.getElementById("video").srcObject = stream;

    } catch (error) {
        console.error(error);
        alert("Sunucuya bağlanılamadı veya kamera izni verilmedi.");
    }
}

function takePhoto() {
    const video = document.getElementById("video");

    if (!stream) {
        alert("Önce kamera izni vermelisin.");
        return;
    }

    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvas.getContext("2d").drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );

    const image = canvas.toDataURL("image/jpeg");

    document.getElementById("photoBox").innerHTML =
        `<img src="${image}" alt="Kamera görüntüsü">`;

    stream.getTracks().forEach(track => track.stop());

    show("countdown");

    startCountdown();
    horrorEffects();
}

function startCountdown() {
    updateTimer();

    setInterval(() => {
        if (seconds > 0) {
            seconds--;
            updateTimer();
        }
    }, 1000);
}

function updateTimer() {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    document.getElementById("timer").textContent =
        `${String(h).padStart(2, "0")}:` +
        `${String(m).padStart(2, "0")}:` +
        `${String(s).padStart(2, "0")}`;
}

function horrorEffects() {
    const messages = [
        "Süren başladı.",
        "Bizi bekletme...",
        "Hâlâ buradasın.",
        "Saat ilerliyor.",
        "Geri dönüş yok."
    ];

    setInterval(() => {
        const text = document.getElementById("scareText");

        text.textContent =
            messages[Math.floor(Math.random() * messages.length)];

        document.getElementById("message").classList.add("glitch");

        setTimeout(() => {
            document.getElementById("message")
                .classList.remove("glitch");
        }, 500);

    }, 7000);
}