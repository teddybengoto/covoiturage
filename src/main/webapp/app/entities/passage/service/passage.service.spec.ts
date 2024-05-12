import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IPassage } from '../passage.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../passage.test-samples';

import { PassageService, RestPassage } from './passage.service';

const requireRestSample: RestPassage = {
  ...sampleWithRequiredData,
  starDate: sampleWithRequiredData.starDate?.format(DATE_FORMAT),
  endDate: sampleWithRequiredData.endDate?.format(DATE_FORMAT),
  time: sampleWithRequiredData.time?.format(DATE_FORMAT),
};

describe('Passage Service', () => {
  let service: PassageService;
  let httpMock: HttpTestingController;
  let expectedResult: IPassage | IPassage[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PassageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find('ABC').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Passage', () => {
      const passage = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(passage).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Passage', () => {
      const passage = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(passage).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Passage', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Passage', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Passage', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPassageToCollectionIfMissing', () => {
      it('should add a Passage to an empty array', () => {
        const passage: IPassage = sampleWithRequiredData;
        expectedResult = service.addPassageToCollectionIfMissing([], passage);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(passage);
      });

      it('should not add a Passage to an array that contains it', () => {
        const passage: IPassage = sampleWithRequiredData;
        const passageCollection: IPassage[] = [
          {
            ...passage,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPassageToCollectionIfMissing(passageCollection, passage);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Passage to an array that doesn't contain it", () => {
        const passage: IPassage = sampleWithRequiredData;
        const passageCollection: IPassage[] = [sampleWithPartialData];
        expectedResult = service.addPassageToCollectionIfMissing(passageCollection, passage);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(passage);
      });

      it('should add only unique Passage to an array', () => {
        const passageArray: IPassage[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const passageCollection: IPassage[] = [sampleWithRequiredData];
        expectedResult = service.addPassageToCollectionIfMissing(passageCollection, ...passageArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const passage: IPassage = sampleWithRequiredData;
        const passage2: IPassage = sampleWithPartialData;
        expectedResult = service.addPassageToCollectionIfMissing([], passage, passage2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(passage);
        expect(expectedResult).toContain(passage2);
      });

      it('should accept null and undefined values', () => {
        const passage: IPassage = sampleWithRequiredData;
        expectedResult = service.addPassageToCollectionIfMissing([], null, passage, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(passage);
      });

      it('should return initial array if no Passage is added', () => {
        const passageCollection: IPassage[] = [sampleWithRequiredData];
        expectedResult = service.addPassageToCollectionIfMissing(passageCollection, undefined, null);
        expect(expectedResult).toEqual(passageCollection);
      });
    });

    describe('comparePassage', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePassage(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.comparePassage(entity1, entity2);
        const compareResult2 = service.comparePassage(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.comparePassage(entity1, entity2);
        const compareResult2 = service.comparePassage(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.comparePassage(entity1, entity2);
        const compareResult2 = service.comparePassage(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
