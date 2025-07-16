import { Injectable, OnModuleInit } from '@nestjs/common';
import { readFileSync } from 'fs';
import * as path from 'path';
import * as Mustache from 'mustache';

@Injectable()
export class PromptService implements OnModuleInit {
  private prompts: Record<string, string> = {};

  onModuleInit() {
    const filePath = path.resolve(__dirname, './../../../../prompts/matchmaking.prompts.json');
    this.prompts = JSON.parse(readFileSync(filePath, 'utf-8'));
  }

  getPrompt(name: string, params: Record<string, any> = {}) {
    const template = this.prompts[name];
    if (!template) throw new Error(`Prompt "${name}" not found`);
    return Mustache.render(template, params);
  }
}
