import mongoose from 'mongoose';
import setupTestDB from '../jest/setupTestDB';
import { toJSON } from '../toJSON';
import paginate from './paginate';
import { IProject, IProjectDoc, IProjectModel, ITaskDoc, ITaskModel } from './paginate.types';

const projectSchema = new mongoose.Schema<IProjectDoc, IProjectModel>({
  name: {
    type: String,
    required: true,
  },
  milestones: {
    type: Number,
    default: 1,
  },
});

projectSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project',
});

projectSchema.plugin(paginate);
projectSchema.plugin(toJSON);
const Project = mongoose.model<IProjectDoc, IProjectModel>('Project', projectSchema);

const taskSchema = new mongoose.Schema<ITaskDoc, ITaskModel>({
  name: {
    type: String,
    required: true,
  },
  project: {
    type: String,
    ref: 'Project',
    required: true,
  },
});

taskSchema.plugin(paginate);
taskSchema.plugin(toJSON);

setupTestDB();

describe('paginate plugin', () => {
  describe('sortBy option', () => {
    test('should sort results in ascending order using createdAt by default', async () => {
      const projectOne = await Project.create({ name: 'Project One' });
      const projectTwo = await Project.create({ name: 'Project Two' });
      const projectThree = await Project.create({ name: 'Project Three' });

      const projectPages = await Project.paginate({}, {});

      expect(projectPages.results).toHaveLength(3);
      expect(projectPages.results[0]).toMatchObject({ name: projectOne.name });
      expect(projectPages.results[1]).toMatchObject({ name: projectTwo.name });
      expect(projectPages.results[2]).toMatchObject({ name: projectThree.name });
    });

    test('should sort results in ascending order if ascending sort param is specified', async () => {
      const projectOne = await Project.create({ name: 'Project One' });
      const projectTwo = await Project.create({ name: 'Project Two', milestones: 2 });
      const projectThree = await Project.create({ name: 'Project Three', milestones: 3 });

      const projectPages = await Project.paginate({}, { sortBy: 'milestones:asc' });

      expect(projectPages.results).toHaveLength(3);
      expect(projectPages.results[0]).toMatchObject({ name: projectOne.name });
      expect(projectPages.results[1]).toMatchObject({ name: projectTwo.name });
      expect(projectPages.results[2]).toMatchObject({ name: projectThree.name });
    });

    test('should sort results in descending order if descending sort param is specified', async () => {
      const projectOne = await Project.create({ name: 'Project One' });
      const projectTwo = await Project.create({ name: 'Project Two', milestones: 2 });
      const projectThree = await Project.create({ name: 'Project Three', milestones: 3 });

      const projectPages = await Project.paginate({}, { sortBy: 'milestones:desc' });

      expect(projectPages.results).toHaveLength(3);
      expect(projectPages.results[0]).toMatchObject({ name: projectThree.name });
      expect(projectPages.results[1]).toMatchObject({ name: projectTwo.name });
      expect(projectPages.results[2]).toMatchObject({ name: projectOne.name });
    });
  });

  describe('limit option', () => {
    const projects: IProject[] = [
      { name: 'Project One', milestones: 1 },
      { name: 'Project Two', milestones: 2 },
      { name: 'Project Three', milestones: 3 },
    ];
    beforeEach(async () => {
      await Project.insertMany(projects);
    });

    test('should limit returned results if limit param is specified', async () => {
      const projectPages = await Project.paginate({}, { limit: 2 });

      expect(projectPages.results).toHaveLength(2);
      expect(projectPages.results[0]).toMatchObject({ name: 'Project One' });
      expect(projectPages.results[1]).toMatchObject({ name: 'Project Two' });
    });
  });

  describe('page option', () => {
    const projects: IProject[] = [
      { name: 'Project One', milestones: 1 },
      { name: 'Project Two', milestones: 2 },
      { name: 'Project Three', milestones: 3 },
    ];
    beforeEach(async () => {
      await Project.insertMany(projects);
    });

    test('should return the correct page if page and limit params are specified', async () => {
      const projectPages = await Project.paginate({}, { limit: 2, page: 2 });

      expect(projectPages.results).toHaveLength(1);
      expect(projectPages.results[0]).toMatchObject({ name: 'Project Three' });
    });
  });
});