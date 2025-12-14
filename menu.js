const bgCanvas = document.getElementById("bgCanvas");
const bgCtx = bgCanvas.getContext("2d");

const gameCanvas = document.getElementById("gameCanvas");
const playBtn = document.getElementById("playBtn");
const optionsBtn = document.getElementById("optionsBtn");
const optionsMenu = document.getElementById("optionsMenu");
const closeOptions = document.getElementById("closeOptions");

let stars = [];

function resize() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
    gameCanvas.width = window.innerWidth;
    gameCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

function createStars() {
    for (let i = 0; i < 150; i++) {
        stars.push({
            x: Math.random()*bgCanvas.width,
            y: Math.random()*bgCanvas.height,
            size: Math.random()*2,
            speed: 0.2 + Math.random()*0.5
        });
    }
}

function drawStars() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

    bgCtx.fillStyle = "white";
    stars.forEach(s => {
        bgCtx.beginPath();
        bgCtx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        bgCtx.fill();
        s.y += s.speed;
        if (s.y > bgCanvas.height) {
            s.y = -5;
            s.x = Math.random()*bgCanvas.width;
        }
    });

    requestAnimationFrame(drawStars);
}

createStars();
drawStars();

optionsBtn.onclick = () => {
    optionsMenu.style.display = "block";
};
closeOptions.onclick = () => {
    optionsMenu.style.display = "none";
};

playBtn.onclick = () => {
    const menu = document.getElementById("menu");
    menu.style.animation = "fadeOut 0.5s forwards";

    setTimeout(() => {
        menu.style.display = "none";
        startGame(); // Fonction du jeu à créer
    }, 500);
};

function startGame() {
    console.log("GAME STARTED");
    function startGame() {

    // PARAMÈTRES GLOBAUX
    const ctx = gameCanvas.getContext("2d");
    let player = {
        x: gameCanvas.width / 2,
        y: gameCanvas.height / 2,
        size: 20,
        speed: 2.2,
        color: document.getElementById("colorPicker").value,
        name: document.getElementById("playerName").value || "Star"
    };

    let orbs = [];
    let asteroids = [];
    let crystals = [];
    let bots = [];

    const ORB_COUNT = 200;
    const BOT_COUNT = 10;
    const ASTEROID_INTERVAL = 3000;
    const CRYSTAL_INTERVAL = 5000;

    // 🎮 Input
    let mouseX = player.x;
    let mouseY = player.y;

    gameCanvas.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // 🌠 Génération d'orbs au début
    for (let i = 0; i < ORB_COUNT; i++) {
        orbs.push(spawnOrb());
    }

    function spawnOrb() {
        return {
            x: Math.random() * gameCanvas.width,
            y: Math.random() * gameCanvas.height,
            size: 4 + Math.random() * 3,
            color: "white"
        };
    }

    // ☄️ Astéroïdes automatiques
    setInterval(() => {
        asteroids.push({
            x: Math.random() * gameCanvas.width,
            y: Math.random() * gameCanvas.height,
            size: 25 + Math.random() * 15,
            color: "#777"
        });
    }, ASTEROID_INTERVAL);

    // ❄️ Cristaux automatiques
    setInterval(() => {
        crystals.push({
            x: Math.random() * gameCanvas.width,
            y: Math.random() * gameCanvas.height,
            size: 18,
            color: "#55ccff"
        });
    }, CRYSTAL_INTERVAL);

    // 🤖 IA — Bots étoiles
    for (let i = 0; i < BOT_COUNT; i++) {
        bots.push({
            x: Math.random() * gameCanvas.width,
            y: Math.random() * gameCanvas.height,
            size: 15 + Math.random() * 10,
            name: "Bot_" + i,
            color: randomColor()
        });
    }

    function randomColor() {
        return "#" + Math.floor(Math.random()*16777215).toString(16);
    }

    // ⭐ Déplacement fluide vers la souris
    function movePlayer() {
        let dx = mouseX - player.x;
        let dy = mouseY - player.y;
        let dist = Math.hypot(dx, dy);

        if (dist > 1) {
            player.x += (dx / dist) * player.speed;
            player.y += (dy / dist) * player.speed;
        }
    }

    // 💥 Collision absorption
    function checkCollision(a, b) {
        let d = Math.hypot(a.x - b.x, a.y - b.y);
        return d < a.size + b.size;
    }

    // 🧠 IA Bots simple (se déplacent vers les orbs)
    function moveBots() {
        bots.forEach(bot => {
            let target = orbs[Math.floor(Math.random() * orbs.length)];
            if (!target) return;

            let dx = target.x - bot.x;
            let dy = target.y - bot.y;
            let d = Math.hypot(dx, dy);

            bot.x += (dx / d) * 1.3;
            bot.y += (dy / d) * 1.3;
        });
    }

    // 🎨 Rendu
    function drawStar(entity) {
        ctx.beginPath();
        ctx.arc(entity.x, entity.y, entity.size, 0, Math.PI * 2);
        ctx.fillStyle = entity.color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = entity.color;
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    function drawName(entity) {
        ctx.font = "16px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(entity.name, entity.x, entity.y - entity.size - 5);
    }

    // 🕹️ Boucle principale
    function loop() {
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

        // Déplacements
        movePlayer();
        moveBots();

        // Dessin orbs
        orbs.forEach((orb, i) => {
            drawStar(orb);
            if (checkCollision(player, orb)) {
                player.size += 0.25;
                orbs.splice(i, 1);
                orbs.push(spawnOrb());
            }
        });

        // Astéroïdes
        asteroids.forEach((a, i) => {
            drawStar(a);
            if (checkCollision(player, a)) {
                player.size += 2;
                asteroids.splice(i, 1);
            }
        });

        // Cristaux
        crystals.forEach((c, i) => {
            drawStar(c);
            if (checkCollision(player, c)) {
                player.size += 1.5;
                crystals.splice(i, 1);
            }
        });

        // Bots
        bots.forEach((b, i) => {
            drawStar(b);
            drawName(b);

            if (checkCollision(player, b) && player.size > b.size) {
                player.size += b.size * 0.3;
                bots.splice(i, 1);
            }
        });

        // Joueur
        drawStar(player);
        drawName(player);

        requestAnimationFrame(loop);
    }

    loop();
}

}
