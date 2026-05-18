function mostrarDados(elemento, nome, email, role) {
    document.querySelectorAll('.agendamento-item')
            .forEach(el => el.classList.remove('ativo'));

    elemento.classList.add('ativo');

    const badgeClass = role === 'ROLE_ALUNO' ? 'badge-sim' : 'badge-nao';
    const labelRole  = role === 'ROLE_ALUNO' ? 'Aluno' : 'Psicólogo';

    document.getElementById('dados-conteudo').innerHTML = `
        <div class="dados-grid">
            <div class="dados-campos">
                <div class="campo">
                    <label>Nome</label>
                    <span>${nome}</span>
                </div>
                <div class="campo">
                    <label>E-mail</label>
                    <span>${email}</span>
                </div>
                <div class="campo">
                    <label>Tipo de Perfil</label>
                    <span class="${badgeClass}">${labelRole}</span>
                </div>
            </div>
            <div class="foto-usuario">Foto</div>
        </div>
    `;
}