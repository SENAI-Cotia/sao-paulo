const tqPerguntas = [
  {
    titulo: "Como você tem se sentido em relação às suas aulas e tarefas da escola ultimamente?",
    opcoes: [
      "Consigo me concentrar bem e entregar tudo no prazo.",
      "Às vezes me distraio, mas no geral dou conta de tudo.",
      "Estou achando bem difícil me concentrar e estou acumulando tarefas.",
      "Me sinto totalmente desmotivado(a) e não estou conseguindo estudar."
    ]
  },
  {
    titulo: "Como costuma ser o seu sono e como você acorda para ir à escola?",
    opcoes: [
      "Durmo super bem e acordo com energia na maioria dos dias.",
      "Meu sono é um pouco irregular, mas consigo descansar.",
      "Demoro muito para dormir ou acordo várias vezes à noite, acordando cansado(a).",
      "Quase não consigo dormir ou sinto uma exaustão constante durante o dia."
    ]
  },
  {
    titulo: "Como você avalia a sua relação com seus colegas e amigos atualmente?",
    opcoes: [
      "Muito boa! Me sinto acolhido(a) e converso bastante com eles.",
      "Normal, tenho alguns amigos e nos damos bem na maior parte do tempo.",
      "Estou me sentindo um pouco afastado(a) ou com dificuldades de me enturmar.",
      "Prefiro ficar totalmente isolado(a) e sinto que não me encaixo aqui."
    ]
  },
  {
    titulo: "Quando você tem um dia difícil, uma prova importante ou muitos prazos, como seu corpo e mente costumam reagir?",
    opcoes: [
      "Fico um pouco tenso(a), mas consigo me organizar e resolver.",
      "Fico ansioso(a), mas a sensação passa assim que o momento crítico termina.",
      "Sinto dor de cabeça, dor de estômago ou uma preocupação excessiva que me atrapalha.",
      "Me sinto paralisado(a), com muita falta de ar ou vontade de chorar/desistir."
    ]
  },
  {
    titulo: "Pensando nas últimas duas semanas, qual frase melhor descreve o seu humor na maior parte dos dias?",
    opcoes: [
      "Tenho me sentido bem, animado(a) e tranquilo(a).",
      "Meu humor muda bastante, mas no geral fico bem.",
      "Tenho me sentido irritado(a), ansioso(a) ou triste com frequência.",
      "Sinto um vazio imenso, angústia ou uma tristeza que não passa."
    ]
  }
];

let tqAtual = 0;
let tqRespostas = [];

function triagemIniciar() {
  tqAtual = 0;
  tqRespostas = new Array(5).fill(null);
  document.getElementById('tq-resultado').classList.add('oculto');
  document.getElementById('tq-quiz').classList.remove('oculto');
  tqRenderizar();
}

function tqRenderizar() {
  const p = tqPerguntas[tqAtual];
  const letras = ['A', 'B', 'C', 'D'];

  document.getElementById('tq-progresso-label').textContent = `Pergunta ${tqAtual + 1} de 5`;
  document.getElementById('tq-progresso-bar').style.width = `${((tqAtual + 1) / 5) * 100}%`;
  document.getElementById('tq-btn-anterior').style.visibility = tqAtual === 0 ? 'hidden' : 'visible';

  const wrap = document.getElementById('tq-pergunta-wrap');
  wrap.innerHTML = `
    <p class="tq-pergunta-titulo">${p.titulo}</p>
    <div class="tq-opcoes">
      ${p.opcoes.map((op, i) => `
        <button class="tq-opcao ${tqRespostas[tqAtual] === i ? 'selecionada' : ''}"
                onclick="tqSelecionar(${i})">
          <span class="tq-opcao-letra">${letras[i]})</span>
          <span>${op}</span>
        </button>
      `).join('')}
    </div>
  `;

  document.getElementById('tq-btn-proximo').disabled = tqRespostas[tqAtual] === null;
  document.getElementById('tq-btn-proximo').textContent = tqAtual === 4 ? 'Finalizar ✓' : 'Próxima →';
}

function tqSelecionar(indice) {
  tqRespostas[tqAtual] = indice;
  tqRenderizar();
}

function triagemProximo() {
  if (tqRespostas[tqAtual] === null) return;
  if (tqAtual < 4) {
    tqAtual++;
    tqRenderizar();
  } else {
    tqMostrarResultado();
  }
}

function triagemAnterior() {
  if (tqAtual > 0) {
    tqAtual--;
    tqRenderizar();
  }
}

function tqMostrarResultado() {
  document.getElementById('tq-quiz').classList.add('oculto');
  document.getElementById('tq-resultado').classList.remove('oculto');
}

function triagemReiniciar() {
  document.getElementById('tq-resultado').classList.add('oculto');
  triagemIniciar();
}

document.addEventListener('DOMContentLoaded', () => {
  tqRenderizar();
});