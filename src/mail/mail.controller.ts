import { Controller, Get, Logger, Query } from '@nestjs/common';
import { MailService } from './mail.service';
import { Mail, MailType } from '@prisma/client';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { DataMessage } from './types/message';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  private readonly logger = new Logger(MailController.name);

  @Get('get')
  async getMail(@Query('idUser') idUser): Promise<Mail[] | null> {
    return await this.mailService.getMailByIdUser(idUser);
  }

  @MessagePattern('register')
  async readRegisterPayment(
    @Payload() payload: any,
    @Ctx() context: RmqContext,
  ) {
    this.logger.log(`data: ${JSON.stringify(payload)}`);
    const dataMessage: DataMessage = JSON.parse(payload.data.notification);
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
    await this.mailService.sendMail(dataMessage, MailType.orderConfirmation);
    await this.mailService.persistNotification(
      dataMessage,
      MailType.orderConfirmation,
    );
  }

  @MessagePattern('confirmation')
  async readConfirmationPayment(
    @Payload() payload: any,
    @Ctx() context: RmqContext,
  ) {
    this.logger.log(`data: ${JSON.stringify(payload)}`);
    const dataMessage: DataMessage = JSON.parse(payload.data.notification);
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
    await this.mailService.sendMail(dataMessage, MailType.paymentConfirmation);
    await this.mailService.persistNotification(
      dataMessage,
      MailType.paymentConfirmation,
    );
  }
}
