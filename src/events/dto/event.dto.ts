import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
} from 'class-validator';
import { ClickedLinkEvent } from '../schemas/clicked-link-event.schema.js';
import { SignUpEvent } from '../schemas/sign-up-event.schema.js';

export const EVENT_KINDS = [ClickedLinkEvent.name, SignUpEvent.name];

// one dto for both kinds, ValidateIf only checks url / user for the kind that needs it
export class CreateEventDto {
  @IsIn(EVENT_KINDS)
  kind: string;

  // falls back to "now" in the service when it's not sent
  @IsOptional()
  @IsDateString()
  time?: string;

  @ValidateIf((event: CreateEventDto) => event.kind === ClickedLinkEvent.name)
  @IsUrl({ require_tld: false })
  url?: string;

  @ValidateIf((event: CreateEventDto) => event.kind === SignUpEvent.name)
  @IsString()
  @IsNotEmpty()
  user?: string;
}
