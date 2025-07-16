import { Controller, Get, Param, Query, Post, Body, Delete, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ContactFormResponse } from './response/contact-form.response';
import { CreateContactFormRequest } from './request/create-contact-form.request';
import { ContactFormMapper } from './mapper/contact-form.mapper';
import { UpdateContactFormRequest } from './request/update-contact-form.request';
import { FetchContactFormsCommandQuery } from '../application/query/fetch-contact-forms-command.query';
import { FindContactFormByIdCommandQuery } from '../application/query/find-contact-form-by-id-command.query';
import { CreateContactFormCommandHandler } from '../application/handler/create-contact-form.command-handler';
import { UpdateContactFormCommandHandler } from '../application/handler/update-contact-form.command-handler';
import { DeleteContactFormCommandHandler } from '../application/handler/delete-contact-form.command-handler';
import { FetchContactFormsQuery } from '../application/command/fetch-contact-forms.query';

@ApiTags('Contact Forms')
@Controller()
export class ContactFormController {
  constructor(
    private readonly fetchContactFormsCommandQuery: FetchContactFormsCommandQuery,
    private readonly findContactFormByIdCommandQuery: FindContactFormByIdCommandQuery,
    private readonly createContactFormCommandHandler: CreateContactFormCommandHandler,
    private readonly updateContactFormCommandHandler: UpdateContactFormCommandHandler,
    private readonly deleteContactFormCommandHandler: DeleteContactFormCommandHandler
  ) {}

  @Get('contact-forms')
  @ApiOperation({ summary: 'Get all contact forms' })
  @ApiResponse({ type: [ContactFormResponse] })
  async fetchAll(
    @Query('query') query?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
    @Query('type') type?: string,
  ) {
    const { data, pagination } = await this.fetchContactFormsCommandQuery.handle(
      new FetchContactFormsQuery(query, page, limit, sortBy, sortOrder, type)
    );

    const contactFormResponses = data.map((contactForm) =>
      ContactFormMapper.toResponse(contactForm)
    );

    return {
      data: contactFormResponses,
      pagination,
    };
  }

  @Get('contact-forms/:id')
  @ApiOperation({ summary: 'Get contact form by ID' })
  @ApiResponse({ type: ContactFormResponse })
  async findById(@Param('id') id: string) {
    const contactForm = await this.findContactFormByIdCommandQuery.handle(id);
    return ContactFormMapper.toResponse(contactForm);
  }

  @Post('public/contact-forms')
  @ApiOperation({ summary: 'Create a new contact form' })
  @ApiResponse({ type: ContactFormResponse })
  async create(@Body() request: CreateContactFormRequest) {
    const command = ContactFormMapper.toCreateCommand(request);
    const contactForm = await this.createContactFormCommandHandler.handle(command);
    return ContactFormMapper.toResponse(contactForm);
  }

  @Put('contact-forms/:id')
  @ApiOperation({ summary: 'Update an contact form' })
  @ApiResponse({ type: ContactFormResponse })
  async update(@Param('id') id: string, @Body() request: UpdateContactFormRequest) {
    const command = ContactFormMapper.toUpdateCommand(id, request);
    const contactForm = await this.updateContactFormCommandHandler.handle(command);
    return ContactFormMapper.toResponse(contactForm);
  }

  @Delete('contact-forms/:id')
  @ApiOperation({ summary: 'Delete an contact form' })
  async delete(@Param('id') id: string) {
    return this.deleteContactFormCommandHandler.handle(id);
  }
}
