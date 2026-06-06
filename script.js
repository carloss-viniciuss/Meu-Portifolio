// ========================================
// EFEITO FUNDO CYBERPUNK (LINHAS)
// ========================================
const canvas = document.getElementById('cyber-bg');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 60; // Quantidade de pontinhos na tela

// Ajusta o tamanho do canvas para ocupar a tela inteira
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Classe para criar cada ponto (partícula)
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.speedX = (Math.random() - 0.5) * 1.2; // Velocidade X
        this.speedY = (Math.random() - 0.5) * 1.2; // Velocidade Y
        this.radius = Math.random() * 2 + 1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Rebater nas bordas da tela
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        ctx.fillStyle = '#dc3545';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Inicializa as partículas
function init() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

// Desenha as linhas conectando os pontos próximos
function connectParticles() {
    let maxDistance = 150; // Distância máxima para ligar uma linha na outra
    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
            let dx = particles[a].x - particles[b].x;
            let dy = particles[a].y - particles[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                // Quanto mais perto, mais brilhante fica a linha vermelha
                let opacity = 1 - (distance / maxDistance);
                ctx.strokeStyle = `rgba(220, 53, 69, ${opacity * 0.25})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

// Loop de animação
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
    connectParticles();
    requestAnimationFrame(animate);
}

init();
animate();


// ========================================
// TYPED EFFECT (EFEITO TEXTO DIGITANDO)
// ========================================
const typedEl = document.getElementById('typed');
const phrases = [
  'Graduando em Ciência da Computação',
  'CESAR School Student',
  'Entusiasta de IA',
  'Programador Python',
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
  if (!typedEl) return;

  const current = phrases[phraseIndex];

  if (isDeleting) {
    typedEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 30 : 70;

  if (!isDeleting && charIndex === current.length) {
    delay = 2000; // Tempo parado mostrando a frase cheia
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 400;
  }

  setTimeout(type, delay);
}

// Iniciar digitação automática ao carregar
document.addEventListener("DOMContentLoaded", type);