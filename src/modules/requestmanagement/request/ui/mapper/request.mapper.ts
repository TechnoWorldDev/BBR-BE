import { Request } from '../../domain/request.entity';
import { RequestResponse } from '../response/request-response.dto';
import { LeadResponse } from '../response/lead-response.dto';
import { CreateRequestRequest } from '../request/create-request.request';
import { CreateRequestCommand } from '../../application/command/create-request.command';
import { RequestTypeEnum } from '../../domain/request-type.enum';
import { UpdateRequestStatusCommand } from '../../application/command/update-request-status.command';
import { UpdateRequestStatusRequest } from '../request/update-request-status.request';
import { UpdateRequestRequest } from '../request/update-request.request';
import { UpdateRequestCommand } from '../../application/command/update-request.command';

export class RequestMapper {

  static toCreateCommand(request: CreateRequestRequest): CreateRequestCommand {
    return new CreateRequestCommand(
      request.firstName,
      request.lastName,
      request.email,
      request.phoneNumber,
      request.subject,
      request.message,
      request.preferredContactMethod,
      request.termsAccepted,
      request.entityId,
      request.type as RequestTypeEnum,
    );
  }

  static toUpdateStatusCommand(id:string, request: UpdateRequestStatusRequest): UpdateRequestStatusCommand {
    return new UpdateRequestStatusCommand(
      id,
      request.status,
    );
  }

  static toUpdateCommand(id:string, request: UpdateRequestRequest): UpdateRequestCommand {
    return new UpdateRequestCommand(
      id,
      request.note,
      request.status,
    );
  }

  static toResponse(request: Request): RequestResponse {
    const leadResponse = new LeadResponse(
        request.lead.id,
        request.lead.firstName,
        request.lead.lastName,
        request.lead.email,
        request.lead.status,
        request.lead.phone,
        request.lead.preferredContactMethod,
        request.lead.createdAt,
        request.lead.updatedAt,
      );

    return new RequestResponse(
      request.id,
      request.subject,
      request.message,
      request.entityId,
      request.type,
      request.status,
      request.note,
      leadResponse,
      request.createdAt,
      request.updatedAt,
    );
  }
}
