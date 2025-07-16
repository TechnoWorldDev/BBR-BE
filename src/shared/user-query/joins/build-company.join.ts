import { Knex } from 'knex';

export function buildCompanyJoin(knex: Knex) {
  return knex.raw(`
    LATERAL (
        SELECT json_build_object(
        'id', companies.id, 
        'name', companies.name, 
        'address', companies.address, 
        'phoneNumber', companies.phone_number, 
        'phoneNumberCountryCode', companies.phone_number_country_code, 
        'website', companies.website, 
        'imageId', companies.image_id, 
        'contactPersonAvatarId', companies.contact_person_avatar_id,
        'contactPersonFullName', companies.contact_person_full_name, 
        'contactPersonJobTitle', companies.contact_person_job_title, 
        'contactPersonEmail', companies.contact_person_email, 
        'contactPersonPhoneNumber', companies.contact_person_phone_number, 
        'contactPersonPhoneNumberCountryCode', companies.contact_person_phone_number_country_code ,
        'image', json_build_object(
          'id', image.id,
          'originalFileName', image.original_file_name,
          'mimeType', image.mime_type,
          'uploadStatus', image.upload_status,
          'size', image.size
        ),
        'contactPersonAvatar', json_build_object(
          'id', avatar.id,
          'originalFileName', avatar.original_file_name,
          'mimeType', avatar.mime_type,
          'uploadStatus', avatar.upload_status,
          'size', avatar.size
        ),
        'plan', json_build_object(
          'id', plan.id,
          'name', plan.name,
          'code', plan.code,
          'description', plan.description
        )
        )::json AS company
        FROM companies 
        LEFT JOIN media AS image ON image.id = companies.image_id
        LEFT JOIN media AS avatar ON avatar.id = companies.contact_person_avatar_id
        LEFT JOIN plans AS plan ON plan.id = companies.plan_id
        WHERE companies.id = users.company_id
    ) company ON TRUE
  `);
}
