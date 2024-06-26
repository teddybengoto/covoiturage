package com.w3plus.domain;

import static org.assertj.core.api.Assertions.assertThat;

public class PassageAsserts {

    /**
     * Asserts that the entity has all properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertPassageAllPropertiesEquals(Passage expected, Passage actual) {
        assertPassageAutoGeneratedPropertiesEquals(expected, actual);
        assertPassageAllUpdatablePropertiesEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all updatable properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertPassageAllUpdatablePropertiesEquals(Passage expected, Passage actual) {
        assertPassageUpdatableFieldsEquals(expected, actual);
        assertPassageUpdatableRelationshipsEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all the auto generated properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertPassageAutoGeneratedPropertiesEquals(Passage expected, Passage actual) {
        assertThat(expected)
            .as("Verify Passage auto generated properties")
            .satisfies(e -> assertThat(e.getId()).as("check id").isEqualTo(actual.getId()));
    }

    /**
     * Asserts that the entity has all the updatable fields set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertPassageUpdatableFieldsEquals(Passage expected, Passage actual) {
        assertThat(expected)
            .as("Verify Passage relevant properties")
            .satisfies(e -> assertThat(e.getStarDate()).as("check starDate").isEqualTo(actual.getStarDate()))
            .satisfies(e -> assertThat(e.getEndDate()).as("check endDate").isEqualTo(actual.getEndDate()))
            .satisfies(e -> assertThat(e.getTime()).as("check time").isEqualTo(actual.getTime()))
            .satisfies(e -> assertThat(e.getSeat()).as("check seat").isEqualTo(actual.getSeat()));
    }

    /**
     * Asserts that the entity has all the updatable relationships set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertPassageUpdatableRelationshipsEquals(Passage expected, Passage actual) {
        assertThat(expected)
            .as("Verify Passage relationships")
            .satisfies(e -> assertThat(e.getPasseBy()).as("check passeBy").isEqualTo(actual.getPasseBy()));
    }
}
