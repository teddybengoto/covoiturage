package com.w3plus.domain;

import static com.w3plus.domain.PassageTestSamples.*;
import static com.w3plus.domain.PickingPointTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.w3plus.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PickingPointTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PickingPoint.class);
        PickingPoint pickingPoint1 = getPickingPointSample1();
        PickingPoint pickingPoint2 = new PickingPoint();
        assertThat(pickingPoint1).isNotEqualTo(pickingPoint2);

        pickingPoint2.setId(pickingPoint1.getId());
        assertThat(pickingPoint1).isEqualTo(pickingPoint2);

        pickingPoint2 = getPickingPointSample2();
        assertThat(pickingPoint1).isNotEqualTo(pickingPoint2);
    }

    @Test
    void passagesTest() throws Exception {
        PickingPoint pickingPoint = getPickingPointRandomSampleGenerator();
        Passage passageBack = getPassageRandomSampleGenerator();

        pickingPoint.setPassages(passageBack);
        assertThat(pickingPoint.getPassages()).isEqualTo(passageBack);
        assertThat(passageBack.getPasseBy()).isEqualTo(pickingPoint);

        pickingPoint.passages(null);
        assertThat(pickingPoint.getPassages()).isNull();
        assertThat(passageBack.getPasseBy()).isNull();
    }
}
