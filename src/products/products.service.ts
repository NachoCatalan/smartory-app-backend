import { BadRequestException, ExceptionFilter, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto, CreateProducerDto } from './dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Producer, ProductImage, Product, ProductCategory } from './entities';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    @InjectRepository(Producer)
    private readonly producerRepository: Repository<Producer>,
    @InjectRepository(ProductCategory)
    private readonly categoryRepository: Repository<ProductCategory>,
  ){}

  async create(createProductDto: CreateProductDto) {

    try {
      const { images = [], producer, category, ...productProps } = createProductDto;
      const product = this.productRepository.create({
        ...productProps,
        images: images.map( image => this.productImageRepository.create({url: image})), 
      });
      if( category ) {
        product.category = await this.findOrCreateProducerOrCategory(category, 'category') as ProductCategory;
      }
      if( producer ) {
        product.producer = await this.findOrCreateProducerOrCategory(producer, 'producer') as Producer;

      }
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async findOrCreateProducerOrCategory( name: string, entityName: string ) {
    try {
      const entity = (entityName === 'producer')
      ? await this.producerRepository.findOneBy({name})
      : await this.categoryRepository.findOneBy({name});
      if( !entity ) {
        const newEntity = this.producerRepository.create({name});
        await this.producerRepository.save(newEntity);
        return newEntity;
      }
      return entity;
    } catch (error) {
      throw new InternalServerErrorException({error});
    }
  }

  async findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  private handleDBError( error: any ) {
    if ( error.code === "23505" ) throw new BadRequestException(error.detail);
    throw new BadRequestException(error.detail);
  } 
}
