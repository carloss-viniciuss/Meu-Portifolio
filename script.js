// ==========================================================================
// MEU EFEITO DE FUNDO CYBERPUNK (REDE DE PARTÍCULAS CONECTADAS POR LINHAS)
// ==========================================================================

// Pego o elemento canvas lá do HTML e o contexto 2D para desenhar na tela
const canvas = document.getElementById('cyber-bg');
const ctx = canvas.getContext('2d');

// Array global onde vou guardar todos os meus pontinhos em movimento
let particles = [];
// Defino o limite máximo de pontinhos na tela para não travar o PC
const particleCount = 60; 

// Função que força o canvas a ficar sempre do tamanho exato da janela do navegador
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
// Se o usuário mexer no tamanho da janela, eu recalculo o tamanho do canvas
window.addEventListener('resize', resizeCanvas);
// Executo logo de primeira para configurar o tamanho inicial do fundo
resizeCanvas();

// Molde (Classe) para criar cada um dos meus pontinhos (partículas)
class Particle {
    constructor() {
        // Gera uma posição aleatória (X, Y) dentro do tamanho atual do canvas
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        // Configura velocidades aleatórias (positivas ou negativas) para dar movimento
        this.speedX = (Math.random() - 0.5) * 1.2; 
        this.speedY = (Math.random() - 0.5) * 1.2; 
        // Define um tamanho aleatório para o pontinho não ficarem todos iguais
        this.radius = Math.random() * 2 + 1;
    }

    // Método que calcula o próximo passo do pontinho e gerencia as colisões com as bordas
    update() {
        // Soma a velocidade na posição atual para fazer o ponto andar
        this.x += this.speedX;
        this.y += this.speedY;

        // Se bater nas laterais esquerda ou direita, inverte a direção em X (rebate)
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        // Se bater no topo ou na base da tela, inverte a direção em Y (rebate)
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    // Desenha o pontinho na tela usando a cor principal do meu tema
    draw() {
        ctx.fillStyle = '#dc3545'; // Vermelho do meu portfólio
        ctx.beginPath();
        // Desenha um círculo perfeito baseado no raio e posição da instância
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill(); // Pinta o círculo por dentro
    }
}

// Cria o exército de partículas baseado na quantidade que eu configurei lá em cima
function init() {
    particles = []; // Limpa o array para garantir que está zerado
    for (let i = 0; i < particleCount; i++) {
        // Instancia uma nova partícula e joga dentro da lista
        particles.push(new Particle());
    }
}

// Lógica matemática para achar pontos próximos e traçar as linhas vermelhas neon
function connectParticles() {
    let maxDistance = 150; // Distância máxima em pixels para dois pontos se conectarem
    
    // Varre o array comparando a distância de cada ponto com todos os outros
    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
            // Teorema de Pitágoras puro para calcular a distância real entre o ponto A e B
            let dx = particles[a].x - particles[b].x;
            let dy = particles[a].y - particles[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            // Se a distância for menor que o limite, eu desenho a linha de conexão
            if (distance < maxDistance) {
                // Cálculo de opacidade: quanto mais perto um do outro, mais forte a linha brilha
                let opacity = 1 - (distance / maxDistance);
                ctx.strokeStyle = `rgba(220, 53, 69, ${opacity * 0.25})`; // Linha vermelha translúcida
                ctx.lineWidth = 1; // Espessura fina para manter o visual elegante
                
                // Desenha a linha ligando as coordenadas do ponto A até o ponto B
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke(); // Aplica o traçado na tela
            }
        }
    }
}

// O motor da animação: limpa a tela, atualiza as posições e redesenha tudo infinitamente
function animate() {
    // Apaga o frame anterior para o efeito não ficar borrado ou deixando rastros
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Roda um loop para atualizar e desenhar cada um dos meus pontos na nova posição
    for (let i = 0; i < particles.length; i++) {
        particles[i].update(); // Faz andar e testa colisão nas bordas
        particles[i].draw();   // Renderiza o pontinho vermelho
    }
    
    connectParticles(); // Calcula e desenha as linhas de teia entre os pontos
    // Função nativa do navegador que sincroniza a animação com a taxa de atualização do monitor
    requestAnimationFrame(animate);
}

// Inicializo o array com os objetos de partículas
init();
// Dou o start inicial no loop infinito de renderização do fundo
animate();


// ==========================================================================
// EFEITO TYPED: SIMULADOR DE TEXTO SENDO DIGITADO NO TERMINAL (HOME)
// ==========================================================================

// Pego o ID onde a mágica da digitação vai acontecer lá na minha página Home
const typedEl = document.getElementById('typed');

