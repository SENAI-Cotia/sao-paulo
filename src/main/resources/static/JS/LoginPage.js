function selecionarTipo(tipo) {
    document.getElementById('btn-usuario').classList.toggle('ativo', tipo === 'usuario');
    document.getElementById('btn-psicologo').classList.toggle('ativo', tipo === 'psicologo');
}