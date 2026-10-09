const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const destinations = [
    "GÖTEBÖRG",
    "FROG TOWN",
    "OHIO",
    "GOBLINSVILLE",
    "PENGUIN LAND",
    "TAX EVASION",
    "NOOT NOOT CITY",
    "LASAGNA CITY",
    "BACKROOMS",
    "BANANA REPUBLIC",
    "STENSTÖRP",
    "STEFANS HUS",
];

let objects = [];
let spawnTimer = 0;
let roadOffset = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);

function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);

    gradient.addColorStop(0, "#29245c");
    gradient.addColorStop(0.3, "#61417f");
    gradient.addColorStop(0.65, "#bd638d");
    gradient.addColorStop(1, "#ffb17a");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ground
    ctx.fillStyle = "rgba(30, 30, 55, 0.25)";
    ctx.fillRect(0, 0, canvas.width * 0.2, canvas.height);
    ctx.fillRect(canvas.width * 0.8, 0, canvas.width * 0.2, canvas.height);
}

function drawRoad() {
    const roadLeft = canvas.width * 0.2;
    const roadWidth = canvas.width * 0.6;

    const gradient = ctx.createLinearGradient(
        roadLeft, 0, roadLeft + roadWidth, 0
    );

    gradient.addColorStop(0, "#303249");
    gradient.addColorStop(0.5, "#494b65");
    gradient.addColorStop(1, "#303249");

    // Road
    ctx.fillStyle = gradient;
    ctx.fillRect(roadLeft, 0, roadWidth, canvas.height);

    // White road edges
    ctx.fillStyle = "white";
    ctx.fillRect(roadLeft, 0, 5, canvas.height);
    ctx.fillRect(roadLeft + roadWidth - 5, 0, 5, canvas.height);

    // Animated centre lane
    ctx.fillStyle = "white";

    for (
        let y = roadOffset - 100;
        y < canvas.height;
        y += 100
    ) {
        ctx.fillRect(
            canvas.width / 2 - 4,
            y,
            8,
            45
        );
    }

    roadOffset += 3;

    if (roadOffset >= 100) {
        roadOffset = 0;
    }
}

// Draw a simple palm tree using Canvas shapes
function drawPalm(x, y, scale) {
    ctx.save();

    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.lineJoin = "round";

    // Curved brown trunk
    ctx.beginPath();
    ctx.moveTo(-7, 0);
    ctx.bezierCurveTo(-25, 35, -30, 80, -25, 125);
    ctx.lineTo(0, 125);
    ctx.bezierCurveTo(-7, 80, 5, 35, 7, 0);
    ctx.closePath();

    ctx.fillStyle = "#cdb58a";
    ctx.fill();
    ctx.stroke();

    // Small curved lines on the trunk
    ctx.lineWidth = 1;

    for (let i = 0; i < 5; i++) {
        const lineY = 25 + i * 20;

        ctx.beginPath();
        ctx.moveTo(-10 - (i * 1.5), lineY);
        ctx.quadraticCurveTo(-3, lineY + 6, 5, lineY + 3);
        ctx.stroke();
    }

    // Palm leaves
    const leafAngles = [
        -160, -135, -110, -80, -50, -25, 5
    ];

    leafAngles.forEach(angle => {
        ctx.save();
        ctx.translate(0, 0);
        ctx.rotate(angle * Math.PI / 180);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(15, -12, 65, -8);
        ctx.quadraticCurveTo(45, 4, 0, 0);

        ctx.fillStyle = "#a5df8c";
        ctx.fill();
        ctx.stroke();

        // Simple leaf vein
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(30, -3, 60, -8);
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.restore();
    });

    // Centre where the leaves meet
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#a5df8c";
    ctx.fill();
    ctx.stroke();

    ctx.restore();
}

// Draw a green road sign
function drawSign(x, y, scale, text) {
    ctx.save();

    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.font = "bold 12px Arial";

    const signWidth = Math.max(
        85,
        ctx.measureText(text).width + 24
    );

    // Sign post
    ctx.fillStyle = "#b7a987";
    ctx.fillRect(-2, 8, 5, 30);

    // Sign shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.fillRect(
        -signWidth / 2 + 3,
        -12 + 4,
        signWidth,
        28
    );

    // Sign border
    ctx.fillStyle = "#ded6a4";
    ctx.fillRect(-signWidth / 2, -12, signWidth, 28);

    // Green sign
    ctx.fillStyle = "#246447";
    ctx.fillRect(
        -signWidth / 2 + 3,
        -9,
        signWidth - 6,
        22
    );

    // Sign text
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 0, 2);

    ctx.restore();
}

function spawnObject() {
    const side = Math.random() < 0.5 ? "left" : "right";
    const isSign = Math.random() < 0.28;

    objects.push({
        side: side,
        type: isSign ? "sign" : "palm",
        text: "➜ " + destinations[
            Math.floor(Math.random() * destinations.length)
        ],
        depth: 0.02
    });
}

function drawObjects() {
    objects = objects.filter(obj => {
        obj.depth += 0.004;

        if (obj.depth >= 1.15) {
            return false;
        }

        const depth = obj.depth;

        const x = obj.side === "left"
            ? canvas.width * (0.2 - depth * 0.1)
            : canvas.width * (0.8 + depth * 0.1);

        const y = canvas.height * (-0.05 + depth);

        const scale = 0.15 + depth * 1.5;

        if (obj.type === "palm") {
            drawPalm(x, y, scale);
        } else {
            drawSign(x, y, scale, obj.text);
        }

        return true;
    });
}

function animate() {
    drawBackground();
    drawRoad();

    spawnTimer++;

    if (spawnTimer > 48) {
        spawnObject();
        spawnTimer = 0;
    }

    drawObjects();

    requestAnimationFrame(animate);
}

animate();