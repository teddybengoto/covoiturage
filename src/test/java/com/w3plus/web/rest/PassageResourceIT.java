package com.w3plus.web.rest;

import static com.w3plus.domain.PassageAsserts.*;
import static com.w3plus.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.w3plus.IntegrationTest;
import com.w3plus.domain.Passage;
import com.w3plus.domain.PickingPoint;
import com.w3plus.domain.User;
import com.w3plus.repository.PassageRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Integration tests for the {@link PassageResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PassageResourceIT {

    private static final LocalDate DEFAULT_STAR_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_STAR_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_END_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_END_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_TIME = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_TIME = LocalDate.now(ZoneId.systemDefault());

    private static final Integer DEFAULT_SEAT = 1;
    private static final Integer UPDATED_SEAT = 2;

    private static final String ENTITY_API_URL = "/api/passages";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ObjectMapper om;

    @Autowired
    private PassageRepository passageRepository;

    @Autowired
    private MockMvc restPassageMockMvc;

    private Passage passage;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Passage createEntity() {
        Passage passage = new Passage().starDate(DEFAULT_STAR_DATE).endDate(DEFAULT_END_DATE).time(DEFAULT_TIME).seat(DEFAULT_SEAT);
        // Add required entity
        PickingPoint pickingPoint;
        pickingPoint = PickingPointResourceIT.createEntity();
        pickingPoint.setId("fixed-id-for-tests");
        passage.setPasseBy(pickingPoint);
        // Add required entity
        User user = UserResourceIT.createEntity();
        user.setId("fixed-id-for-tests");
        passage.setDriver(user);
        return passage;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Passage createUpdatedEntity() {
        Passage passage = new Passage().starDate(UPDATED_STAR_DATE).endDate(UPDATED_END_DATE).time(UPDATED_TIME).seat(UPDATED_SEAT);
        // Add required entity
        PickingPoint pickingPoint;
        pickingPoint = PickingPointResourceIT.createUpdatedEntity();
        pickingPoint.setId("fixed-id-for-tests");
        passage.setPasseBy(pickingPoint);
        // Add required entity
        User user = UserResourceIT.createEntity();
        user.setId("fixed-id-for-tests");
        passage.setDriver(user);
        return passage;
    }

    @BeforeEach
    public void initTest() {
        passageRepository.deleteAll();
        passage = createEntity();
    }

    @Test
    void createPassage() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Passage
        var returnedPassage = om.readValue(
            restPassageMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(passage)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Passage.class
        );

        // Validate the Passage in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertPassageUpdatableFieldsEquals(returnedPassage, getPersistedPassage(returnedPassage));
    }

    @Test
    void createPassageWithExistingId() throws Exception {
        // Create the Passage with an existing ID
        passage.setId("existing_id");

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPassageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(passage)))
            .andExpect(status().isBadRequest());

        // Validate the Passage in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    void checkStarDateIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        passage.setStarDate(null);

        // Create the Passage, which fails.

        restPassageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(passage)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void checkEndDateIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        passage.setEndDate(null);

        // Create the Passage, which fails.

        restPassageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(passage)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void checkTimeIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        passage.setTime(null);

        // Create the Passage, which fails.

        restPassageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(passage)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void checkSeatIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        passage.setSeat(null);

        // Create the Passage, which fails.

        restPassageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(passage)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void getAllPassages() throws Exception {
        // Initialize the database
        passageRepository.save(passage);

        // Get all the passageList
        restPassageMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(passage.getId())))
            .andExpect(jsonPath("$.[*].starDate").value(hasItem(DEFAULT_STAR_DATE.toString())))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(DEFAULT_END_DATE.toString())))
            .andExpect(jsonPath("$.[*].time").value(hasItem(DEFAULT_TIME.toString())))
            .andExpect(jsonPath("$.[*].seat").value(hasItem(DEFAULT_SEAT)));
    }

    @Test
    void getPassage() throws Exception {
        // Initialize the database
        passageRepository.save(passage);

        // Get the passage
        restPassageMockMvc
            .perform(get(ENTITY_API_URL_ID, passage.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(passage.getId()))
            .andExpect(jsonPath("$.starDate").value(DEFAULT_STAR_DATE.toString()))
            .andExpect(jsonPath("$.endDate").value(DEFAULT_END_DATE.toString()))
            .andExpect(jsonPath("$.time").value(DEFAULT_TIME.toString()))
            .andExpect(jsonPath("$.seat").value(DEFAULT_SEAT));
    }

    @Test
    void getNonExistingPassage() throws Exception {
        // Get the passage
        restPassageMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingPassage() throws Exception {
        // Initialize the database
        passageRepository.save(passage);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the passage
        Passage updatedPassage = passageRepository.findById(passage.getId()).orElseThrow();
        updatedPassage.starDate(UPDATED_STAR_DATE).endDate(UPDATED_END_DATE).time(UPDATED_TIME).seat(UPDATED_SEAT);

        restPassageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPassage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedPassage))
            )
            .andExpect(status().isOk());

        // Validate the Passage in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedPassageToMatchAllProperties(updatedPassage);
    }

    @Test
    void putNonExistingPassage() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        passage.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPassageMockMvc
            .perform(put(ENTITY_API_URL_ID, passage.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(passage)))
            .andExpect(status().isBadRequest());

        // Validate the Passage in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchPassage() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        passage.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPassageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(passage))
            )
            .andExpect(status().isBadRequest());

        // Validate the Passage in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamPassage() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        passage.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPassageMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(passage)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Passage in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdatePassageWithPatch() throws Exception {
        // Initialize the database
        passageRepository.save(passage);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the passage using partial update
        Passage partialUpdatedPassage = new Passage();
        partialUpdatedPassage.setId(passage.getId());

        partialUpdatedPassage.starDate(UPDATED_STAR_DATE).endDate(UPDATED_END_DATE).time(UPDATED_TIME);

        restPassageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPassage.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPassage))
            )
            .andExpect(status().isOk());

        // Validate the Passage in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPassageUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedPassage, passage), getPersistedPassage(passage));
    }

    @Test
    void fullUpdatePassageWithPatch() throws Exception {
        // Initialize the database
        passageRepository.save(passage);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the passage using partial update
        Passage partialUpdatedPassage = new Passage();
        partialUpdatedPassage.setId(passage.getId());

        partialUpdatedPassage.starDate(UPDATED_STAR_DATE).endDate(UPDATED_END_DATE).time(UPDATED_TIME).seat(UPDATED_SEAT);

        restPassageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPassage.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPassage))
            )
            .andExpect(status().isOk());

        // Validate the Passage in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPassageUpdatableFieldsEquals(partialUpdatedPassage, getPersistedPassage(partialUpdatedPassage));
    }

    @Test
    void patchNonExistingPassage() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        passage.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPassageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, passage.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(passage))
            )
            .andExpect(status().isBadRequest());

        // Validate the Passage in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchPassage() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        passage.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPassageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(passage))
            )
            .andExpect(status().isBadRequest());

        // Validate the Passage in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamPassage() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        passage.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPassageMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(passage)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Passage in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void deletePassage() throws Exception {
        // Initialize the database
        passageRepository.save(passage);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the passage
        restPassageMockMvc
            .perform(delete(ENTITY_API_URL_ID, passage.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return passageRepository.count();
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

    protected Passage getPersistedPassage(Passage passage) {
        return passageRepository.findById(passage.getId()).orElseThrow();
    }

    protected void assertPersistedPassageToMatchAllProperties(Passage expectedPassage) {
        assertPassageAllPropertiesEquals(expectedPassage, getPersistedPassage(expectedPassage));
    }

    protected void assertPersistedPassageToMatchUpdatableProperties(Passage expectedPassage) {
        assertPassageAllUpdatablePropertiesEquals(expectedPassage, getPersistedPassage(expectedPassage));
    }
}
