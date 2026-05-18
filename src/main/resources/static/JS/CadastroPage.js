document.addEventListener('DOMContentLoaded', function () {

    // Garante que o campo começa oculto
    document.getElementById('grupo-codigo').classList.add('oculto');

    // Botões de tipo
    document.getElementById('btn-aluno').addEventListener('click', function () {
        selecionarPerfil('aluno');
    });

    document.getElementById('btn-psi').addEventListener('click', function () {
        selecionarPerfil('psicologo');
    });

    // Validação do formulário
    document.querySelector('form').addEventListener('submit', function (e) {
        const senha = document.getElementById('senha').value;
        const confirmar = document.getElementById('confirmarSenha').value;

        if (senha !== confirmar) {
            e.preventDefault();
            const avisoExistente = document.querySelector('.aviso-senha');
            if (avisoExistente) avisoExistente.remove();
            const aviso = document.createElement('p');
            aviso.className = 'mensagem mensagem-erro aviso-senha';
            aviso.textContent = 'As senhas não coincidem.';
            document.querySelector('.btn-cadastrar').before(aviso);
            return;
        }

        const tipo = document.getElementById('tipoPerfil').value;
        if (tipo === 'psicologo') {
            const codigo = document.getElementById('codigoPsicologo').value.trim();
            if (!codigo) {
                e.preventDefault();
                const avisoExistente = document.querySelector('.aviso-codigo');
                if (avisoExistente) avisoExistente.remove();
                const aviso = document.createElement('p');
                aviso.className = 'mensagem mensagem-erro aviso-codigo';
                aviso.textContent = 'Informe o código de psicólogo.';
                document.querySelector('.btn-cadastrar').before(aviso);
            }
        }
    });

});

function selecionarPerfil(tipo) {
    document.getElementById('btn-aluno').classList.toggle('ativo', tipo === 'aluno');
    document.getElementById('btn-psi').classList.toggle('ativo', tipo === 'psicologo');
    document.getElementById('tipoPerfil').value = tipo;
    document.getElementById('grupo-codigo').classList.toggle('oculto', tipo !== 'psicologo');
}