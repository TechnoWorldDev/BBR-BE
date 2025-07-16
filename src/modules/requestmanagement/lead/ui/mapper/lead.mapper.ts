import { Lead } from '../../domain/lead.entity';
import { CreateLeadCommand } from '../../application/command/create-lead.command';
import { UpdateLeadCommand } from '../../application/command/update-lead.command';
import { CreateLeadRequest } from '../request/create-lead.request';
import { UpdateLeadRequest } from '../request/update-lead.request';
import { UpdateLeadStatusCommand } from '../../application/command/update-lead-status.command';
import { UpdateLeadStatusRequest } from '../request/update-lead-status.request';
import { LeadResponse } from '../response/lead.response';
import { Request } from '../../../request/domain/request.entity';
import { RequestResponse } from '../response/request.response';

export class LeadMapper {

  static toCreateCommand(request: CreateLeadRequest): CreateLeadCommand {
    return new CreateLeadCommand(
      request.firstName,
      request.lastName,
      request.email,
      request.phone,
      request.preferredContactMethod,
    );
  }

  static toUpdateCommand(id: string, request: UpdateLeadRequest): UpdateLeadCommand {
    return new UpdateLeadCommand(
      id,
      request.firstName,
      request.lastName,
      request.email,
      request.phone,
      request.preferredContactMethod,
    );
  }

  static toUpdateStatusCommand(id: string, request: UpdateLeadStatusRequest): UpdateLeadStatusCommand {
    return new UpdateLeadStatusCommand(
      id,
      request.status,
    );
  }

  static toResponse(lead: Lead): LeadResponse {
    const requests =lead.requests ?  lead.requests.map((request: Request) => {
      return new RequestResponse(
        request.id,
        request.message,
        request.subject,
        request.status,
        request.entityId,
        request.type
      );
    }):  [];

    return new LeadResponse(
      lead.id,
      lead.firstName,
      lead.lastName,
      lead.email,
      lead.status,
      lead.phone,
      lead.preferredContactMethod,
      lead.createdAt,
      lead.updatedAt,
      requests
    );
  }

  static toRequestResponse(request: Request): RequestResponse {
    return new RequestResponse(
      request.id,
      request.message,
      request.subject,
      request.status,
      request.entityId,
      request.type,
    );
  }
}
