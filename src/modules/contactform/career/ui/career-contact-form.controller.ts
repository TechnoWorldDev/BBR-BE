import { Controller, Get, Param, Query, Post, Body, Delete, Patch, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CareerContactForm } from '../domain/career-contact-form.entity';
import { CreateCareerContactFormRequest } from './request/create-career-contact-form.request';
import { FetchCareerContactFormsQuery } from '../application/command/fetch-career-contact-forms.query';
import { UpdateCareerContactFormStatusCommandHandler } from '../application/handler/update-career-contact-form-status.handler';
import { CreateCareerContactFormCommandHandler } from '../application/handler/create-career-contact-form.handler';
import { CareerContactFormResponse } from './response/career-contact-form.response';
import { FetchCareerContactFormsCommandQuery } from '../application/query/fetch-career-contact-forms.query';
import { CareerContactFormMapper } from './mapper/career-contact-form.mapper';
import { FindCareerContactFormByIdCommandQuery } from '../application/query/find-by-id-career-contact-form.query';
import { UpdateCareerContactFormStatusRequest } from './request/update-career-contact-form-status.request';
import { UpdateCareerContactFormRequest } from './request/update-career-contact-form.request';
import { UpdateCareerContactFormCommandHandler } from '../application/handler/update-career-contact-form.handler';
import { DeleteCareerContactFormCommandHandler } from '../application/handler/delete-career-contact-form.handler';

@ApiTags('Career Contact Forms')
@Controller()
export class CareerContactFormController {
  constructor(
    private readonly fetchContactFormsCommandQuery: FetchCareerContactFormsCommandQuery,
    private readonly findContactFormByIdCommandQuery: FindCareerContactFormByIdCommandQuery,
    private readonly createContactFormCommandHandler: CreateCareerContactFormCommandHandler,
    private readonly updateContactFormStatusCommandHandler: UpdateCareerContactFormStatusCommandHandler,
    private readonly updateContactFormCommandHandler: UpdateCareerContactFormCommandHandler,
    private readonly deleteContactFormCommandHandler: DeleteCareerContactFormCommandHandler
  ) {}

  @Get('career-contact-forms')
  @ApiOperation({ summary: 'Get all career contact forms' })
  @ApiResponse({ type: [CareerContactFormResponse] })
  async fetchAll(
    @Query('query') query?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
  ) {
    const { data, pagination } = await this.fetchContactFormsCommandQuery.handle(
      new FetchCareerContactFormsQuery(query, page, limit, sortBy, sortOrder)
    );

    const mappedContactForms = data.map((contactForm: CareerContactForm) => CareerContactFormMapper.toResponse(contactForm));

    return {
      data: mappedContactForms,
      pagination,
    };
  }

  @Get('career-contact-forms/:id')
  @ApiOperation({ summary: 'Get career contact form by ID' })
  @ApiResponse({ type: CareerContactFormResponse })
  async findById(@Param('id') id: string) {
    const contactForm = await this.findContactFormByIdCommandQuery.handle(id);
    return CareerContactFormMapper.toResponse(contactForm);
  }

  @Post('public/career-contact-forms')
  @ApiOperation({ summary: 'Create a new career contact form' })
  @ApiResponse({ type: CareerContactFormResponse })
  async create(@Body() request: CreateCareerContactFormRequest) {
    const command = CareerContactFormMapper.toCreateCommand(request);
    const createdContactForm = await this.createContactFormCommandHandler.handle(command);
    return CareerContactFormMapper.toResponse(createdContactForm);
  }

  @Patch('career-contact-forms/:id/status')
  @ApiOperation({ summary: 'Update the status of a career contact form' })
  @ApiResponse({ type: CareerContactFormResponse })
  async updateStatus(@Param('id') id: string, @Body() request: UpdateCareerContactFormStatusRequest) {
    const command = CareerContactFormMapper.toUpdateStatusCommand(id, request)
    const updatedContactForm = await this.updateContactFormStatusCommandHandler.handle(command);
    return CareerContactFormMapper.toResponse(updatedContactForm);
  }

  @Put('career-contact-forms/:id')
  @ApiOperation({ summary: 'Update a career contact form' })
  @ApiResponse({ type: CareerContactFormResponse })
  async update(@Param('id') id: string, @Body() request: UpdateCareerContactFormRequest) {
    const command = CareerContactFormMapper.toUpdateCommand(id, request)
    const updatedContactForm = await this.updateContactFormCommandHandler.handle(command);
    return CareerContactFormMapper.toResponse(updatedContactForm);
  }

  @Delete('career-contact-forms/:id')
  @ApiOperation({ summary: 'Delete a career contact form' })
  async delete(@Param('id') id: string) {
    return this.deleteContactFormCommandHandler.handle(id);
  }
}
