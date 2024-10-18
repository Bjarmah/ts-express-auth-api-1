import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn
} from 'typeorm';

@Entity("otps")
export class OTP {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    email!: string;

    @Column()
    code!: string;

    @Column()
    expiresAt!: Date;

    @CreateDateColumn()
    createdAt!: Date;

    @Column({ default: false })
    used!: boolean;
}