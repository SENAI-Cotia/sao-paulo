package com.entrenos.repository;

import com.entrenos.model.Triagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface TriagemRepository extends JpaRepository<Triagem, Long> {
}