import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { QueryCustomerDto } from './dto/query-customer.dto';
import { ResponseBody } from 'src/helpers/responseBody';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer) private readonly customerRepository: Repository<Customer>
  ) { }

  // global catch handler will handle error so we have to throw error
  async create(createCustomerDto: CreateCustomerDto) {
    try {
      const { firstName, lastName, city, company } = createCustomerDto
      // check if the company and city is already exist
      const cities = await this.customerRepository.find({ where: { city } })
      const companies = await this.customerRepository.find({ where: { company } })

      if (cities.length == 0 || companies.length == 0) {
        throw new BadRequestException('City or Company is not exist')
      }

      const customer = await this.customerRepository.save({ firstName, lastName, city, company })

      return new ResponseBody('Data has been created', customer, 201, true)

    } catch (error) {
      throw error
    }
  }

  async getAllUniqueCities() {
    try {
      const allDataWithUniqueCities = await this.customerRepository.createQueryBuilder('customer')
        .select(['customer.id', 'customer.first_name', 'customer.last_name', 'customer.city', 'customer.company'])
        .groupBy('customer.city')
        .getRawMany();

      return new ResponseBody('Data has been fetched', allDataWithUniqueCities, 200, true)
    } catch (error) {
      throw error
    }
  }


  async findAll(query: QueryCustomerDto) {
    try {
      const { search, limit, page } = query
      if (page < 0) throw new BadRequestException('Page must be greater than 0')

      const take = limit ? limit : 10

      const skip = page ? (page - 1) * take : 0

      const DBquery = this.customerRepository.createQueryBuilder('customer')

      if (search) {
        DBquery.where('customer.firstName ILIKE :search OR customer.lastName ILIKE :search OR customer.city ILIKE :search', { search: `%${search}%` })
      }

      DBquery.take(take).skip(skip)

      const response = await DBquery.getManyAndCount()

      const data = { ...response[0], total: response[1] }

      return new ResponseBody('Data has been fetched', data, 200, true)

    } catch (error) {
      throw error
    }
  }

  async findOne(id: string) {
    try {
      const customer = await this.customerRepository.findOne({
        where: { id }
      })

      return new ResponseBody('Data has been fetched', customer, 200, true)
    } catch (error) {
      throw error
    }
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