// Lista com as frases que vão ficar alternando em loop infinito no meu cabeçalho
const phrases = [
  'Graduando em Ciência da Computação',
  'Estudante da CESAR school',
  'Entusiasta de IA',
  'Programador Python',
];

let phraseIndex = 0; // Guarda em qual frase da minha lista eu estou no momento
let charIndex = 0;   // Guarda em qual letra da frase atual a digitação está
let isDeleting = false; // Flag boleana para controlar se o script está escrevendo ou apagando o texto

// Função principal do efeito datilografia
function type() {
  // Trava de segurança: se o elemento não existir na página atual (ex: projetos.html), para a execução
  if (!typedEl) return;

  // Pega o texto da frase atual baseado no ponteiro da array
  const current = phrases[phraseIndex];

  if (isDeleting) {
    // Se estiver apagando, remove a última letra da tela cortando a string
    typedEl.textContent = current.slice(0, charIndex - 1);
    charIndex--; // Recua uma posição
  } else {
    // Se estiver escrevendo, adiciona a próxima letra cortando a string até a posição atual + 1
    typedEl.textContent = current.slice(0, charIndex + 1);
    charIndex++; // Avança uma posição
  }

  // Define a velocidade da animação: apagar (30ms) é mais rápido do que escrever (70ms)
  let delay = isDeleting ? 30 : 70;

  // Quando o script termina de digitar toda a palavra atual
  if (!isDeleting && charIndex === current.length) {
    delay = 2000; // Trava o texto cheio na tela por 2 segundos para o usuário conseguir ler
    isDeleting = true; // Ativa o modo de destruição (apagar a frase)
  } 
  // Quando o script termina de apagar toda a palavra atual
  else if (isDeleting && charIndex === 0) {
    isDeleting = false; // Desativa o modo de destruição (volta a escrever)
    // Passa para a próxima frase da lista. O operador '%' garante que ao chegar no fim, volte para o index 0
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 400; // Dá uma pequena pausa de 400ms antes de começar a digitar a nova frase
  }

  // Agenda a próxima execução da função baseado no delay dinâmico calculado
  setTimeout(type, delay);
}

// Quando todo o HTML do site carregar, dispara a função de digitação automática
document.addEventListener("DOMContentLoaded", type);


// ==========================================================================
// MEU MOTOR DE TRANSIÇÃO HACKER (IMPECE REDIRECIONAMENTOS DIRETOS E CRIA O GLITCH)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    // Captura as divs de tela de bloqueio e o body para injetar as classes de animação
    const overlay = document.getElementById("pageOverlay");
    const body = document.body;

    // Uso o truque de escutar cliques globais no documento usando a fase de captura ('true')
    // Fiz isso para interceptar o clique ANTES que links normais façam a página mudar do nada
    document.addEventListener("click", (e) => {
        // Verifica se o usuário clicou em uma tag <a> ou dentro de algum elemento que tenha link
        const link = e.target.closest("a");

        // Se o clique não envolveu nenhum link ou botão de navegação, sai da função imediatamente
        if (!link) return;

        // Pega o destino para onde o link quer mandar o usuário
        const href = link.getAttribute("href");

        // MINHAS REGRAS DE EXCEÇÃO (Crucial para não bugar o WhatsApp, e-mail ou links de scroll interno '#')
        // Se o link for âncora interna ou tiver target="_blank" (novas abas), ignora o efeito hacker e deixa abrir normal
        if (!href || href.startsWith("#") || link.getAttribute("target") === "_blank") {
            return; 
        }

        // Corta os comportamentos padrões do navegador para travar a mudança de página instantânea
        e.preventDefault(); // Cancela o redirecionamento imediato
        e.stopPropagation(); // Impede o evento de subir para outros elementos

        // FASE 1 DA TRANSIÇÃO: Injeta a classe que faz a tela inteira tremer violentamente (Glitch)
        body.classList.add("body-glitch-active");

        // FASE 2 DA TRANSIÇÃO: Ativa a tela preta com o alerta em vermelho de "SYSTEMA HACKEADO"
        setTimeout(() => {
            // Se a div overlay existir no HTML, injeto a classe 'ativo' que mostra o painel hacker
            if (overlay) overlay.classList.add("ativo");
        }, 150); // Delay curto de 150 milissegundos para o susto visual ser rápido

        // FASE 3 DA TRANSIÇÃO: Após o colapso visual completo, faz o redirecionamento real de página
        setTimeout(() => {
            // Força o navegador a ir para o destino guardado na variável href
            window.location.href = href;
        }, 950); // Aguarda exatamente 950ms (tempo ideal para as animações CSS terminarem)
    }, true); // O 'true' ativa o modo de escuta prioritária (intercepta no topo do DOM)
});