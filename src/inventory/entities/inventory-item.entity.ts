import { Product } from "src/products/entities";
import { AmountUnit, ProductStatus } from "../enums";
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
        eager: true,

    } ) 
    product: Product;
    @Column('float', {
        nullable: false
    })
    quantity: number;
    @Column('text', {
        default: AmountUnit.UN,
    })
    amountUnit: AmountUnit;
    @Column('float', {
        nullable: false
    })
    totalAmount: number;
    @Column('float', {
        nullable: false
    })
    remainingAmount: number;
    @CreateDateColumn()
    createdAt: Date;
    @Column({
        nullable: true,
    })
    expirationDate?: Date;
    @Column({
        type: 'enum',
        enum: ProductStatus,
        default: ProductStatus.AVAILABLE
    })
    status: ProductStatus;
    @Column('boolean',{
        default: false
    })
    isFavorite: boolean;

}