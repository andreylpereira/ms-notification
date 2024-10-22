import { DataMessage } from './types/message';
import { Injectable } from '@nestjs/common';
import { Mail, MailType } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MailService {
  constructor(private prisma: PrismaService) {}

  async getMailByIdUser(idUser: string): Promise<Mail[] | null> {
    return await this.prisma.mail.findMany({
      where: { idUser },
    });
  }

  async sendMail(content: DataMessage, type: MailType) {
    console.log(
    `SendMail for: ${this.getDestination(content.idUser)} \n
    Title: ${type} \n
    UserId: ${content.idUser} \n
    OrderNumber: ${content.orderNumber} \n
    OrderValue: ${content.orderValue}
    `);
  }

  async persistNotification(content:DataMessage, type: MailType) {

    const data = {
        idUser: content.idUser,
        mailDestination: this.getDestination(content.idUser),
        mailContent: this.makeContent(content.orderNumber, content.orderValue),
        mailType: type,
    };
    await this.prisma.mail.create({ data: {...data } })
  }

  getDestination(idUser: string) {
    switch (idUser) {
        case '1':
            return 'root@test.com.br'
        default:
            return 'default@test.com.br'
    }
  }

  makeContent(orderNumber: number, orderValue: number) {
    return `Número do pedido: ${orderNumber} - Valor do pedido: ${orderValue}`;
  }
}
