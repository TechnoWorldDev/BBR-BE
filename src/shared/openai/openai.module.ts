import { Module } from '@nestjs/common';
import { PromptService } from './prompt/prompt.service';
import { OpenAiService } from './openai.service';

@Module({
  providers: [PromptService, OpenAiService],
  exports: [PromptService, OpenAiService],
  imports: [],
})
export class OpenAiModule {}
