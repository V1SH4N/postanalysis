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
    canvas.width = 828;
    canvas.height = 1792;
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

        // Check for resizing
        const resizeCheck = document.getElementById('resize');
        if (resizeCheck.checked) {
            resizeImage(canvas);
        }

        downloadBtn.style.display = 'block';
    });
}


function resizeImage(canvas) {
    const imageWidth = 828;
    const imageHeight = 1792;
    const imageAspect = imageWidth / imageHeight;

    let screenWidth = screen.width;
    let screenHeight = screen.height;
    let screenAspect = screenWidth / screenHeight;

    let cropX, cropY, cropWidth, cropHeight;

    if (screenAspect > imageAspect){
        // fixed width
        cropWidth = 828;
        const tempHeight = 828 * (1 / screenAspect);//same aspect ratio of screen but same resolution of image
        const difference = (1792 - tempHeight) / 2;
        cropHeight = 1792 - (2 * difference);
        cropX = 0;
        cropY = difference / 2;
        // const myheight = document.createElement('p')
        // myheight.textContent = cropHeight;
        // document.body.appendChild(myheight);
    }else{
        // fixed height
        cropHeight = 1792;
        const tempHeight = 828 * (1 / screenAspect);//same aspect ratio of screen but same resolution of image
        const difference = (tempHeight - cropHeight) / 2;
        cropWidth = 828 - (difference);
        cropX = difference / 2;
        cropY = 0;
        
        // const mywidth = document.createElement('p')
        // mywidth.textContent = cropWidth;
        // document.body.appendChild(mywidth);
    }
    const croppedCanvas = document.createElement("canvas");
    croppedCanvas.width = cropWidth;
    croppedCanvas.height = cropHeight;
    const croppedCtx = croppedCanvas.getContext("2d");

    // Replace original canvas with cropped image
    croppedCtx.drawImage(
    canvas,     // source canvas
    cropX, cropY,       // start at (x, y) on source canvas
    cropWidth, cropHeight, // crop this width and height
    0, 0,               // place it at (0, 0) on destination canvas
    cropWidth, cropHeight  // same size as cropped area
    );

    canvas.width = cropWidth; //change size of original canvas
    canvas.height = cropHeight;
    
    ctx.clearRect(0, 0, cropWidth, cropHeight); // Draw cropped image back onto original canvas
    ctx.drawImage(croppedCanvas, 0, 0);
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
