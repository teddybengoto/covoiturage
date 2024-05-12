package com.w3plus.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

public class PassageTestSamples {

    private static final Random random = new Random();
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Passage getPassageSample1() {
        return new Passage().id("id1").seat(1);
    }

    public static Passage getPassageSample2() {
        return new Passage().id("id2").seat(2);
    }

    public static Passage getPassageRandomSampleGenerator() {
        return new Passage().id(UUID.randomUUID().toString()).seat(intCount.incrementAndGet());
    }
}
