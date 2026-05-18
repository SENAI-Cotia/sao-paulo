package com.entrenos.repository;

import com.entrenos.model.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    boolean existsByDataAndHora(LocalDate data, LocalTime hora);

    List<Agendamento> findByUsuarioEmail(String email);

    long countByUsuarioEmail(String email);
}