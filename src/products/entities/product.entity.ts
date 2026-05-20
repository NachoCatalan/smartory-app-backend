import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { Producer } from "./producer.entity";
import { ProductCategory } from "./product-category.entity";
import { InventoryItem } from "src/inventory/entities/inventory-item.entity";
import { AmountUnit } from "src/inventory/enums";

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
    @Column('float',{
        nullable: true
    })
    amount?: number;
    @Column({
        type: 'enum',
        enum: AmountUnit,
        default: AmountUnit.UN
    })
    amountUnit?: AmountUnit;
    @Column({
        type: 'text',
        nullable: true,
        unique: true
    })
    barcode?: string;
    @ManyToOne( () => ProductCategory, category => category.product, {
        eager: true,
        cascade: false,
    })
    category?: ProductCategory;
    @OneToMany( () => InventoryItem, inv => inv.product )
    inventory?: InventoryItem[];

}
