import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class ProductCategory {
    @PrimaryGeneratedColumn('identity')
    id: string;
    @Column('text', {
        unique: true,
        nullable: false
    })
    name: string;
    @OneToMany( () => Product, p => p.category, {onDelete: 'CASCADE'} )
    product: Product[];
}