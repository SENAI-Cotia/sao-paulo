const INTERVALO_MIN = 20;
const HORA_INICIO   = 8;
const HORA_FIM      = 12;
const PASSO_MIN     = 30;

let viewDate        = new Date();
let dataSelecionada = null;

function pad(n) { return String(n).padStart(2, '0'); }

function toKey(d) {
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}

document.addEventListener('DOMContentLoaded', () => {

    const grid      = document.getElementById('cal-grid');
    const titulo    = document.getElementById('cal-titulo');
    const horarios  = document.getElementById('cal-horarios');
    const slots     = document.getElementById('cal-slots');
    const dataLabel = document.getElementById('cal-data-label');

    function renderCalendario() {
        grid.innerHTML = '';
        horarios.classList.add('oculto');

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const ano = viewDate.getFullYear();
        const mes = viewDate.getMonth();

        titulo.textContent = new Date(ano, mes, 1)
            .toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

        const primeiroDia = new Date(ano, mes, 1).getDay();
        const totalDias   = new Date(ano, mes + 1, 0).getDate();

        for (let i = 0; i < primeiroDia; i++) {
            const vazio = document.createElement('div');
            vazio.className = 'cal-cel vazio';
            grid.appendChild(vazio);
        }

        for (let d = 1; d <= totalDias; d++) {
            const data = new Date(ano, mes, d);
            data.setHours(0, 0, 0, 0);
            const key = toKey(data);

            const cel = document.createElement('div');
            cel.className = 'cal-cel';

            const num = document.createElement('span');
            num.className = 'cal-num';
            num.textContent = d;
            cel.appendChild(num);

            if (data < hoje) {
                cel.classList.add('passado');
            } else if (window.datasIndisponiveis.includes(key)) {
                cel.classList.add('indisponivel');
            } else {
                cel.classList.add('disponivel');
                if (data.getTime() === hoje.getTime()) cel.classList.add('hoje');
                cel.addEventListener('click', () => abrirHorarios(data, cel));
            }

            grid.appendChild(cel);
        }
    }

    function abrirHorarios(data, cel) {
        document.querySelectorAll('.cal-cel.selecionado')
                .forEach(el => el.classList.remove('selecionado'));
        cel.classList.add('selecionado');
        dataSelecionada = data;

        dataLabel.textContent = data.toLocaleDateString('pt-BR', {
            weekday: 'long', day: 'numeric', month: 'long'
        });

        slots.innerHTML = '';
        const agora = new Date();

        for (let min = HORA_INICIO * 60; min < HORA_FIM * 60; min += PASSO_MIN) {
            const h = Math.floor(min / 60);
            const m = min % 60;

            const slotTime = new Date(data);
            slotTime.setHours(h, m, 0, 0);
            const diff = (slotTime - agora) / 60000;

            const slot = document.createElement('button');
            slot.className = 'slot';
            slot.textContent = `${pad(h)}:${pad(m)}`;

            if (data.toDateString() === agora.toDateString() && diff < INTERVALO_MIN) {
                slot.classList.add('bloqueado');
                slot.disabled = true;
            } else {
                slot.addEventListener('click', () => {
                    // Conecte ao backend aqui quando tiver a rota pronta:
                    // fetch('/agendar', { method: 'POST', body: JSON.stringify({ data: toKey(dataSelecionada), hora: `${pad(h)}:${pad(m)}` }) })
                    alert(`Agendado: ${dataSelecionada.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} às ${pad(h)}:${pad(m)}`);
                    horarios.classList.add('oculto');
                    document.querySelectorAll('.cal-cel.selecionado').forEach(el => el.classList.remove('selecionado'));
                });
            }

            slots.appendChild(slot);
        }

        horarios.classList.remove('oculto');
        horarios.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    document.getElementById('cal-prev').addEventListener('click', () => {
        viewDate.setMonth(viewDate.getMonth() - 1);
        renderCalendario();
    });

    document.getElementById('cal-next').addEventListener('click', () => {
        viewDate.setMonth(viewDate.getMonth() + 1);
        renderCalendario();
    });

    renderCalendario(); //teste;
});