import { Injectable } from '@nestjs/common';
import { raw } from '@nestjs/mongoose';
import { OpenAiService } from 'src/shared/openai/openai.service';
import { PromptService } from 'src/shared/openai/prompt/prompt.service';

@Injectable()
export class AiMatchmakingService {
  constructor(
    private readonly promptService: PromptService,
    private readonly openAiService: OpenAiService
  ) {}

  async progressiveFillCombined(previousCriteria: any, userMessage: string) {
    const prompt = this.promptService.getPrompt('progressive_fill_combined', {
      previousCriteria: JSON.stringify(previousCriteria),
      userMessage,
    });

    const aiResponse = await this.openAiService.chat([{ role: 'system', content: prompt }], {
      model: 'gpt-4o',
      temperature: 0.1,
      maxTokens: 700,
    });

    return {
      ...this.parseAiResponse(aiResponse),
      rawAiPrompt: prompt,
      rawAiResponse: aiResponse,
    };
  }

  parseAiResponse(aiResponse: string) {
    // Pronađi "Response:" i "Criteria:"
    const responseStart = aiResponse.indexOf('Response:');
    const criteriaStart = aiResponse.indexOf('Criteria:');

    if (responseStart === -1 || criteriaStart === -1)
      throw new Error('AI did not return valid Response and Criteria');

    // Friendly response = sve između, obavezno trim
    const friendlyResponse = aiResponse
      .substring(responseStart + 'Response:'.length, criteriaStart)
      .trim();

    // Criteria deo (sve posle Criteria:), očisti backtickove i trim
    let criteriaRaw = aiResponse
      .substring(criteriaStart + 'Criteria:'.length)
      .replace(/```json|```/g, '')
      .trim();

    // Samo prvi JSON blok (ako AI doda nešto posle)
    const firstJsonMatch = criteriaRaw.match(/{[\s\S]*}/);
    if (!firstJsonMatch) throw new Error('No JSON found after Criteria:');
    criteriaRaw = firstJsonMatch[0];

    const criteria = JSON.parse(criteriaRaw);

    return { friendlyResponse, criteria };
  }

  async progressiveFill(previousCriteria: any, userMessage: string) {
    const prompt = this.promptService.getPrompt('progressive_fill', {
      previousCriteria: JSON.stringify(previousCriteria),
      userMessage,
    });

    const aiResponse = await this.openAiService.chat([{ role: 'system', content: prompt }], {
      model: 'gpt-4o',
      temperature: 0.1,
      maxTokens: 700,
    });

    const match = aiResponse.match(/({[\s\S]*})/);
    if (!match) throw new Error('AI did not return a valid JSON object');
    return JSON.parse(match[1]);
  }

  async processUserMessage(userMessage: string): Promise<{ response: string; criteria: any }> {
    const prompt = this.promptService.getPrompt('combined');
    const fullPrompt = `${prompt}\n\nUser message: "${userMessage}"`;

    const aiOutput = await this.openAiService.chat([{ role: 'system', content: fullPrompt }], {
      model: 'gpt-4o',
      temperature: 0.2,
      maxTokens: 700,
    });

    // Parse response from AI
    // Expect format:
    // Response: Blabla...
    // Criteria:
    // { ...json... }

    const responseMatch = aiOutput.match(/Response:(.*?)(?:\n|$)/s);
    const criteriaMatch = aiOutput.match(/Criteria:\s*({[\s\S]*?})/);

    const response = responseMatch ? responseMatch[1].trim() : '';
    let criteria = {};
    if (criteriaMatch) {
      try {
        criteria = JSON.parse(criteriaMatch[1]);
      } catch {
        throw new Error('AI returned invalid criteria JSON: ' + criteriaMatch[1]);
      }
    }

    return { response, criteria };
  }
}
