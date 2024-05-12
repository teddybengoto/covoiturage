package com.w3plus.domain;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Passage.
 */
@Document(collection = "passage")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Passage implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Field("star_date")
    private LocalDate starDate;

    @NotNull
    @Field("end_date")
    private LocalDate endDate;

    @NotNull
    @Field("time")
    private LocalDate time;

    @NotNull
    @Field("seat")
    private Integer seat;

    @DBRef
    @Field("passeBy")
    private PickingPoint passeBy;

    @DBRef
    @Field("driver")
    private User driver;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Passage id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public LocalDate getStarDate() {
        return this.starDate;
    }

    public Passage starDate(LocalDate starDate) {
        this.setStarDate(starDate);
        return this;
    }

    public void setStarDate(LocalDate starDate) {
        this.starDate = starDate;
    }

    public LocalDate getEndDate() {
        return this.endDate;
    }

    public Passage endDate(LocalDate endDate) {
        this.setEndDate(endDate);
        return this;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public LocalDate getTime() {
        return this.time;
    }

    public Passage time(LocalDate time) {
        this.setTime(time);
        return this;
    }

    public void setTime(LocalDate time) {
        this.time = time;
    }

    public Integer getSeat() {
        return this.seat;
    }

    public Passage seat(Integer seat) {
        this.setSeat(seat);
        return this;
    }

    public void setSeat(Integer seat) {
        this.seat = seat;
    }

    public PickingPoint getPasseBy() {
        return this.passeBy;
    }

    public void setPasseBy(PickingPoint pickingPoint) {
        this.passeBy = pickingPoint;
    }

    public Passage passeBy(PickingPoint pickingPoint) {
        this.setPasseBy(pickingPoint);
        return this;
    }

    public User getDriver() {
        return this.driver;
    }

    public void setDriver(User user) {
        this.driver = user;
    }

    public Passage driver(User user) {
        this.setDriver(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Passage)) {
            return false;
        }
        return getId() != null && getId().equals(((Passage) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Passage{" +
            "id=" + getId() +
            ", starDate='" + getStarDate() + "'" +
            ", endDate='" + getEndDate() + "'" +
            ", time='" + getTime() + "'" +
            ", seat=" + getSeat() +
            "}";
    }
}
