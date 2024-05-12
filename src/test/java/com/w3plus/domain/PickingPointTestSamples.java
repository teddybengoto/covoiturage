package com.w3plus.domain;

import java.util.UUID;

public class PickingPointTestSamples {

    public static PickingPoint getPickingPointSample1() {
        return new PickingPoint().id("id1").name("name1").adresse("adresse1");
    }

    public static PickingPoint getPickingPointSample2() {
        return new PickingPoint().id("id2").name("name2").adresse("adresse2");
    }

    public static PickingPoint getPickingPointRandomSampleGenerator() {
        return new PickingPoint().id(UUID.randomUUID().toString()).name(UUID.randomUUID().toString()).adresse(UUID.randomUUID().toString());
    }
}
