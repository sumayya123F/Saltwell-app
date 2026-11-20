(() => {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const overlay = document.getElementById("overlay");
  const msg = document.getElementById("msg");
  const W = canvas.width, H = canvas.height;

  const PADDLE_W = 12, PADDLE_H = 90, PADDLE_SPEED = 420;
  const BALL_R = 8, BALL_START = 360, BALL_MAX = 780, WIN_SCORE = 7;
  const AI_SPEED = 300;

  const player = { x: 24, y: H / 2 - PADDLE_H / 2, score: 0 };
  const cpu = { x: W - 24 - PADDLE_W, y: H / 2 - PADDLE_H / 2, score: 0 };
  const ball = { x: W / 2, y: H / 2, vx: 0, vy: 0 };

  let state = "ready"; // ready | playing | paused | over
  const keys = {};
  let last = 0;

  function resetBall(dir) {
    ball.x = W / 2;
    ball.y = H / 2;
    const angle = (Math.random() * 0.8 - 0.4); // radians
    ball.vx = Math.cos(angle) * BALL_START * dir;
    ball.vy = Math.sin(angle) * BALL_START;
  }

  function newGame() {
    player.score = cpu.score = 0;
    player.y = cpu.y = H / 2 - PADDLE_H / 2;
    resetBall(Math.random() < 0.5 ? -1 : 1);
    state = "playing";
    overlay.classList.add("hidden");
  }

  function showMessage(text) {
    msg.innerHTML = text;
    overlay.classList.remove("hidden");
  }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function paddleHit(p) {
    if (
      ball.x + BALL_R > p.x && ball.x - BALL_R < p.x + PADDLE_W &&
      ball.y + BALL_R > p.y && ball.y - BALL_R < p.y + PADDLE_H
    ) {
      const rel = (ball.y - (p.y + PADDLE_H / 2)) / (PADDLE_H / 2); // -1..1
      const speed = Math.min(Math.hypot(ball.vx, ball.vy) * 1.06, BALL_MAX);
      const angle = rel * (Math.PI / 4);
      const dir = p === player ? 1 : -1;
      ball.vx = Math.cos(angle) * speed * dir;
      ball.vy = Math.sin(angle) * speed;
      ball.x = dir === 1 ? p.x + PADDLE_W + BALL_R : p.x - BALL_R;
    }
  }

  function update(dt) {
    // player input
    if (keys["w"] || keys["arrowup"]) player.y -= PADDLE_SPEED * dt;
    if (keys["s"] || keys["arrowdown"]) player.y += PADDLE_SPEED * dt;
    player.y = clamp(player.y, 0, H - PADDLE_H);

    // cpu: follow the ball with a dead zone and capped speed
    const target = ball.y - PADDLE_H / 2;
    const diff = target - cpu.y;
    if (ball.vx > 0 || Math.abs(diff) > 80) {
      cpu.y += clamp(diff, -AI_SPEED * dt, AI_SPEED * dt) * (Math.abs(diff) > 10 ? 1 : 0.3);
    }
    cpu.y = clamp(cpu.y, 0, H - PADDLE_H);

    // ball
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    if (ball.y - BALL_R < 0) { ball.y = BALL_R; ball.vy = Math.abs(ball.vy); }
    if (ball.y + BALL_R > H) { ball.y = H - BALL_R; ball.vy = -Math.abs(ball.vy); }

    if (ball.vx < 0) paddleHit(player); else paddleHit(cpu);

    // scoring
    if (ball.x < -BALL_R) score(cpu, 1);
    else if (ball.x > W + BALL_R) score(player, -1);
  }

  function score(winner, nextDir) {
    winner.score++;
    if (winner.score >= WIN_SCORE) {
      state = "over";
      showMessage(
        (winner === player ? "You win!" : "CPU wins!") + " Press <b>Space</b> to play again"
      );
    } else {
      resetBall(nextDir);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // center line
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    for (let y = 8; y < H; y += 28) ctx.fillRect(W / 2 - 2, y, 4, 14);

    // scores
    ctx.fillStyle = "#e8ecf5";
    ctx.font = "56px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.fillText(player.score, W / 2 - 80, 70);
    ctx.fillText(cpu.score, W / 2 + 80, 70);

    // paddles
    ctx.fillStyle = "#5eead4";
    ctx.fillRect(player.x, player.y, PADDLE_W, PADDLE_H);
    ctx.fillStyle = "#f472b6";
    ctx.fillRect(cpu.x, cpu.y, PADDLE_W, PADDLE_H);

    // ball
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
    ctx.fill();
  }

  function loop(ts) {
    const dt = Math.min((ts - last) / 1000, 0.05);
    last = ts;
    if (state === "playing") update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  function togglePause() {
    if (state === "playing") { state = "paused"; showMessage("Paused — press <b>P</b>"); }
    else if (state === "paused") { state = "playing"; overlay.classList.add("hidden"); }
  }

  window.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    if (["arrowup", "arrowdown", " "].includes(k)) e.preventDefault();
    keys[k] = true;
    if (k === " " && (state === "ready" || state === "over")) newGame();
    if (k === "p") togglePause();
  });
  window.addEventListener("keyup", (e) => { keys[e.key.toLowerCase()] = false; });

  // pointer / touch control
  function pointerMove(e) {
    const rect = canvas.getBoundingClientRect();
    const y = ((e.clientY - rect.top) / rect.height) * H;
    player.y = clamp(y - PADDLE_H / 2, 0, H - PADDLE_H);
  }
  canvas.addEventListener("pointermove", pointerMove);
  canvas.addEventListener("pointerdown", (e) => {
    pointerMove(e);
    if (state === "ready" || state === "over") newGame();
  });

  resetBall(1);
  requestAnimationFrame((ts) => { last = ts; loop(ts); });
})();
