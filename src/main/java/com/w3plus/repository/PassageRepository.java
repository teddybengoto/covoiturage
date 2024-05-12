package com.w3plus.repository;

import com.w3plus.domain.Passage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Passage entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PassageRepository extends MongoRepository<Passage, String> {}
