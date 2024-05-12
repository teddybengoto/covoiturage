package com.w3plus.domain;

import static com.w3plus.domain.PassageTestSamples.*;
import static com.w3plus.domain.PickingPointTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.w3plus.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PassageTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Passage.class);
        Passage passage1 = getPassageSample1();
        Passage passage2 = new Passage();
        assertThat(passage1).isNotEqualTo(passage2);

        passage2.setId(passage1.getId());
        assertThat(passage1).isEqualTo(passage2);

        passage2 = getPassageSample2();
        assertThat(passage1).isNotEqualTo(passage2);
    }

    @Test
    void passeByTest() throws Exception {
        Passage passage = getPassageRandomSampleGenerator();
        PickingPoint pickingPointBack = getPickingPointRandomSampleGenerator();

        passage.setPasseBy(pickingPointBack);
        assertThat(passage.getPasseBy()).isEqualTo(pickingPointBack);

        passage.passeBy(null);
        assertThat(passage.getPasseBy()).isNull();
    }
}
