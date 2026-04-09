import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../enums/user-role.enum";
import { InventoryProduct } from "src/inventory/entities/inventory-product.entity";

@Entity()
export class User {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column('text',{
        unique: true,
        nullable: false,
    })
    email: string;
    @Column('text',{
        nullable: false,
    })
    fullName: string;
    @Column('text',{
        nullable: false
    })
    password: string;
    @Column('text',{
        default: [Role.USER],
        array: true,
        select: false
    })
    roles: Role[];

    @Column('text', {
        nullable: true
    })
    refreshToken: string;

    @OneToMany( () => InventoryProduct, inv => inv.user )
    inventory: InventoryProduct[];
}