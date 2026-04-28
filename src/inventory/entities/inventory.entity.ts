import { User } from "src/auth/entities/user.entity";
import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { InventoryItem } from "./inventory-item.entity";

@Entity()
export class Inventory {

    @PrimaryGeneratedColumn('increment')
    id: number;
    @OneToOne( () => User, user => user.inventory, {
        onDelete: "CASCADE",
    })
    @JoinColumn()
    user: User;
    @OneToMany( () => InventoryItem, item => item.inventory)
    items: InventoryItem[];

}