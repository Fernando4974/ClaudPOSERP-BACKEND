import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Product } from 'src/products/entities/product.entity';
import { Sale } from 'src/sales/entities/sale.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true, nullable: false })
  email: string;

  @Column({ type: 'text', nullable: false })
  password: string;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  lastname: string;

  @Column({ type: 'text', nullable: true, array: true, default: ['user'] })
  roles: string[];

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // --- NUEVAS COLUMNAS DE MEMBRESÍA ---
  @Column({ type: 'timestamp', name: 'membership_start', nullable: true })
  membershipStart: Date;

  @Column({ type: 'timestamp', name: 'membership_end', nullable: true })
  membershipEnd: Date;
  // ------------------------------------

  @OneToMany(() => Sale, (sale) => sale.user)
  sales: Sale;

  @OneToMany(() => Product, (product) => product.user)
  products: Product;

  @BeforeInsert()
  normalizeEmail() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
  // @BeforeUpdate()
  // async hashPasswordToUpdate() {
  //   if (this.password) {
  //     this.password = await bcrypt.hash(this.password, 10);
  //   }
  // }
}
