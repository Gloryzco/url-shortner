/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Logger } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'passwordValidator', async: false })
export class CustomPasswordValidator implements ValidatorConstraintInterface {
  private readonly logger = new Logger(CustomPasswordValidator.name);

  validate(password: string): boolean {
    const hasUpperCase = /[A-Z]/.test(password);

    const hasLowerCase = /[a-z]/.test(password);

    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const hasNumber = /\d/.test(password);
    return hasUpperCase && hasLowerCase && hasSpecialChar && hasNumber;
  }

  defaultMessage(args: ValidationArguments): string {
    this.logger.log(`Invalid password dictated and prevented from usage`);

    throw new BadRequestException(
      'Password must contain at least one uppercase letter, one lowercase letter, one special character, and one number.',
    );
  }
}

export function PasswordValidator(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: CustomPasswordValidator,
    });
  };
}
