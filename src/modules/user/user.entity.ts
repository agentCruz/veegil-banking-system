import { BaseEntity, Column, CreateDateColumn, Entity, ObjectIdColumn, PrimaryColumn, Unique, UpdateDateColumn } from "typeorm";
import { UserGenderDto } from "./user.gender.enum";
import { UserType } from "./user.type";
import * as bcrypt from 'bcrypt';

@Entity()
@Unique(['phoneNumber', 'email'])
export class User extends BaseEntity implements UserType {
  @ObjectIdColumn()
  _id: string;

  @PrimaryColumn()
  id: string;
  
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  @Column()
  gender: UserGenderDto;

  @Column()
  password: string;

  @Column()
  salt: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
