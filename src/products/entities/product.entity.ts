import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
    @Column('date')
    fabDate: Date;
    @Column('date')
    expDate: Date;
    @Column('text', {
        array: true,
        default: []
    })
    images: string[];


}
