
const $ = (id) => document.getElementById(id);

// Elements
const amountInput = $("amount");
const withdrawBtn = $("withdrawBtn");

const processingModal = $("processingModal");
const processingMessages = $("processingMessages");
const resultModal = $("resultModal");
const resultContent = $("resultContent");
const cameraModal = $("cameraModal");
const fateModal = $("fateModal");
const secretModal = $("secretModal");

// Audio files
const sounds = {
    dhan: "assets/dhan-rashi.mp3",
    aukat: "assets/aukat-mai.mp3",
    song: "assets/kun-faya-kun.mp3"
};

let cameraStream = null;
let fateCount = 0;

// Play audio
function playSound(file, loop = false) {
    const audio = new Audio(file);
    audio.loop = loop;

    audio.play().catch(error => {
        console.log("Audio playback needs user interaction:", error);
    });

    return audio;
}

// Modal helpers
function openModal(modal) {
    modal.classList.add("show");
}

function closeModal(modal) {
    modal.classList.remove("show");
}

// Processing messages
const messages = [
    "Connecting to younger brother's bank...",
    "Checking account balance...",
    "Seeking permission from Nirmala Tai...",
    "Checking sister's spending history..."
];

const sleep = (ms) =>
    new Promise(resolve => setTimeout(resolve, ms));

async function showProcessing() {
    processingMessages.innerHTML = "";
    openModal(processingModal);

    for (const message of messages) {
        const line = document.createElement("div");
        line.textContent = "⏳ " + message;

        processingMessages.appendChild(line);

        await sleep(1000);

        line.textContent = "✅ " + message;
    }

    await sleep(600);
    closeModal(processingModal);
}

// Main withdrawal handler
withdrawBtn.addEventListener("click", async () => {

    const amount = Number(amountInput.value);

    if (amountInput.value.trim() === "" || !Number.isFinite(amount) || amount < 0) {
        alert("Didi, valid amount toh enter karo! 😂");
        return;
    }

    withdrawBtn.disabled = true;

    try {
        await showProcessing();

        if (amount === 0) {
            showZeroResult();
        }

        else if (amount === 1) {
            showReceipt();
        }

        else if (amount <= 250) {
            showDidiResult();
        }

        else if (amount < 500) {
            showNetworkError();
        }

        else if (amount < 1000) {
            showBroResult();
        }

        else {
            await openCamera();
        }

    } finally {
        withdrawBtn.disabled = false;
    }
});

// ₹0 Result
function showZeroResult() {

    resultContent.innerHTML = `
        <div class="logo">🙏</div>
        <h2 class="result-title">Transaction Successful!</h2>
        <p class="result-text">
            Waah didi! Aaj toh aapne bhai ki izzat rakh li. 😂
        </p>
        <button class="action-btn" onclick="closeModal(resultModal)">
            Thank You, Bhai ❤️
        </button>
    `;

    openModal(resultModal);
}

// ₹1 Receipt
function showReceipt() {

    playSound(sounds.dhan);

    const reference =
        "BHAIDOOJ2026-" + Math.floor(100000 + Math.random() * 900000);

    const date = new Date().toLocaleString("en-IN");

    resultContent.innerHTML = `
        <div id="receiptContent">

            <div class="logo">🎉</div>

            <h2 class="result-title">Dhan Rashi Sent!</h2>

            <div class="receipt">

                <h3>💰 BHAI DOOJ RECEIPT</h3>

                <div class="receipt-success">
                    ✓ TRANSACTION SUCCESSFUL
                </div>

                <div class="receipt-row">
                    <span>Beneficiary</span>
                    <strong>Priye Didi</strong>
                </div>

                <div class="receipt-row">
                    <span>Sender</span>
                    <strong>Aapka Anuj</strong>
                </div>

                <div class="receipt-row">
                    <span>Amount</span>
                    <strong>₹1.00</strong>
                </div>

                <div class="receipt-row">
                    <span>Payment Mode</span>
                    <strong>Brother UPI Bank</strong>
                </div>

                <div class="receipt-row">
                    <span>Reference</span>
                    <strong>${reference}</strong>
                </div>

                <div class="receipt-row">
                    <span>Date</span>
                    <strong>${date}</strong>
                </div>

                <br>

                <p style="text-align:center">
                    Generous Dhan Rashi ❤️
                    <br>
                    Happy Bhai Dooj!
                </p>

            </div>
        </div>

        <button class="action-btn" onclick="window.print()">
            🖨️ Download / Print Receipt
        </button>

        <button class="secondary-btn" onclick="closeModal(resultModal)">
            Close
        </button>
    `;

    openModal(resultModal);
}

