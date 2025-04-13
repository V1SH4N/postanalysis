const canvas = document.getElementById('receiptCanvas');
const ctx = canvas.getContext('2d');
const receiptForm = document.getElementById('receiptForm');
const passwordForm = document.getElementById("passwordForm");
const downloadBtn = document.getElementById('downloadBtn');

function getCurrentTime() {
    const currentTime = new Date();
    const options = { hour: '2-digit', minute: '2-digit', hour12: false };
    return currentTime.toLocaleTimeString('en-GB', options);
}

function getFormattedDate() {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0'); // Ensures two-digit day
    const month = currentDate.toLocaleString('en-GB', { month: 'long' });
    const year = currentDate.getFullYear();
    
    return `${day} ${month} ${year}`;
}


function drawReceipt(totalAmount, number, date, time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const loadImage = (src) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
        });
    };

    const waitForFonts = () => document.fonts.load("31px Lato");

    Promise.all([
        loadImage('./images/top.png'),
        loadImage('./images/bottom.png'),
        waitForFonts()
    ]).then(([top, bottom]) => {
        // Background
        ctx.fillStyle = "#f9f9f9";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#dce8f4";
        ctx.fillRect(32, 400, canvas.width - 64, canvas.height - 40);

        // Draw Images
        ctx.drawImage(top, 0, 0);
        ctx.drawImage(bottom, 0, 887);

        // Draw Text
        ctx.font = "600 34px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(time, 60, 60);

        ctx.font = "31px Lato";
        ctx.fillStyle = "#0f1217";
        ctx.fillText(totalAmount, 65, 437);
        ctx.fillText(number, 65, 547);
        ctx.fillText("000••••••552", 65, 659);
        ctx.fillText("FT25030MK37K", 65, 770);
        ctx.fillText(date, 65, 880);

        ctx.font = "27px Lato";
        ctx.fillStyle = "#4c555c";
        ctx.fillText("Beneficiary", 65, 502);
        ctx.fillText("From", 65, 613);
        ctx.fillText("Transaction reference", 65, 724);
        ctx.fillText("Date", 65, 835);

        // Now, check for resizing
        const resizeCheck = document.getElementById('resize');
        if (resizeCheck.checked) {
            const tempImg = new Image();
            tempImg.src = canvas.toDataURL();
            tempImg.onload = () => resizeImage(tempImg, canvas);
        }

        downloadBtn.style.display = 'block';
    });
}


function resizeImage(img, canvas) {
    const ctx = canvas.getContext('2d');

    // Fixed canvas image dimensions
    const imageWidth = 828;
    const imageHeight = 1792;
    const imageAspect = imageWidth / imageHeight;

    // Step 1: Get screen aspect ratio
    const screenWidth = screen.width;
    const screenHeight = screen.height;
    const screenAspect = screenWidth / screenHeight;

    let cropWidth, cropHeight;

    // Step 2: Calculate crop size based on screen aspect
    if (screenAspect > imageAspect) {
        // Screen is wider than the image -> limit by width
        cropWidth = imageWidth;
        cropHeight = imageWidth / screenAspect;
    } else {
        // Screen is taller or same aspect -> limit by height
        cropHeight = imageHeight;
        cropWidth = imageHeight * screenAspect;
    }

    // Step 3: Center crop coordinates
    const cropX = (imageWidth - cropWidth) / 2;
    const cropY = (imageHeight - cropHeight) / 2;

    // Step 4: Resize canvas to cropped size
    canvas.width = cropWidth;
    canvas.height = cropHeight;

    // Step 5: Draw cropped portion to canvas
    ctx.drawImage(img,
        cropX, cropY, cropWidth, cropHeight, // source
        0, 0, cropWidth, cropHeight          // destination
    );
}





passwordForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const correctPassword = "amount";
    const enteredPassword = document.getElementById("password").value;

    if (enteredPassword === correctPassword) {
        document.getElementById("login").style.display = "none";
        document.getElementById("main").style.display = "block";
    } else {
        document.getElementById("password").value = '';
    }
});


receiptForm.addEventListener('submit', function(event) {
    event.preventDefault();

    let totalAmount = document.getElementById('amount').value;
    totalAmount = "MUR " + totalAmount + ".00"; 
    const number = document.getElementById('number').value;
    const date = getFormattedDate();
    const time = getCurrentTime();
    
    drawReceipt(totalAmount, number, date, time);
});

downloadBtn.addEventListener("click", function () {
    canvas.toBlob(function (blob) {
        const link = document.createElement("a");
        link.download = "canvas-image.png";
        link.href = URL.createObjectURL(blob);
        link.click();
    }, "image/png");
    downloadBtn.style.display = 'none';
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
    }
});
