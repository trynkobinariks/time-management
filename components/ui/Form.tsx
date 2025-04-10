import React from 'react';
import * as FormPrimitive from '@radix-ui/react-form';

const Form = FormPrimitive.Root;

const FormField = React.forwardRef<
  React.ElementRef<typeof FormPrimitive.Field>,
  React.ComponentPropsWithoutRef<typeof FormPrimitive.Field>
>(({ className = '', ...props }, ref) => (
  <FormPrimitive.Field ref={ref} className={`mb-4 ${className}`} {...props} />
));
FormField.displayName = FormPrimitive.Field.displayName;

const FormLabel = React.forwardRef<
  React.ElementRef<typeof FormPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof FormPrimitive.Label>
>(({ className = '', ...props }, ref) => (
  <FormPrimitive.Label
    ref={ref}
    className={`mb-2 block text-sm font-medium text-[var(--text-primary)] ${className}`}
    {...props}
  />
));
FormLabel.displayName = FormPrimitive.Label.displayName;

const FormControl = React.forwardRef<
  React.ElementRef<typeof FormPrimitive.Control>,
  React.ComponentPropsWithoutRef<typeof FormPrimitive.Control>
>(({ className = '', ...props }, ref) => (
  <FormPrimitive.Control
    ref={ref}
    className={`flex w-full rounded-md border border-[var(--card-border)] bg-[var(--card-background)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
));
FormControl.displayName = FormPrimitive.Control.displayName;

const FormMessage = React.forwardRef<
  React.ElementRef<typeof FormPrimitive.Message>,
  React.ComponentPropsWithoutRef<typeof FormPrimitive.Message>
>(({ className = '', ...props }, ref) => (
  <FormPrimitive.Message
    ref={ref}
    className={`mt-1 text-sm font-medium text-red-500 ${className}`}
    {...props}
  />
));
FormMessage.displayName = FormPrimitive.Message.displayName;

const FormValidityState = FormPrimitive.ValidityState;

const FormSubmit = React.forwardRef<
  React.ElementRef<typeof FormPrimitive.Submit>,
  React.ComponentPropsWithoutRef<typeof FormPrimitive.Submit>
>(({ className = '', ...props }, ref) => (
  <FormPrimitive.Submit
    ref={ref}
    className={`mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
));
FormSubmit.displayName = FormPrimitive.Submit.displayName;

export {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormValidityState,
  FormSubmit,
};
