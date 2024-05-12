package com.w3plus.web.rest;

import com.w3plus.domain.PickingPoint;
import com.w3plus.repository.PickingPointRepository;
import com.w3plus.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.w3plus.domain.PickingPoint}.
 */
@RestController
@RequestMapping("/api/picking-points")
public class PickingPointResource {

    private final Logger log = LoggerFactory.getLogger(PickingPointResource.class);

    private static final String ENTITY_NAME = "pickingPoint";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PickingPointRepository pickingPointRepository;

    public PickingPointResource(PickingPointRepository pickingPointRepository) {
        this.pickingPointRepository = pickingPointRepository;
    }

    /**
     * {@code POST  /picking-points} : Create a new pickingPoint.
     *
     * @param pickingPoint the pickingPoint to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new pickingPoint, or with status {@code 400 (Bad Request)} if the pickingPoint has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<PickingPoint> createPickingPoint(@Valid @RequestBody PickingPoint pickingPoint) throws URISyntaxException {
        log.debug("REST request to save PickingPoint : {}", pickingPoint);
        if (pickingPoint.getId() != null) {
            throw new BadRequestAlertException("A new pickingPoint cannot already have an ID", ENTITY_NAME, "idexists");
        }
        pickingPoint = pickingPointRepository.save(pickingPoint);
        return ResponseEntity.created(new URI("/api/picking-points/" + pickingPoint.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, pickingPoint.getId()))
            .body(pickingPoint);
    }

    /**
     * {@code PUT  /picking-points/:id} : Updates an existing pickingPoint.
     *
     * @param id the id of the pickingPoint to save.
     * @param pickingPoint the pickingPoint to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pickingPoint,
     * or with status {@code 400 (Bad Request)} if the pickingPoint is not valid,
     * or with status {@code 500 (Internal Server Error)} if the pickingPoint couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<PickingPoint> updatePickingPoint(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody PickingPoint pickingPoint
    ) throws URISyntaxException {
        log.debug("REST request to update PickingPoint : {}, {}", id, pickingPoint);
        if (pickingPoint.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pickingPoint.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pickingPointRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        pickingPoint = pickingPointRepository.save(pickingPoint);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, pickingPoint.getId()))
            .body(pickingPoint);
    }

    /**
     * {@code PATCH  /picking-points/:id} : Partial updates given fields of an existing pickingPoint, field will ignore if it is null
     *
     * @param id the id of the pickingPoint to save.
     * @param pickingPoint the pickingPoint to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pickingPoint,
     * or with status {@code 400 (Bad Request)} if the pickingPoint is not valid,
     * or with status {@code 404 (Not Found)} if the pickingPoint is not found,
     * or with status {@code 500 (Internal Server Error)} if the pickingPoint couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<PickingPoint> partialUpdatePickingPoint(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody PickingPoint pickingPoint
    ) throws URISyntaxException {
        log.debug("REST request to partial update PickingPoint partially : {}, {}", id, pickingPoint);
        if (pickingPoint.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pickingPoint.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pickingPointRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PickingPoint> result = pickingPointRepository
            .findById(pickingPoint.getId())
            .map(existingPickingPoint -> {
                if (pickingPoint.getName() != null) {
                    existingPickingPoint.setName(pickingPoint.getName());
                }
                if (pickingPoint.getAdresse() != null) {
                    existingPickingPoint.setAdresse(pickingPoint.getAdresse());
                }

                return existingPickingPoint;
            })
            .map(pickingPointRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, pickingPoint.getId())
        );
    }

    /**
     * {@code GET  /picking-points} : get all the pickingPoints.
     *
     * @param pageable the pagination information.
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of pickingPoints in body.
     */
    @GetMapping("")
    public ResponseEntity<List<PickingPoint>> getAllPickingPoints(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(name = "filter", required = false) String filter
    ) {
        if ("passages-is-null".equals(filter)) {
            log.debug("REST request to get all PickingPoints where passages is null");
            return new ResponseEntity<>(
                StreamSupport.stream(pickingPointRepository.findAll().spliterator(), false)
                    .filter(pickingPoint -> pickingPoint.getPassages() == null)
                    .toList(),
                HttpStatus.OK
            );
        }
        log.debug("REST request to get a page of PickingPoints");
        Page<PickingPoint> page = pickingPointRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /picking-points/:id} : get the "id" pickingPoint.
     *
     * @param id the id of the pickingPoint to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the pickingPoint, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<PickingPoint> getPickingPoint(@PathVariable("id") String id) {
        log.debug("REST request to get PickingPoint : {}", id);
        Optional<PickingPoint> pickingPoint = pickingPointRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(pickingPoint);
    }

    /**
     * {@code DELETE  /picking-points/:id} : delete the "id" pickingPoint.
     *
     * @param id the id of the pickingPoint to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePickingPoint(@PathVariable("id") String id) {
        log.debug("REST request to delete PickingPoint : {}", id);
        pickingPointRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
