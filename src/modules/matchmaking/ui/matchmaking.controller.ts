import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateMMSessionCommandHandler } from '../application/handler/create-mm-session.command.handler';
import { CreateMMSessionCommand } from '../application/command/create-mm-sesssion.command';
import { QueryMMCommandHandler } from '../application/handler/query-mm.command.handler';
import { SessionAuthGuard } from 'src/shared/guards/session-auth.guard';

@Controller('matchmaking')
export class MatchmakingController {
  constructor(
    private readonly createSessionCommandHandler: CreateMMSessionCommandHandler,
    private readonly queryMMCommandHandler: QueryMMCommandHandler
  ) {}

  @Post('session')
  @UseGuards(SessionAuthGuard)
  async create(@Req() req) {
    const metadata = {
      userAgent: req.get('user-agent') || '',
      ip: req.ip,
      forwardedFor: req.headers['x-forwarded-for'] || '',
      referer: req.get('referer') || '',
      host: req.get('host') || '',
      method: req.method,
      url: req.originalUrl,
      // Add anything else you need from req
      headers: req.headers, // (optional, if you want to log all headers)
    };

    const user = req.user;

    const command = new CreateMMSessionCommand(user.id, metadata);
    return this.createSessionCommandHandler.handle(command);
  }

  @Post('query')
  @UseGuards(SessionAuthGuard)
  async query(@Req() req, @Body() body: any) {
    return this.queryMMCommandHandler.handle({
      userId: req.user.id,
      ...body,
    });
  }
}
