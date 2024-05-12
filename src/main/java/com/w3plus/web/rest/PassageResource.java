package com.w3plus.web.rest;

import com.w3plus.domain.Passage;
import com.w3plus.repository.PassageRepository;
import com.w3plus.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.w3plus.domain.Passage}.
 */
@RestController
@RequestMapping("/api/passages")
public class PassageResource {

    private final Logger log = LoggerFactory.getLogger(PassageResource.class);

    private static final String ENTITY_NAME = "passage";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PassageRepository passageRepository;

    public PassageResource(PassageRepository passageRepository) {
        this.passageRepository = passageRepository;
    }

    /**
     * {@code POST  /passages} : Create a new passage.
     *
     * @param passage the passage to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new passage, or with status {@code 400 (Bad Request)} if the passage has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Passage> createPassage(@Valid @RequestBody Passage passage) throws URISyntaxException {
        log.debug("REST request to save Passage : {}", passage);
        if (passage.getId() != null) {
            throw new BadRequestAlertException("A new passage cannot already have an ID", ENTITY_NAME, "idexists");
        }
        passage = passageRepository.save(passage);
        return ResponseEntity.created(new URI("/api/passages/" + passage.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, passage.getId()))
            .body(passage);
    }

    /**
     * {@code PUT  /passages/:id} : Updates an existing passage.
     *
     * @param id the id of the passage to save.
     * @param passage the passage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated passage,
     * or with status {@code 400 (Bad Request)} if the passage is not valid,
     * or with status {@code 500 (Internal Server Error)} if the passage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Passage> updatePassage(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody Passage passage
    ) throws URISyntaxException {
        log.debug("REST request to update Passage : {}, {}", id, passage);
        if (passage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, passage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!passageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        passage = passageRepository.save(passage);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, passage.getId()))
            .body(passage);
    }

    /**
     * {@code PATCH  /passages/:id} : Partial updates given fields of an existing passage, field will ignore if it is null
     *
     * @param id the id of the passage to save.
     * @param passage the passage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated passage,
     * or with status {@code 400 (Bad Request)} if the passage is not valid,
     * or with status {@code 404 (Not Found)} if the passage is not found,
     * or with status {@code 500 (Internal Server Error)} if the passage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Passage> partialUpdatePassage(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody Passage passage
    ) throws URISyntaxException {
        log.debug("REST request to partial update Passage partially : {}, {}", id, passage);
        if (passage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, passage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!passageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Passage> result = passageRepository
            .findById(passage.getId())
            .map(existingPassage -> {
                if (passage.getStarDate() != null) {
                    existingPassage.setStarDate(passage.getStarDate());
                }
                if (passage.getEndDate() != null) {
                    existingPassage.setEndDate(passage.getEndDate());
                }
                if (passage.getTime() != null) {
                    existingPassage.setTime(passage.getTime());
                }
                if (passage.getSeat() != null) {
                    existingPassage.setSeat(passage.getSeat());
                }

                return existingPassage;
            })
            .map(passageRepository::save);

        return ResponseUtil.wrapOrNotFound(result, HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, passage.getId()));
    }

    /**
     * {@code GET  /passages} : get all the passages.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of passages in body.
     */
    @GetMapping("")
    public ResponseEntity<List<Passage>> getAllPassages(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Passages");
        Page<Passage> page = passageRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /passages/:id} : get the "id" passage.
     *
     * @param id the id of the passage to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the passage, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Passage> getPassage(@PathVariable("id") String id) {
        log.debug("REST request to get Passage : {}", id);
        Optional<Passage> passage = passageRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(passage);
    }

    /**
     * {@code DELETE  /passages/:id} : delete the "id" passage.
     *
     * @param id the id of the passage to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePassage(@PathVariable("id") String id) {
        log.debug("REST request to delete Passage : {}", id);
        passageRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
