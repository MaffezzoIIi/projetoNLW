import { getCustomRepository, Repository } from "typeorm";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/UsersRepository";



class UsersService {
  private usersRepository: Repository<User>;

  constructor() {
    this.usersRepository = getCustomRepository(UserRepository);

  }
  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({ email });

    return user;
  }
  async create(email: string) {
    //Verificar se usuario existe

    const userExists = await this.usersRepository.findOne({
      email
    })
    // Se não existir, salvar no DB
    if (userExists) {
      return userExists;
    }

    const user = this.usersRepository.create({
      email
    });

    await this.usersRepository.save(user);

    return user;
  }
}

export { UsersService };