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
    
    // Load images
    const top = new Image();
    top.src = './images/top.png'; 
    top.onload = function() {
        ctx.drawImage(top, 0, 0);
    };

    const bottom = new Image();
    bottom.src = './images/bottom.png';
    bottom.onload = function() {
        ctx.drawImage(bottom,0 , 887);
    };

    // Background
    ctx.fillStyle = "#f9f9f9";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#dce8f4";
    ctx.fillRect(32, 400, canvas.width - 64, canvas.height - 40);

    // Texts
    Text
    document.fonts.load("31px Lato").then(() => {

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

        ctx.font = " 27px Lato";
        ctx.fillStyle = "#4c555c"
        ctx.fillText("Beneficiary", 65, 502);
        ctx.fillText("From", 65, 613);
        ctx.fillText("Transaction reference", 65, 724);
        ctx.fillText("Date", 65, 835);
    });

    //resize image if required
    const resizeCheck = document.getElementById('resize');
    if (resizeCheck.checked){
        resizeImage(canvas);
    }
    downloadBtn.style.display = 'block';
    
}

function resizeImage(canvas) {
    const ctx = canvas.getContext('2d');

    const screenWidth = screen.width;
    const screenHeight = screen.height;
    const screenAspect = screenWidth / screenHeight;

    const imageWidth = canvas.width;
    const imageHeight = canvas.height;
    const imageAspect = imageWidth / imageHeight;

    let sx = 0, sy = 0, sw = imageWidth, sh = imageHeight;

    // Determine crop area to match screen aspect ratio
    if (imageAspect > screenAspect) {
        // Crop left and right sides
        const targetWidth = imageHeight * screenAspect;
        sx = (imageWidth - targetWidth) / 2;
        sw = targetWidth;
    } else if (imageAspect < screenAspect) {
        // Crop top and bottom
        const targetHeight = imageWidth / screenAspect;
        sy = (imageHeight - targetHeight) / 2;
        sh = targetHeight;
    }

    // Get the cropped image data
    const croppedImageData = ctx.getImageData(sx, sy, sw, sh);

    // Resize canvas to screen size and draw cropped image scaled to fit
    canvas.width = screenWidth;
    canvas.height = screenHeight;
    ctx.clearRect(0, 0, screenWidth, screenHeight);
    ctx.drawImage(
        createImageFromData(croppedImageData),
        0, 0, sw, sh, // source
        0, 0, screenWidth, screenHeight // destination
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
