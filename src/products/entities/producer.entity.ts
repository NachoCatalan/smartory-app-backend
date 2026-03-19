import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class Producer {

    @PrimaryGeneratedColumn('identity')
    id: string;
    @Column('text',{
        unique:true,
        default: 'no specified'
    })
    name: string;
    @OneToMany( () => Product, product => product.producer )
    product: Product[];
}