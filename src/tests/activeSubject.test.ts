import supertest from 'supertest';
import { app } from '../app';
import {
  getDummyClassId,
  getDummySubjectId,
  getDummyTeacher,
  loginAdmin,
} from './helpers';
import { PostActiveSubject } from '../validator/activeSubject.validator';

const api = supertest(app);
const activeSubjectRoute = '/api/activeSubject/';

let sessionId: string;
const dummyActiveSubject: PostActiveSubject = {
  subjectId: '',
  classId: '',
  teacherId: '',
  subjectSchedule: '1,2-3',
};

// Always non-existent ZZZ999,
// Always taken ???,
// Always allowed SSSXX, CCCXXX?
beforeAll(async () => {
  // P.S: Can be a student too, something code coverage won't get.
  sessionId = (await loginAdmin(api)) as string;
  await api.get('/testAuth').set('Cookie', [sessionId]).expect(200);

  dummyActiveSubject.classId = await getDummyClassId();
  dummyActiveSubject.subjectId = await getDummySubjectId();
  dummyActiveSubject.teacherId = (await getDummyTeacher()).id;
});

describe('CRUD of ActiveSubject', () => {
  test('POST & GET ActiveSubject', async () => {
    const post = await api
      .post(activeSubjectRoute)
      .set('Cookie', [sessionId])
      .send(dummyActiveSubject)
      .expect(200);

    const get = await api
      .get(`${activeSubjectRoute}/${post.body.serial}`)
      .set('Cookie', [sessionId])
      .expect(200);

    expect(get.body.subjectId).toMatch(dummyActiveSubject.subjectId);
    expect(get.body.classId).toEqual(dummyActiveSubject.classId);
  });
});

describe('Testing referrential integrity of activeSubject attributes', () => {
  test('Fails when Teacher does not exist', async () => {
    const wrongActiveSubject: PostActiveSubject = {
      ...dummyActiveSubject,
      teacherId: 'aed69a4a-ef04-4b64-929e-9bbb1f86f7f9',
    };

    await api
      .post(activeSubjectRoute)
      .set('Cookie', [sessionId])
      .send(wrongActiveSubject)
      .expect(400);
  });

  test('Fails when Subject does not exist', async () => {
    const wrongActiveSubject: PostActiveSubject = {
      ...dummyActiveSubject,
      subjectId: 'ZZZ000', // too lazy to make a separate function for this one.
    };

    await api
      .post(activeSubjectRoute)
      .set('Cookie', [sessionId])
      .send(wrongActiveSubject)
      .expect(400);
  });

  test('Fails when studyClass does not exist', async () => {
    const wrongActiveSubject: PostActiveSubject = {
      ...dummyActiveSubject,
      classId: 'ZZZ000',
    };

    await api
      .post(activeSubjectRoute)
      .set('Cookie', [sessionId])
      .send(wrongActiveSubject)
      .expect(400);
  });
});
