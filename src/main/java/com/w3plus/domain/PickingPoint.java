package com.w3plus.domain;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A PickingPoint.
 */
@Document(collection = "picking_point")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PickingPoint implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Field("name")
    private String name;

    @NotNull
    @Field("adresse")
    private String adresse;

    @DBRef
    private Passage passages;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public PickingPoint id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public PickingPoint name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAdresse() {
        return this.adresse;
    }

    public PickingPoint adresse(String adresse) {
        this.setAdresse(adresse);
        return this;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public Passage getPassages() {
        return this.passages;
    }

    public void setPassages(Passage passage) {
        if (this.passages != null) {
            this.passages.setPasseBy(null);
        }
        if (passage != null) {
            passage.setPasseBy(this);
        }
        this.passages = passage;
    }

    public PickingPoint passages(Passage passage) {
        this.setPassages(passage);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PickingPoint)) {
            return false;
        }
        return getId() != null && getId().equals(((PickingPoint) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PickingPoint{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", adresse='" + getAdresse() + "'" +
            "}";
    }
}
