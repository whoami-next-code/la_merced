import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChatbotService } from './chatbot.service';

@ApiTags('chatbot')
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly service: ChatbotService) {}

  @Post('chat')
  chat(@Body() body: { message: string; sessionId?: string }) {
    const sessionId = body.sessionId ?? crypto.randomUUID();
    return this.service.chat(body.message, sessionId);
  }

  @Get('faq')
  getFaq() {
    return this.service.getFaq();
  }
}
