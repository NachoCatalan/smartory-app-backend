import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../enums/user-role.enum";
import { Inventory } from "src/inventory/entities/inventory.entity";

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
        nullable: true,
    })
    fullName: string;
    @Column('text',{
        nullable: false,
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
    @OneToOne( () => Inventory, inventory => inventory.user, {
        eager: true,
    })
    inventory: Inventory;
}