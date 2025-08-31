import {
  ClientSession,
  FilterQuery,
  InferId,
  Model,
  Query,
  PipelineStage,
  Types,
  UpdateQuery,
  ProjectionType,
  QueryOptions,
  PopulateOptions,
} from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { Logger, NotFoundException } from '@nestjs/common';
import { DeleteResult } from 'mongodb';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  async create(
    document: Omit<TDocument, '_id'>,
    session?: ClientSession,
  ): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });

    return (
      await createdDocument.save({ session })
    ).toJSON() as unknown as TDocument;
  }

  async createMany(documents: Omit<TDocument, '_id'>[]): Promise<TDocument[]> {
    return await this.model.create(
      documents.map((d) => ({ ...d, _id: new Types.ObjectId() })),
    );
  }

  async findOne(
    filterQuery: FilterQuery<TDocument>,
    select: string[] = [],
    populate: (string | PopulateOptions)[] = [],
    project: ProjectionType<TDocument> = {},
    options: QueryOptions = {},
  ): Promise<TDocument | null> {
    const document = await this.model
      .findOne(filterQuery, project, options)
      .select(select)
      .populate(populate)
      .lean<TDocument>({ virtuals: true });

    return document;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
    session?: ClientSession,
  ): Promise<TDocument> {
    const document = await this.model
      .findOneAndUpdate(filterQuery, update, {
        new: true,
        session,
      })
      .lean<TDocument>(true);

    if (!document) {
      this.logger.warn(
        'Document was not found with filter query for update',
        filterQuery,
      );

      throw new NotFoundException(`Record was not found to update`);
    }

    return document;
  }

  async find(
    filterQuery: FilterQuery<TDocument>,
    project: ProjectionType<TDocument> = {},
    options: QueryOptions = {},
  ): Promise<Partial<TDocument[]>> {
    this.logger.log(
      `Retrieving documents from the DB using find()`,
      filterQuery,
    );

    return await this.model
      .find(filterQuery, project, options)
      .lean<TDocument[]>(true);
  }

  findWithPagination(
    filterQuery: FilterQuery<TDocument>,
    populate: string[] = [],
    project: ProjectionType<TDocument> = {},
    options: QueryOptions = {},
    select: string[] = [],
  ): Query<TDocument[], TDocument, any> {
    this.logger.log(
      `Retrieving documents from the DB using find()`,
      filterQuery,
    );

    return this.model
      .find(filterQuery, project, options)
      .populate(populate)
      .select(select) as unknown as Query<TDocument[], TDocument, any>;
  }

  async findOneAndDelete(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<TDocument | null> {
    this.logger.log(`Attempting to find document and delete`, filterQuery);

    return await this.model.findOneAndDelete(filterQuery).lean<TDocument>(true);
  }

  async exists(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<{ _id: InferId<TDocument> } | null> {
    this.logger.log(`Checking if document exists`);

    return await this.model.exists(filterQuery);
  }

  async aggregate(pipeline: PipelineStage[]): Promise<TDocument[]> {
    this.logger.log(`Aggregating documents`, pipeline);

    return (await this.model.aggregate(pipeline).exec()) as TDocument[];
  }

  async findAndSave(
    filter: FilterQuery<TDocument>,
    update: Partial<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model.findOne(filter);

    if (!document) {
      this.logger.warn('Document was not found with filter query', filter);

      throw new NotFoundException(`Record was not found`);
    }

    Object.assign(document, update);

    return await document.save();
  }

  async count(filter: FilterQuery<TDocument>): Promise<number> {
    return await this.model.countDocuments(filter);
  }

  async findAndUpdateMany(
    filter: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ) {
    return await this.model.updateMany(filter, update);
  }

  async deleteMany(filter: FilterQuery<TDocument>): Promise<DeleteResult> {
    try {
      this.logger.log('Deleting documents with filter:', filter);

      const deletedResult = await this.model.deleteMany(filter);

      this.logger.log('Delete operation result:', deletedResult);

      return deletedResult;
    } catch (error) {
      this.logger.debug('Error during deleteMany operation:', error);

      throw error;
    }
  }
}
