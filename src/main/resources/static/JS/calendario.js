const INTERVALO_MIN = 20;
const HORA_INICIO   = 8;
const HORA_FIM      = 12;
const PASSO_MIN     = 30;

let viewDate        = new Date();
viewDate.setHours(12, 0, 0, 0);

let dataSelecionada = null;
let horarioPendente = null;
let botaoPendente   = null;
let idAgendamentoParaDeletar = null;
let idAgendamentoParaReagendar = null;

let listaBloqueada = Array.isArray(window.datasIndisponiveis) ? window.datasIndisponiveis : [];

function pad(n) { return String(n).padStart(2, '0'); }
function toKey(d) { return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }

document.addEventListener('DOMContentLoaded', () => {

    const grid      = document.getElementById('cal-grid');
    const titulo    = document.getElementById('cal-titulo');
    const horarios  = document.getElementById('cal-horarios');
    const slots     = document.getElementById('cal-slots');
    const dataLabel = document.getElementById('cal-data-label');

    const modal             = document.getElementById('modal-confirmacao');
    const modalTxtData      = document.getElementById('modal-txt-data');
    const modalTxtHora      = document.getElementById('modal-txt-hora');
    const btnModalCancelar  = document.getElementById('btn-modal-cancelar');
    const btnModalConfirmar = document.getElementById('btn-modal-confirmar');

    const modalErro          = document.getElementById('modal-erro');
    const modalErroMsg       = document.getElementById('modal-erro-mensagem');
    const btnModalErroFechar = document.getElementById('btn-modal-erro-fechar');

    const btnCentral        = document.getElementById('btn-central-agendamentos');
    const modalCentral      = document.getElementById('modal-central');
    const btnFecharCentral  = document.getElementById('btn-fechar-central');
    const listaAgendamentos = document.getElementById('lista-meus-agendamentos');

    const modalConfirmaCancel = document.getElementById('modal-confirma-cancelar');
    const btnCancelarNao      = document.getElementById('btn-cancelar-nao');
    const btnCancelarSim      = document.getElementById('btn-cancelar-sim');

    const modalLimite        = document.getElementById('modal-limite-atingido');
    const btnLimiteEntendido = document.getElementById('btn-limite-entendido');

    const modalConfirmaReagendar = document.getElementById('modal-confirma-reagendar');
    const btnReagendarNao        = document.getElementById('btn-reagendar-nao');
    const btnReagendarSim        = document.getElementById('btn-reagendar-sim');

    function renderCalendario() {
        grid.innerHTML = '';
        horarios.classList.add('oculto');

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const ano = viewDate.getFullYear();
        const mes = viewDate.getMonth();

        titulo.textContent = new Date(ano, mes, 1, 12, 0, 0)
            .toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

        const primeiroDia = new Date(ano, mes, 1, 12, 0, 0).getDay();
        const totalDias   = new Date(ano, mes + 1, 0, 12, 0, 0).getDate();

        for (let i = 0; i < primeiroDia; i++) {
            const vazio = document.createElement('div');
            vazio.className = 'cal-cel vazio';
            grid.appendChild(vazio);
        }

        for (let d = 1; d <= totalDias; d++) {
            const data = new Date(ano, mes, d, 0, 0, 0, 0);
            const cel = document.createElement('div');
            cel.className = 'cal-cel';

            const num = document.createElement('span');
            num.className = 'cal-num';
            num.textContent = d;
            cel.appendChild(num);

            let totalSlotsDia = 0;
            let slotsBloqueadosDia = 0;
            for (let min = HORA_INICIO * 60; min < HORA_FIM * 60; min += PASSO_MIN) {
                totalSlotsDia++;
                const h = Math.floor(min / 60);
                const m = min % 60;
                const chaveDataHora = `${toKey(data)} ${pad(h)}:${pad(m)}:00`;
                if (listaBloqueada.includes(chaveDataHora)) {
                    slotsBloqueadosDia++;
                }
            }
            const diaEsgotado = totalSlotsDia > 0 && slotsBloqueadosDia === totalSlotsDia;

            if (data < hoje) {
                cel.classList.add('passado');
            } else {
                cel.classList.add('disponivel');
                if (data.getTime() === hoje.getTime()) cel.classList.add('hoje');

                if (diaEsgotado) {
                    cel.classList.add('indisponivel');
                } else {
                    cel.addEventListener('click', () => abrirHorarios(data, cel));
                }
            }

            grid.appendChild(cel);
        }
    }

    function abrirHorarios(data, cel) {
        document.querySelectorAll('.cal-cel.selecionado').forEach(el => el.classList.remove('selecionado'));
        cel.classList.add('selecionado');
        dataSelecionada = data;

        dataLabel.textContent = data.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
        slots.innerHTML = '';

        const agora = new Date();
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        for (let min = HORA_INICIO * 60; min < HORA_FIM * 60; min += PASSO_MIN) {
            const h = Math.floor(min / 60);
            const m = min % 60;

            const slot = document.createElement('button');
            slot.className = 'slot';
            slot.textContent = `${pad(h)}:${pad(m)}`;

            const chaveDataHora = `${toKey(data)} ${pad(h)}:${pad(m)}:00`;
            const horaDoSlotPassou = (data.getTime() === hoje.getTime()) &&
                                     ((h * 60 + m) <= (agora.getHours() * 60 + agora.getMinutes()));

            if (listaBloqueada.includes(chaveDataHora) || horaDoSlotPassou) {
                slot.classList.add('bloqueado');
                slot.disabled = true;
            } else {
                slot.addEventListener('click', () => {
                    horarioPendente = `${pad(h)}:${pad(m)}:00`;
                    botaoPendente = slot;

                    modalTxtData.textContent = dataSelecionada.toLocaleDateString('pt-BR');
                    modalTxtHora.textContent = `${pad(h)}:${pad(m)}`;

                    btnModalConfirmar.disabled = false;
                    modal.style.display = 'flex';
                });
            }
            slots.appendChild(slot);
        }
        horarios.classList.remove('oculto');
    }

    btnModalCancelar.addEventListener('click', () => {
        modal.style.display = 'none';
        if (botaoPendente) botaoPendente.disabled = false;
    });

    btnModalErroFechar.addEventListener('click', () => {
        modalErro.style.display = 'none';
        if (botaoPendente) botaoPendente.disabled = false;
    });

    btnLimiteEntendido.addEventListener('click', () => {
        modalLimite.style.display = 'none';
        if (botaoPendente) botaoPendente.disabled = false;
    });

    btnModalConfirmar.addEventListener('click', () => {
        btnModalConfirmar.disabled = true;

        fetch('/calendario/agendar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: toKey(dataSelecionada), hora: horarioPendente })
        })
        .then(response => response.json())
        .then(dados => {
            modal.style.display = 'none';

            if (dados.status === 'sucesso') {
                window.location.reload();
            } else if (dados.status === 'limite_atingido') {
                modalLimite.style.display = 'flex';
            } else {
                modalErroMsg.textContent = dados.mensagem;
                modalErro.style.display = 'flex';
            }
        })
        .catch(() => {
            modal.style.display = 'none';
            modalErroMsg.textContent = "Erro de rede ao conectar com o servidor.";
            modalErro.style.display = 'flex';
        });
    });

    btnCentral.addEventListener('click', () => {
        modalCentral.style.display = 'flex';
        carregarMeusAgendamentos();
    });

    btnFecharCentral.addEventListener('click', () => {
        modalCentral.style.display = 'none';
    });

    function carregarMeusAgendamentos() {
        listaAgendamentos.innerHTML = '<p class="carregando">Buscando...</p>';
        fetch('/calendario/meu-agendamento')
            .then(res => res.json())
            .then(dados => {
                listaAgendamentos.innerHTML = '';
                if(!dados || dados.length === 0) {
                    listaAgendamentos.innerHTML = '<p class="lista-vazia">Nenhum agendamento ativo encontrado.</p>';
                    return;
                }
                dados.forEach(ag => {
                    const item = document.createElement('div');
                    item.className = 'item-agendamento';
                    item.innerHTML = `
                        <div class="info-agendamento">
                            <strong>Sessão de Acolhimento</strong>
                            <span>📅 ${ag.data} às ⏰ ${ag.hora}</span>
                        </div>
                        <div class="acoes-agendamento">
                            <button class="btn-reagendar-job" onclick="reagendarLinha(${ag.id})">Reagendar</button>
                            <button class="btn-cancelar-job" onclick="cancelarLinha(${ag.id})">Cancelar</button>
                        </div>
                    `;
                    listaAgendamentos.appendChild(item);
                });
            })
            .catch(() => {
                listaAgendamentos.innerHTML = '<p class="lista-vazia" style="color:red;">Erro ao processar dados da central.</p>';
            });
    }

    window.cancelarLinha = function(id) {
        idAgendamentoParaDeletar = id;
        modalConfirmaCancel.style.display = 'flex';
    };

    btnCancelarNao.addEventListener('click', () => {
        modalConfirmaCancel.style.display = 'none';
    });

    btnCancelarSim.addEventListener('click', () => {
        modalConfirmaCancel.style.display = 'none';
        if (idAgendamentoParaDeletar) {
            fetch(`/calendario/cancelar/${idAgendamentoParaDeletar}`, { method: 'DELETE' })
            .then(() => {
                window.location.reload();
            });
        }
    });

    window.reagendarLinha = function(id) {
        idAgendamentoParaReagendar = id;
        modalConfirmaReagendar.style.display = 'flex';
    };

    btnReagendarNao.addEventListener('click', () => {
        modalConfirmaReagendar.style.display = 'none';
    });

    btnReagendarSim.addEventListener('click', () => {
        modalConfirmaReagendar.style.display = 'none';
        if (idAgendamentoParaReagendar) {
            fetch(`/calendario/cancelar/${idAgendamentoParaReagendar}`, { method: 'DELETE' })
            .then(() => {
                modalCentral.style.display = 'none';
                window.location.reload();
            });
        }
    });

    document.getElementById('cal-prev').addEventListener('click', () => {
        viewDate.setMonth(viewDate.getMonth() - 1);
        renderCalendario();
    });

    document.getElementById('cal-next').addEventListener('click', () => {
        viewDate.setMonth(viewDate.getMonth() + 1);
        renderCalendario();
    });

    renderCalendario();
});