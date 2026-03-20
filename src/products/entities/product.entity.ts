import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { Producer } from "./producer.entity";
import { ProductCategory } from "./product-category.entity";

@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column('text', {
        unique: true,
        nullable: false
    })
    name: string;
    @Column('text')
    description: string;
    @Column('date',{
        nullable: true
    })
    fabDate?: Date;
    @Column('date',{
        nullable: true
    })
    expDate?: Date;
    @Column('text', {
        array: true,
        default: []
    })
    @OneToMany( () => ProductImage, productImage => productImage.product, {
        cascade: true,
        eager: true
    })
    images?: ProductImage[];
    @ManyToOne( () => Producer, producer => producer.product, {
        eager: true,
        cascade: false,
    })
    producer?: Producer;
    @ManyToOne( () => ProductCategory, category => category.product, {
        eager: true,
        cascade: false,
    })
    category?: ProductCategory;

}
