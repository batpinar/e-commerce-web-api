import { Test, TestingModule } from '@nestjs/testing';
import { ProductPhotosService } from './product-photos.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ProductPhotos Rules Test', () => {
  let service: ProductPhotosService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductPhotosService,
        {
          provide: PrismaService,
          useValue: {
            product: {
              findUnique: jest.fn(),
            },
            productPhoto: {
              create: jest.fn(),
              findFirst: jest.fn(),
              findUnique: jest.fn(),
              updateMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ProductPhotosService>(ProductPhotosService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('Kural 4: Birincil Fotoğraf Zorunluluğu', () => {
    it('should ensure at least one photo is primary when deleting primary photo', async () => {
      // Bu test birincil fotoğraf silindiğinde başka birinin birincil olup olmadığını kontrol eder
      const mockPhoto = { 
        id: '1', 
        productId: 'product1', 
        isPrimary: true, 
        order: 1,
        url: 'test1.jpg',
        size: 1024,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const mockNextPhoto = { 
        id: '2', 
        productId: 'product1', 
        isPrimary: false, 
        order: 2,
        url: 'test2.jpg',
        size: 1024,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockPhoto);
      jest.spyOn(prisma.productPhoto, 'delete').mockResolvedValue(mockPhoto);
      jest.spyOn(prisma.productPhoto, 'findFirst').mockResolvedValue(mockNextPhoto);
      jest.spyOn(prisma.productPhoto, 'update').mockResolvedValue({ ...mockNextPhoto, isPrimary: true });
      jest.spyOn(prisma.productPhoto, 'updateMany').mockResolvedValue({ count: 1 });

      await service.remove('1');

      expect(prisma.productPhoto.update).toHaveBeenCalledWith({
        where: { id: '2' },
        data: { isPrimary: true }
      });
    });

    it('should prevent making last primary photo non-primary', async () => {
      const mockPhoto = { 
        id: '1', 
        productId: 'product1', 
        isPrimary: true, 
        order: 1,
        url: 'test1.jpg',
        size: 1024,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockPhoto);
      jest.spyOn(prisma.productPhoto, 'findFirst').mockResolvedValue(null); // No other photos

      await expect(
        service.update('1', { isPrimary: false })
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('Kural 5: Fotoğraf Sırası Yönetimi', () => {
    it('should auto-assign order when creating new photo', async () => {
      const createDto = { productId: 'product1', url: 'test.jpg', size: 1024 };
      const mockProduct = { 
        id: 'product1',
        name: 'Test Product',
        categoryId: 'cat1',
        slug: 'test-product',
        shortDescription: 'Short desc',
        longDescription: 'Long desc',
        price: 100,
        stockQuantity: 10,
        primaryPhotoUrl: null,
        commentCount: 0,
        averageRating: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const lastPhoto = { 
        id: 'last-photo',
        productId: 'product1',
        isPrimary: false,
        url: 'last.jpg',
        size: 1024,
        order: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(prisma.product, 'findUnique').mockResolvedValue(mockProduct);
      jest.spyOn(prisma.productPhoto, 'findFirst').mockResolvedValue(lastPhoto);
      jest.spyOn(prisma.productPhoto, 'create').mockResolvedValue({
        id: 'new-photo',
        ...createDto,
        order: 4,
        isPrimary: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await service.create(createDto);

      expect(prisma.productPhoto.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          order: 4 // lastPhoto.order + 1
        })
      });
    });

    it('should reorder photos after deletion', async () => {
      const mockPhoto = { 
        id: '2', 
        productId: 'product1', 
        isPrimary: false, 
        order: 2,
        url: 'test2.jpg',
        size: 1024,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockPhoto);
      jest.spyOn(prisma.productPhoto, 'delete').mockResolvedValue(mockPhoto);
      jest.spyOn(prisma.productPhoto, 'updateMany').mockResolvedValue({ count: 2 });

      await service.remove('2');

      // Silinen fotoğraftan sonraki order değerlerini kontrol et
      expect(prisma.productPhoto.updateMany).toHaveBeenCalledWith({
        where: {
          productId: 'product1',
          order: { gt: 2 }
        },
        data: { order: { decrement: 1 } }
      });
    });
  });
});
