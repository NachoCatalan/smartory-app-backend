import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { Producer } from "./producer.entity";
import { ProductCategory } from "./product-category.entity";
import { InventoryProduct } from "src/inventory/entities/inventory-product.entity";

@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column('text', {
        nullable: false
    })
    name: string;
    @Column('text',{
        nullable: true
    })
    description?: string;
    @OneToMany( () => ProductImage, productImage => productImage.product, {
        cascade: true,
        eager: true
    })
    images?: ProductImage[];
    @ManyToOne( () => Producer, producer => producer.products, {
        eager: true,
        cascade: false,
    })
    producer?: Producer;
    @ManyToOne( () => ProductCategory, category => category.product, {
        eager: true,
        cascade: false,
    })
    category?: ProductCategory;
    @OneToMany( () => InventoryProduct, inv => inv.product )
    inventory?: InventoryProduct[];

}
