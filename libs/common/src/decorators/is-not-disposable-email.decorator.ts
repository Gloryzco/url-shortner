/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { BadRequestException, Logger } from '@nestjs/common';
import * as disposableDomainsData from '../../../../disposable_domains.json';

const disposableEmailDomains: string[] = Array.isArray(disposableDomainsData)
  ? disposableDomainsData
  : [];

@ValidatorConstraint({ name: 'isNotDisposable', async: false })
export class IsNotDisposableEmailValidator
  implements ValidatorConstraintInterface
{
  private readonly logger = new Logger(IsNotDisposableEmailValidator.name);

  validate(email: string): boolean {
    const [, domain] = email.split('@');

    return !disposableEmailDomains.includes(domain);
  }

  defaultMessage(args: ValidationArguments): string {
    this.logger.log(`Disposable email dictated and denied usage`);

    throw new BadRequestException(
      'Email address is from a disposable email provider and not allowed.',
    );
  }
}

export function IsNotDisposableEmail(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNotDisposableEmailValidator,
    });
  };
}
