import { Product } from "src/products/entities";
import { ProductStatus, Unit } from "../enums";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Inventory } from "./inventory.entity";

@Entity()
@Unique(['inventory', 'product'])
export class InventoryItem {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne( () => Inventory, inventory => inventory.items, {
        onDelete: 'CASCADE'
    })
    inventory: Inventory;
    @ManyToOne( () => Product, product => product.inventory, {
        eager: true
    } ) 
    product: Product;
    @Column('float', {
        nullable: false
    })
    quantity: number;
    // @Column('text', {
    //     nullable: false
    // })
    // unit: Unit;
    // @Column('float', {
    //     nullable: true
    // })
    // initialQuantity: number;
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