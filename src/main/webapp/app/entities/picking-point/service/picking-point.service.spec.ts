import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPickingPoint } from '../picking-point.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../picking-point.test-samples';

import { PickingPointService } from './picking-point.service';

const requireRestSample: IPickingPoint = {
  ...sampleWithRequiredData,
};

describe('PickingPoint Service', () => {
  let service: PickingPointService;
  let httpMock: HttpTestingController;
  let expectedResult: IPickingPoint | IPickingPoint[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PickingPointService);
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

    it('should create a PickingPoint', () => {
      const pickingPoint = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(pickingPoint).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PickingPoint', () => {
      const pickingPoint = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(pickingPoint).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PickingPoint', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PickingPoint', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a PickingPoint', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPickingPointToCollectionIfMissing', () => {
      it('should add a PickingPoint to an empty array', () => {
        const pickingPoint: IPickingPoint = sampleWithRequiredData;
        expectedResult = service.addPickingPointToCollectionIfMissing([], pickingPoint);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pickingPoint);
      });

      it('should not add a PickingPoint to an array that contains it', () => {
        const pickingPoint: IPickingPoint = sampleWithRequiredData;
        const pickingPointCollection: IPickingPoint[] = [
          {
            ...pickingPoint,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPickingPointToCollectionIfMissing(pickingPointCollection, pickingPoint);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PickingPoint to an array that doesn't contain it", () => {
        const pickingPoint: IPickingPoint = sampleWithRequiredData;
        const pickingPointCollection: IPickingPoint[] = [sampleWithPartialData];
        expectedResult = service.addPickingPointToCollectionIfMissing(pickingPointCollection, pickingPoint);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pickingPoint);
      });

      it('should add only unique PickingPoint to an array', () => {
        const pickingPointArray: IPickingPoint[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const pickingPointCollection: IPickingPoint[] = [sampleWithRequiredData];
        expectedResult = service.addPickingPointToCollectionIfMissing(pickingPointCollection, ...pickingPointArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const pickingPoint: IPickingPoint = sampleWithRequiredData;
        const pickingPoint2: IPickingPoint = sampleWithPartialData;
        expectedResult = service.addPickingPointToCollectionIfMissing([], pickingPoint, pickingPoint2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pickingPoint);
        expect(expectedResult).toContain(pickingPoint2);
      });

      it('should accept null and undefined values', () => {
        const pickingPoint: IPickingPoint = sampleWithRequiredData;
        expectedResult = service.addPickingPointToCollectionIfMissing([], null, pickingPoint, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pickingPoint);
      });

      it('should return initial array if no PickingPoint is added', () => {
        const pickingPointCollection: IPickingPoint[] = [sampleWithRequiredData];
        expectedResult = service.addPickingPointToCollectionIfMissing(pickingPointCollection, undefined, null);
        expect(expectedResult).toEqual(pickingPointCollection);
      });
    });

    describe('comparePickingPoint', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePickingPoint(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.comparePickingPoint(entity1, entity2);
        const compareResult2 = service.comparePickingPoint(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.comparePickingPoint(entity1, entity2);
        const compareResult2 = service.comparePickingPoint(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.comparePickingPoint(entity1, entity2);
        const compareResult2 = service.comparePickingPoint(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
