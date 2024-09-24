import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Customer {
    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({ type : 'varchar', length : 255, nullable : true })
    firstName : string;

    @Column({ type : 'varchar', length : 255, nullable : true })
    lastName : string;

    @Column({ type : 'varchar', length : 255, nullable : false })
    city : string

    @Column({ type : 'varchar', length : 255, nullable : false })
    company : string
}
