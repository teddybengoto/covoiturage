package com.w3plus.web.rest;

import static com.w3plus.domain.PickingPointAsserts.*;
import static com.w3plus.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.w3plus.IntegrationTest;
import com.w3plus.domain.PickingPoint;
import com.w3plus.repository.PickingPointRepository;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Integration tests for the {@link PickingPointResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PickingPointResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_ADRESSE = "AAAAAAAAAA";
    private static final String UPDATED_ADRESSE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/picking-points";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ObjectMapper om;

    @Autowired
    private PickingPointRepository pickingPointRepository;

    @Autowired
    private MockMvc restPickingPointMockMvc;

    private PickingPoint pickingPoint;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PickingPoint createEntity() {
        PickingPoint pickingPoint = new PickingPoint().name(DEFAULT_NAME).adresse(DEFAULT_ADRESSE);
        return pickingPoint;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PickingPoint createUpdatedEntity() {
        PickingPoint pickingPoint = new PickingPoint().name(UPDATED_NAME).adresse(UPDATED_ADRESSE);
        return pickingPoint;
    }

    @BeforeEach
    public void initTest() {
        pickingPointRepository.deleteAll();
        pickingPoint = createEntity();
    }

    @Test
    void createPickingPoint() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the PickingPoint
        var returnedPickingPoint = om.readValue(
            restPickingPointMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(pickingPoint)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            PickingPoint.class
        );

        // Validate the PickingPoint in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertPickingPointUpdatableFieldsEquals(returnedPickingPoint, getPersistedPickingPoint(returnedPickingPoint));
    }

    @Test
    void createPickingPointWithExistingId() throws Exception {
        // Create the PickingPoint with an existing ID
        pickingPoint.setId("existing_id");

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPickingPointMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(pickingPoint)))
            .andExpect(status().isBadRequest());

        // Validate the PickingPoint in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    void checkNameIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        pickingPoint.setName(null);

        // Create the PickingPoint, which fails.

        restPickingPointMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(pickingPoint)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void checkAdresseIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        pickingPoint.setAdresse(null);

        // Create the PickingPoint, which fails.

        restPickingPointMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(pickingPoint)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void getAllPickingPoints() throws Exception {
        // Initialize the database
        pickingPointRepository.save(pickingPoint);

        // Get all the pickingPointList
        restPickingPointMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pickingPoint.getId())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].adresse").value(hasItem(DEFAULT_ADRESSE)));
    }

    @Test
    void getPickingPoint() throws Exception {
        // Initialize the database
        pickingPointRepository.save(pickingPoint);

        // Get the pickingPoint
        restPickingPointMockMvc
            .perform(get(ENTITY_API_URL_ID, pickingPoint.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(pickingPoint.getId()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.adresse").value(DEFAULT_ADRESSE));
    }

    @Test
    void getNonExistingPickingPoint() throws Exception {
        // Get the pickingPoint
        restPickingPointMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingPickingPoint() throws Exception {
        // Initialize the database
        pickingPointRepository.save(pickingPoint);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the pickingPoint
        PickingPoint updatedPickingPoint = pickingPointRepository.findById(pickingPoint.getId()).orElseThrow();
        updatedPickingPoint.name(UPDATED_NAME).adresse(UPDATED_ADRESSE);

        restPickingPointMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPickingPoint.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedPickingPoint))
            )
            .andExpect(status().isOk());

        // Validate the PickingPoint in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedPickingPointToMatchAllProperties(updatedPickingPoint);
    }

    @Test
    void putNonExistingPickingPoint() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        pickingPoint.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPickingPointMockMvc
            .perform(
                put(ENTITY_API_URL_ID, pickingPoint.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(pickingPoint))
            )
            .andExpect(status().isBadRequest());

        // Validate the PickingPoint in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchPickingPoint() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        pickingPoint.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPickingPointMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(pickingPoint))
            )
            .andExpect(status().isBadRequest());

        // Validate the PickingPoint in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamPickingPoint() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        pickingPoint.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPickingPointMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(pickingPoint)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the PickingPoint in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdatePickingPointWithPatch() throws Exception {
        // Initialize the database
        pickingPointRepository.save(pickingPoint);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the pickingPoint using partial update
        PickingPoint partialUpdatedPickingPoint = new PickingPoint();
        partialUpdatedPickingPoint.setId(pickingPoint.getId());

        partialUpdatedPickingPoint.name(UPDATED_NAME).adresse(UPDATED_ADRESSE);

        restPickingPointMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPickingPoint.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPickingPoint))
            )
            .andExpect(status().isOk());

        // Validate the PickingPoint in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPickingPointUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedPickingPoint, pickingPoint),
            getPersistedPickingPoint(pickingPoint)
        );
    }

    @Test
    void fullUpdatePickingPointWithPatch() throws Exception {
        // Initialize the database
        pickingPointRepository.save(pickingPoint);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the pickingPoint using partial update
        PickingPoint partialUpdatedPickingPoint = new PickingPoint();
        partialUpdatedPickingPoint.setId(pickingPoint.getId());

        partialUpdatedPickingPoint.name(UPDATED_NAME).adresse(UPDATED_ADRESSE);

        restPickingPointMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPickingPoint.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPickingPoint))
            )
            .andExpect(status().isOk());

        // Validate the PickingPoint in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPickingPointUpdatableFieldsEquals(partialUpdatedPickingPoint, getPersistedPickingPoint(partialUpdatedPickingPoint));
    }

    @Test
    void patchNonExistingPickingPoint() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        pickingPoint.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPickingPointMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, pickingPoint.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(pickingPoint))
            )
            .andExpect(status().isBadRequest());

        // Validate the PickingPoint in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchPickingPoint() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        pickingPoint.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPickingPointMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(pickingPoint))
            )
            .andExpect(status().isBadRequest());

        // Validate the PickingPoint in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamPickingPoint() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        pickingPoint.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPickingPointMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(pickingPoint)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the PickingPoint in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void deletePickingPoint() throws Exception {
        // Initialize the database
        pickingPointRepository.save(pickingPoint);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the pickingPoint
        restPickingPointMockMvc
            .perform(delete(ENTITY_API_URL_ID, pickingPoint.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return pickingPointRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected PickingPoint getPersistedPickingPoint(PickingPoint pickingPoint) {
        return pickingPointRepository.findById(pickingPoint.getId()).orElseThrow();
    }

    protected void assertPersistedPickingPointToMatchAllProperties(PickingPoint expectedPickingPoint) {
        assertPickingPointAllPropertiesEquals(expectedPickingPoint, getPersistedPickingPoint(expectedPickingPoint));
    }

    protected void assertPersistedPickingPointToMatchUpdatableProperties(PickingPoint expectedPickingPoint) {
        assertPickingPointAllUpdatablePropertiesEquals(expectedPickingPoint, getPersistedPickingPoint(expectedPickingPoint));
    }
}
