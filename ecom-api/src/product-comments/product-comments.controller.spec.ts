import { Test, TestingModule } from '@nestjs/testing';
import { ProductCommentsController } from './product-comments.controller';

describe('ProductCommentsController', () => {
  let controller: ProductCommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductCommentsController],
    }).compile();

    controller = module.get<ProductCommentsController>(ProductCommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
