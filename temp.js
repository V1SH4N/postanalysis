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
        console.log('checked');
    }

    downloadBtn.style.display = 'block';
    
}

function resizeImage(canvas) {
    const screenRatio = window.innerWidth / window.innerHeight;
    const canvasRatio = canvas.width / canvas.height;

    let cropWidth, cropHeight;

    if (screenRatio > canvasRatio) {
        // Screen is wider than canvas, crop vertically
        cropHeight = canvas.width / screenRatio;
        cropWidth = canvas.width;
    } else {
        // Screen is taller than canvas, crop horizontally
        cropWidth = canvas.height * screenRatio;
        cropHeight = canvas.height;
    }

    // Calculate top-left coordinates to center the cropped area
    const sx = (canvas.width - cropWidth) / 2;
    const sy = (canvas.height - cropHeight) / 2;

    // Create a temporary canvas to hold the cropped image
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = cropWidth;
    tempCanvas.height = cropHeight;
    const tempCtx = tempCanvas.getContext('2d');

    // Draw the cropped portion onto the temporary canvas
    tempCtx.drawImage(canvas, sx, sy, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

    // Resize the original canvas and draw the result back
    canvas.width = cropWidth;
    canvas.height = cropHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(tempCanvas, 0, 0);
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
