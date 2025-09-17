import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  create(createContactDto: CreateContactDto): Promise<Contact> {
    const contact = this.contactRepository.create(createContactDto);
    return this.contactRepository.save(contact);
  }

  findAll(): Promise<Contact[]> {
    return this.contactRepository.find();
  }

  async findOne(id: number): Promise<Contact> {
    const contact = await this.contactRepository.findOne({ where: { id } });
    if (!contact) throw new NotFoundException(`Contact with ID ${id} not found`);
    return contact;
  }

  async update(id: number, updateContactDto: UpdateContactDto): Promise<Contact> {
    const contact = await this.findOne(id); // will throw if not found
    const updated = Object.assign(contact, updateContactDto);
    return this.contactRepository.save(updated);
  }

  async remove(id: number): Promise<Contact> {
    const contact = await this.findOne(id); // will throw if not found
    await this.contactRepository.remove(contact);
    return contact;
  }
}
