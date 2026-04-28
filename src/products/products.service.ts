import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Producer, ProductImage, Product, ProductCategory } from './entities';
import { PaginationDto } from 'src/common/dto/pagination.dto';

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
    private readonly dataSource: DataSource,
  ){}

  async create(createProductDto: CreateProductDto) {

    try {
      const { images = [], producer, category, ...productProps } = createProductDto;
      const product = this.productRepository.create({
        ...productProps,
        images: images.map( image => this.productImageRepository.create({url: image})), 
      });
      if( category ) {
        product.category = await this.findOrCreateCategory(category);
      }
      if( producer ) {
        product.producer = await this.findOrCreateProducer(producer);

      }
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async findOrCreateProducer( name: string ) {
    try {
      const producer = await this.producerRepository.findOneBy({name});
      if( !producer ) {
        const newProducer = this.producerRepository.create({name});
        await this.producerRepository.save(newProducer);
        return newProducer;
      }
      return producer;
    } catch (error) {
      throw new InternalServerErrorException({error});
    }
  }
  
  async findOrCreateCategory( name: string ) {
    try {
      const category = await this.categoryRepository.findOneBy({name});
      if( !category ) {
        const newCategory = this.categoryRepository.create({name});
        await this.categoryRepository.save(newCategory);
        return newCategory;
      }
      return category;
    } catch (error) {
      throw new InternalServerErrorException({error});
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.productRepository.find({
      skip: offset,
      take: limit
    });
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({where: {id}})
    if ( !product ) throw new BadRequestException(`Product with id ${id} not found`);
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    if ( Object.keys(updateProductDto).length === 0 ) throw new BadRequestException(`No entries provided`);
    const { images, producer, category, ...rest} = updateProductDto;
    const productToUpdate = await this.productRepository.preload({id,...rest});
    if( !productToUpdate ) throw new BadRequestException(`Product with id ${id} - Not found`);

    const query = this.dataSource.createQueryRunner();
    await query.connect();
    await query.startTransaction();
    try {
      if( images ) {
        await query.manager.delete(ProductImage, {product: id});
        productToUpdate.images = images.map( image => {
          return query.manager.create(ProductImage,{url: image})
        });
      }
      if ( producer ) {
        const producerToUpdate = await query.manager.findOneBy(Producer, {name: producer});
        if ( !producerToUpdate ) {
          const newProducer = query.manager.create(Producer, {name: producer});
          await query.manager.save(newProducer);
          productToUpdate.producer = newProducer;
        } else {
          productToUpdate.producer = producerToUpdate;
        }
      }
      if ( category ) {
        const categoryToupdate = await query.manager.findOneBy(ProductCategory, {name: category});
        if ( !categoryToupdate ) {
          const newCategory = query.manager.create(ProductCategory, {name: category});
          await query.manager.save(newCategory);
          productToUpdate.category = newCategory;
        } else {
          productToUpdate.category = categoryToupdate;
        }
      }
      await query.manager.save(productToUpdate);
      await query.commitTransaction();
      await query.release();
      //TODO: Mostrar todos los valores del producto (Category/producer)
      return productToUpdate;

    } catch (error) {
      await query.rollbackTransaction();
      await query.release();
      throw new InternalServerErrorException({error})
    }
  }

  async remove(id: string) {
    //TODO: Mostrar una response mas apropiada
    await this.productRepository.delete(id);
  }

  private handleDBError( error: any ) {
    if ( error.code === "23505" ) throw new BadRequestException(error.detail);
    throw new BadRequestException(error.detail);
  } 
}
