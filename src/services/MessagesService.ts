import { getCustomRepository, Repository } from "typeorm"
import { MessagesRepository } from "../repositories/MessagesRepository"
import { Message } from "../entities/Message";

interface IMassegeCreate {
  admin_id?: string;
  texte: string;
  user_id: string;
}

class MessagesService {
  private messagesRepository: Repository<Message>;

  constructor() {
    this.messagesRepository = getCustomRepository(MessagesRepository);
  }

  async create({ admin_id, texte, user_id }: IMassegeCreate) {
    const message = this.messagesRepository.create({
      admin_id,
      texte,
      user_id
    });

    await this.messagesRepository.save(message);

    return message;
  }

  async listByUser(user_id: string) {

    const list = await this.messagesRepository.find({
      where: { user_id },
      relations: ["user"],
    });

    return list;
  }
}

export { MessagesService }