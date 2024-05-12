package com.w3plus.repository;

import com.w3plus.domain.PickingPoint;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the PickingPoint entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PickingPointRepository extends MongoRepository<PickingPoint, String> {}
