import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';

import { Product } from 'src/products/entities/product.entity';
import { Sale } from 'src/sales/entities/sale.entity';

@Entity({ name: 'users' })
export class User {
  @ApiProperty({
    example: '2bc0e429-5c57-48a8-8e00-520e699c3fb9',
    description: 'Identificador único del usuario (UUID)',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'admin@pos-system.com',
    description: 'Correo electrónico único para inicio de sesión',
  })
  @Column({ type: 'text', unique: true, nullable: false })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario (se guarda hasheada)',
    required: false,
    writeOnly: true, // No se muestra en las respuestas GET de Swagger
  })
  @Column({ type: 'text', nullable: false })
  password: string;

  @ApiProperty({ example: 'John', description: 'Nombre del usuario' })
  @Column({ type: 'text', nullable: false })
  name: string;

  @ApiProperty({ example: 'Doe', description: 'Apellido del usuario' })
  @Column({ type: 'text', nullable: false })
  lastname: string;

  @ApiProperty({
    example: ['admin', 'user'],
    description: 'Roles asignados para el control de acceso',
    default: ['user'],
  })
  @Column({ type: 'text', nullable: true, array: true, default: ['user'] })
  roles: string[];

  @ApiProperty({
    example: true,
    description: 'Define si el usuario puede acceder al sistema',
  })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // --- NUEVAS COLUMNAS DE MEMBRESÍA ---
  @ApiProperty({
    example: '2026-02-23T10:00:00Z',
    description: 'Fecha de inicio de la suscripción',
    required: false,
  })
  @Column({ type: 'timestamp', name: 'membership_start', nullable: true })
  membershipStart: Date;

  @ApiProperty({
    example: '2027-02-23T10:00:00Z',
    description: 'Fecha de vencimiento de la suscripción',
    required: false,
  })
  @Column({ type: 'timestamp', name: 'membership_end', nullable: true })
  membershipEnd: Date;
  // ------------------------------------

  // ✅ Corregido: OneToMany siempre debe retornar un Array []
  @ApiProperty({ type: () => [Sale], required: false })
  @OneToMany(() => Sale, (sale) => sale.user)
  sales: Sale[]; // Antes tenías Sale (singular), esto rompe el tipado

  @ApiProperty({ type: () => [Product], required: false })
  @OneToMany(() => Product, (product) => product.user)
  products: Product[]; // Antes tenías Product (singular)

  @BeforeInsert()
  normalizeEmail() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
// import {
//   BeforeInsert,
//   Column,
//   Entity,
//   OneToMany,
//   PrimaryGeneratedColumn,
// } from 'typeorm';
// import * as bcrypt from 'bcrypt';
// import { Product } from 'src/products/entities/product.entity';
// import { Sale } from 'src/sales/entities/sale.entity';
// import { ApiProperty } from '@nestjs/swagger';

// @Entity({ name: 'users' })
// export class User {
//   @ApiProperty({
//     example:
//       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJiYzBlNDI5LTVjNTctNDhhOC04ZTAwLTUyMGU2OTljM2ZiOSIsImlhdCI6MTc3MDE2MTc0OCwiZXhwIjoxNzcwMTY1MzQ4fQ.6bJUlg-EVy-U-WGebxXQvGM-LIsYyIC6nG5jbC4dLEw',
//   })
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({ type: 'text', unique: true, nullable: false })
//   email: string;

//   @Column({ type: 'text', nullable: false })
//   password: string;

//   @Column({ type: 'text', nullable: false })
//   name: string;

//   @Column({ type: 'text', nullable: false })
//   lastname: string;

//   @Column({ type: 'text', nullable: true, array: true, default: ['user'] })
//   roles: string[];

//   @Column({ type: 'boolean', default: true })
//   isActive: boolean;

//   // --- NUEVAS COLUMNAS DE MEMBRESÍA ---
//   @Column({ type: 'timestamp', name: 'membership_start', nullable: true })
//   membershipStart: Date;

//   @Column({ type: 'timestamp', name: 'membership_end', nullable: true })
//   membershipEnd: Date;
//   // ------------------------------------

//   @OneToMany(() => Sale, (sale) => sale.user)
//   sales: Sale;

//   @OneToMany(() => Product, (product) => product.user)
//   products: Product;

//   @BeforeInsert()
//   normalizeEmail() {
//     this.email = this.email.toLowerCase().trim();
//   }

//   @BeforeInsert()
//   async hashPassword() {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   // @BeforeUpdate()
//   // async hashPasswordToUpdate() {
//   //   if (this.password) {
//   //     this.password = await bcrypt.hash(this.password, 10);
//   //   }
//   // }
// }
