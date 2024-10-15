import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import bcryt from 'bcrypt';

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
    GUEST = 'guest'
}

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER
    })
    role: UserRole;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcryt.hash(this.password, 10);
    }

    constructor(email: string, password: string, role: UserRole) {
        this.email = email;
        this.password = password;
        this.role = role;
    }



}