import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UrlShortenerService } from './services';
import { UrlShortnerRepository } from './url-shortner.repository';

jest.mock('@app/common', () => ({
  encodeBase62: jest.fn(() => `yHK7jd`),
}));

describe('UrlShortenerService', () => {
  let service: UrlShortenerService;
  let repository: Partial<Record<keyof UrlShortnerRepository, jest.Mock>>;

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      findOneAndUpdate: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlShortenerService,
        { provide: UrlShortnerRepository, useValue: repository },
      ],
    }).compile();

    service = module.get<UrlShortenerService>(UrlShortenerService);
  });

  describe('create', () => {
    it('should create a short URL and return updated entity', async () => {
      const dto = { originalUrl: 'https://github.com/Gloryzco/url-shortner' };
      const mockCreated = {
        _id: { toString: () => '0123456789abcdef' },
        originalUrl: dto.originalUrl,
        clicks: 0,
      };
      const shortCode = 'yHK7jd';
      const mockUpdated = { ...mockCreated, shortCode };

      repository.create.mockResolvedValue(mockCreated);
      repository.findOneAndUpdate.mockResolvedValue(mockUpdated);

      const result = await service.create(dto as any);

      expect(repository.create).toHaveBeenCalledWith({
        originalUrl: dto.originalUrl,
        clicks: 0,
      });
      expect(repository.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockCreated._id },
        { shortCode },
      );
      expect(result).toEqual(mockUpdated);
    });
  });

  describe('findByCode', () => {
    it('should return URL if found', async () => {
      const mockUrl = {
        shortCode: 'abc123',
        originalUrl: 'https://google.com',
      };
      repository.findOne.mockResolvedValue(mockUrl);

      const result = await service.findByCode('abc123');
      expect(result).toEqual(mockUrl);
      expect(repository.findOne).toHaveBeenCalledWith({ shortCode: 'abc123' });
    });

    it('should throw NotFoundException if URL not found', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.findByCode('unknown')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('incrementClicks', () => {
    it('should call repository to increment clicks', async () => {
      repository.findOneAndUpdate.mockResolvedValue({});
      await service.incrementClicks('abc123');
      expect(repository.findOneAndUpdate).toHaveBeenCalledWith(
        { shortCode: 'abc123' },
        { $inc: { clicks: 1 } },
      );
    });
  });
});
