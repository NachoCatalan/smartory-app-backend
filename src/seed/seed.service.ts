import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ProductsService } from '../products/products.service';
import { Producer, Product, ProductCategory, ProductImage } from 'src/products/entities';
import { categories, producers, products } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Producer)
    private readonly producerRepository: Repository<Producer>,
    @InjectRepository(ProductCategory)
    private readonly categoryRepository: Repository<ProductCategory>,
    @InjectRepository(ProductImage)
    private readonly productService: ProductsService,
  ){
  }

  async populateDB() {
    try {
      await this.productRepository.deleteAll();
      await this.producerRepository.deleteAll();
      await this.categoryRepository.deleteAll();

      // Insertar categorias
      const newCategories: ProductCategory[] = [];

      categories.forEach( category => {
        newCategories.push( this.categoryRepository.create(category));
      })
      await this.categoryRepository.save(newCategories);
      // Insertar productores
      const newProducers: Producer[] = [];
      producers.forEach( producer => {
        newProducers.push( this.producerRepository.create(producer));
      })
      await this.producerRepository.save(newProducers);
      // Insertar productos
      for (const product of products) {
        await this.productService.create(product);
      }
      return {'message': 'Seed executed'}
    } catch (error) {
      throw new InternalServerErrorException(`Error: ${error}`);
    }
  }

}
