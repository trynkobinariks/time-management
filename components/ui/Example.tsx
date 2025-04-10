import React, { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './Dialog';
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormSubmit,
} from './Form';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';
import { Button } from './Button';
import { Input } from './Input';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './Accordion';

export function RadixUIExample() {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">
        Radix UI Components Example
      </h1>

      {/* Accordion Example */}
      <section className="p-4 border border-[var(--card-border)] rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">
          Accordion Component
        </h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>What is Radix UI?</AccordionTrigger>
            <AccordionContent>
              Radix UI is a low-level UI component library with a focus on
              accessibility, customization and developer experience. You can use
              these components either as the base layer of your design system,
              or adopt them incrementally.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. Radix Primitives follow the WAI-ARIA design patterns where
              possible. Components come with accessible attributes built-in, and
              are designed to support keyboard navigation, focus management, and
              more.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>How do I use it in my project?</AccordionTrigger>
            <AccordionContent>
              <p>
                To use Radix UI components in your project, you can import them
                directly:
              </p>
              <pre className="bg-gray-100 dark:bg-gray-800 p-2 my-2 rounded-md overflow-x-auto">
                <code>{`import { Accordion } from '@/components/ui';`}</code>
              </pre>
              <p>Then use them in your component:</p>
              <pre className="bg-gray-100 dark:bg-gray-800 p-2 my-2 rounded-md overflow-x-auto">
                <code>{`<Accordion type="single" collapsible>\n  <AccordionItem value="item-1">\n    <AccordionTrigger>Item 1</AccordionTrigger>\n    <AccordionContent>Content 1</AccordionContent>\n  </AccordionItem>\n</Accordion>`}</code>
              </pre>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Button Example */}
      <section className="p-4 border border-[var(--card-border)] rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">
          Button Component
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-4">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-4">
          <Button isLoading>Loading</Button>
          <Button disabled>Disabled</Button>
          <Button fullWidth>Full Width</Button>
        </div>
      </section>

      {/* Input Example */}
      <section className="p-4 border border-[var(--card-border)] rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">
          Input Component
        </h2>
        <div className="space-y-4">
          <Input
            id="basic-input"
            label="Basic Input"
            placeholder="Type something..."
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
          />
          <Input
            id="with-help-text"
            label="With Help Text"
            placeholder="Type something..."
            helpText="This is some helpful text"
          />
          <Input
            id="with-error"
            label="With Error"
            placeholder="Type something..."
            error="This field has an error"
          />
          <div className="flex flex-wrap gap-4">
            <div className="w-full md:w-auto">
              <Input
                id="small-input"
                label="Small Input"
                size="sm"
                placeholder="Small"
              />
            </div>
            <div className="w-full md:w-auto">
              <Input
                id="medium-input"
                label="Medium Input"
                size="md"
                placeholder="Medium"
              />
            </div>
            <div className="w-full md:w-auto">
              <Input
                id="large-input"
                label="Large Input"
                size="lg"
                placeholder="Large"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Dialog Example */}
      <section className="p-4 border border-[var(--card-border)] rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">
          Dialog Component
        </h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
              <DialogDescription>
                This is a dialog built with Radix UI primitives.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-[var(--text-primary)]">
                This is the main content of the dialog. You can put any
                component here.
              </p>
            </div>
            <DialogFooter>
              <Button>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      {/* Form Example */}
      <section className="p-4 border border-[var(--card-border)] rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">
          Form Component
        </h2>
        <Form onSubmit={event => event.preventDefault()}>
          <FormField name="email">
            <FormLabel>Email</FormLabel>
            <FormControl asChild>
              <input type="email" placeholder="Enter your email" required />
            </FormControl>
            <FormMessage match="valueMissing">
              Please enter your email
            </FormMessage>
            <FormMessage match="typeMismatch">
              Please enter a valid email
            </FormMessage>
          </FormField>

          <FormField name="password">
            <FormLabel>Password</FormLabel>
            <FormControl asChild>
              <input
                type="password"
                placeholder="Enter your password"
                required
                minLength={8}
              />
            </FormControl>
            <FormMessage match="valueMissing">
              Please enter your password
            </FormMessage>
            <FormMessage match="tooShort">
              Password must be at least 8 characters
            </FormMessage>
          </FormField>

          <FormSubmit>Submit</FormSubmit>
        </Form>
      </section>

      {/* Tabs Example */}
      <section className="p-4 border border-[var(--card-border)] rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">
          Tabs Component
        </h2>
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="p-4">
            <h3 className="text-lg font-medium mb-2 text-[var(--text-primary)]">
              Account Settings
            </h3>
            <p className="text-[var(--text-secondary)]">
              Manage your account settings and preferences.
            </p>
          </TabsContent>
          <TabsContent value="password" className="p-4">
            <h3 className="text-lg font-medium mb-2 text-[var(--text-primary)]">
              Change Password
            </h3>
            <p className="text-[var(--text-secondary)]">
              Update your password and security preferences.
            </p>
          </TabsContent>
          <TabsContent value="settings" className="p-4">
            <h3 className="text-lg font-medium mb-2 text-[var(--text-primary)]">
              Other Settings
            </h3>
            <p className="text-[var(--text-secondary)]">
              Configure application settings and preferences.
            </p>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