// ₹2–₹250
function showDidiResult() {

    resultContent.innerHTML = `
        <div class="logo">😂</div>

        <h2 class="result-title">Withdrawal Approved!</h2>

        <img src="assets/didi.jpg" alt="Didi reaction">

        <p class="result-text">
            Itni kaam umeed hai zindagi se!
        </p>

        <button class="action-btn" onclick="closeModal(resultModal)">
            Okay Bhai 😭
        </button>
    `;

    openModal(resultModal);
}

// ₹251–₹499
function showNetworkError() {

    resultContent.innerHTML = `
        <div class="logo">📡</div>

        <h2 style="color:#d32f2f">
            NETWORK ERROR!
        </h2>

        <p class="result-text">
            Unable to connect to younger brother's bank.
            <br><br>
            Please try again later.
        </p>

        <button class="action-btn"
            onclick="closeModal(resultModal)">
            Try Again
        </button>
    `;

    openModal(resultModal);
}

// ₹500–₹999
function showBroResult() {

    resultContent.innerHTML = `
        <div class="logo">😭</div>

        <h2 class="result-title">Financial Crisis!</h2>

        <img src="assets/bro.jpg" alt="Brother reaction">

        <p class="result-text">
            Didi, bhai ki financial condition samjho!
        </p>

        <button class="action-btn"
            onclick="closeModal(resultModal)">
            Sorry Bhai 😂
        </button>
    `;

    openModal(resultModal);

    playSound(sounds.song);
}

// ₹1000 and above
async function openCamera() {

    closeModal(resultModal);
    openModal(cameraModal);

    const video = $("cameraVideo");

    try {
        cameraStream =
            await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "user"
                },
                audio: false
            });

        video.srcObject = cameraStream;

    } catch (error) {

        console.error("Camera error:", error);

        video.style.display = "none";

        $("cameraDone").textContent = "Okay, samajh gaya! 😂";

        $("cameraCaption")?.remove();

        const errorMessage = document.createElement("p");
        errorMessage.textContent =
            "Camera permission nahi mili, lekin shakal verification phir bhi zaroori hai! 😂";

        errorMessage.style.color = "#c62828";

        video.parentElement.insertBefore(
            errorMessage,
            video
        );
    }

    playSound(sounds.aukat);
}

// Stop camera
function stopCamera() {

    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }

    $("cameraVideo").srcObject = null;
    $("cameraVideo").style.display = "block";

    closeModal(cameraModal);
}

$("closeCamera").addEventListener("click", stopCamera);
$("cameraDone").addEventListener("click", stopCamera);

// Fate button
$("fateBtn").addEventListener("click", () => {

    fateCount = 0;

    $("fateMessage").textContent =
        "Are you sure you have trust on your luck?";

    openModal(fateModal);
});

const fateMessages = [
    "Are you REALLY sure? Think again! 🤨",
    "Didi, luck pe itna bharosa? 😂",
    "Ek baar aur soch lo...",
    "Bhagwan bhi soch rahe hain! 🙏",
    "Last chance to save yourself!",
    "Aapko sach mein lagta hai luck saath dega?",
    "Bhai ki taraf se warning hai! ⚠️",
    "ARE YOU ABSOLUTELY SURE???"
];

$("fateYes").addEventListener("click", () => {

    fateCount++;

    const message =
        fateMessages[(fateCount - 1) % fateMessages.length];

    $("fateMessage").textContent = message;

    $("fateYes").textContent =
        "YES, I AM SURE! (" + (fateCount + 1) + ") 😂";
});

$("fateNo").addEventListener("click", () => {
    closeModal(fateModal);
    fateCount = 0;
});

// Secret heart
$("heartBtn").addEventListener("click", () => {
    openModal(secretModal);
});

$("closeSecret").addEventListener("click", () => {
    closeModal(secretModal);
});

// Close result
$("closeResult").addEventListener("click", () => {
    closeModal(resultModal);
});
