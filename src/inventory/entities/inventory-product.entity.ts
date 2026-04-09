import { Product } from "src/products/entities";
import { ProductStatus, Unit } from "../enums";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/auth/entities/user.entity";

@Entity()
export class InventoryProduct {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne( () => User, user => user.inventory, {
        onDelete: 'CASCADE'
    })
    user: User;
    @ManyToOne( () => Product, product => product.inventory ) 
    product: Product;
        
    @Column('float', {
        nullable: false
    })
    quantity: number;
    @Column('text', {
        nullable: false
    })
    unit: Unit;
    @Column('float', {
        nullable: false
    })
    initialQuantity: number;
    
    @CreateDateColumn()
    createdAt: Date;
    @Column({
        nullable: true
    })
    expirationDate?: Date;
    @Column({
        type: 'enum',
        enum: ProductStatus,
        default: ProductStatus.AVAILABLE
    })
    status: ProductStatus;

}