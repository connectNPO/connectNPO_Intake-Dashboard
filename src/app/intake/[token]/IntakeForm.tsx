'use client';

import { FormEvent, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import type { IntakeQuestion, IntakeSection } from '@/lib/types';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { submitIntake } from './actions';

function fieldName(sectionKey: string, questionKey: string): string {
  return `${sectionKey}__${questionKey}`;
}

function questionHasValue(form: HTMLFormElement, section: IntakeSection, question: IntakeQuestion): boolean {
  const name = fieldName(section.key, question.key);
  if (question.type === 'checkbox') {
    return form.querySelectorAll<HTMLInputElement>(`input[name="${name}"]:checked`).length > 0;
  }

  const value = String(new FormData(form).get(name) ?? '').trim();
  return value.length > 0;
}

function questionHasValidFormat(form: HTMLFormElement, section: IntakeSection, question: IntakeQuestion): boolean {
  if (question.type !== 'url') return true;
  const name = fieldName(section.key, question.key);
  const input = form.querySelector<HTMLInputElement>(`input[name="${name}"]`);
  if (!input || input.value.trim() === '') return true;
  return input.checkValidity();
}

function QuestionField({
  section,
  question,
  error,
}: {
  section: IntakeSection;
  question: IntakeQuestion;
  error?: string;
}) {
  const name = fieldName(section.key, question.key);
  const supportsOther = question.type === 'select' && question.allowOther && question.options?.includes('Other');
  const [selectedValue, setSelectedValue] = useState('');

  return (
    <Field htmlFor={name} label={question.label} helper={question.helper} required={question.required}>
      {question.type === 'textarea' ? (
        <Textarea
          id={name}
          name={name}
          placeholder={question.placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      ) : question.type === 'select' ? (
        <div className="flex flex-col gap-3">
          <Select
            id={name}
            name={name}
            defaultValue=""
            onChange={(event) => setSelectedValue(event.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${name}-error` : undefined}
          >
            <option value="">Select an option</option>
            {(question.options ?? []).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </Select>
          {supportsOther && selectedValue === 'Other' && (
            <Input
              id={`${name}__other`}
              name={`${name}__other`}
              placeholder="Please describe"
              aria-label={`${question.label} — Other`}
            />
          )}
        </div>
      ) : question.type === 'checkbox' ? (
        <div
          id={name}
          className="grid gap-2 rounded-[7px] border border-border bg-surface p-3 sm:grid-cols-2"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
        >
          {(question.options ?? []).map((opt) => (
            <label key={opt} className="flex items-start gap-2 text-sm text-main">
              <input
                type="checkbox"
                name={name}
                value={opt}
                className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      ) : (
        <Input
          id={name}
          name={name}
          type={question.type === 'url' ? 'url' : 'text'}
          placeholder={question.placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      )}
      {error && (
        <p id={`${name}-error`} className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </Field>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Submitting…' : 'Submit intake'}
    </Button>
  );
}

function IntroStep({ onStart }: { onStart: () => void }) {
  const processCards = [
    {
      icon: '1',
      title: 'Share the basics',
      text: 'Tell us about your mission, programs, audience, and current goals.',
    },
    {
      icon: '2',
      title: 'We review readiness',
      text: 'connectNPO looks for practical opportunities across website, donors, content, operations, and reporting.',
    },
    {
      icon: '3',
      title: 'Receive next steps',
      text: 'Your answers help us prepare a focused review and recommendations you can act on.',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          connectNPO intake
        </p>
        <h1 className="text-2xl font-semibold text-main sm:text-3xl">
          Growth Readiness Review
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-muted">
          This short intake helps us understand where your nonprofit is today and
          where support could make the biggest difference. You do not need perfect
          answers — simple estimates and examples are enough.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {processCards.map((card) => (
          <div
            key={card.title}
            className="rounded-[7px] border border-border bg-[#fbfaf7] p-4"
          >
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
              {card.icon}
            </div>
            <h2 className="text-sm font-semibold text-main">{card.title}</h2>
            <p className="mt-1 text-sm leading-5 text-muted">{card.text}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[7px] border border-primary bg-primary-soft px-4 py-3">
        <p className="text-sm leading-6 text-main">
          <strong className="font-semibold">Privacy reminder:</strong>{' '}
          Please do not enter passwords, donor lists, private financial records,
          private client information, or confidential internal documents. This
          intake is only for general organization and digital readiness
          information.
        </p>
      </div>

      <ul className="grid gap-2 text-sm text-muted sm:grid-cols-2">
        <li>• Estimated time: 10–15 minutes</li>
        <li>• Rough estimates are okay</li>
        <li>• Required questions are marked with *</li>
        <li>• Examples are provided to make answers easier</li>
      </ul>

      <div className="flex justify-end border-t border-border pt-5">
        <Button type="button" onClick={onStart}>
          Start intake
        </Button>
      </div>
    </div>
  );
}

export function IntakeForm({
  token,
  sections,
}: {
  token: string;
  sections: IntakeSection[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [current, setCurrent] = useState(-1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const total = sections.length;
  const isIntro = current === -1;
  const isFirst = current === 0;
  const isLast = current === total - 1;
  const progress = isIntro ? 0 : Math.round(((current + 1) / total) * 100);

  function validateSection(index: number): boolean {
    const form = formRef.current;
    const section = sections[index];
    if (!form || !section) return true;

    const nextErrors: Record<string, string> = {};
    for (const question of section.questions) {
      const name = fieldName(section.key, question.key);
      if (question.required && !questionHasValue(form, section, question)) {
        nextErrors[name] = 'Please answer this required question before continuing.';
        continue;
      }
      if (!questionHasValidFormat(form, section, question)) {
        nextErrors[name] = 'Please enter a valid website URL, starting with https:// or http://.';
      }
    }

    setErrors((prev) => {
      const cleared = { ...prev };
      for (const question of section.questions) {
        delete cleared[fieldName(section.key, question.key)];
      }
      return { ...cleared, ...nextErrors };
    });

    if (Object.keys(nextErrors).length > 0) {
      const firstErrorName = Object.keys(nextErrors)[0];
      const firstControl = form.querySelector<HTMLElement>(`[name="${firstErrorName}"], #${firstErrorName}`);
      firstControl?.focus();
      return false;
    }

    return true;
  }

  function goNext() {
    if (!validateSection(current)) return;
    setCurrent(Math.min(total - 1, current + 1));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!validateSection(current)) {
      event.preventDefault();
    }
  }

  return (
    <form ref={formRef} action={submitIntake} onSubmit={handleSubmit} className="flex flex-col gap-6">
      <input type="hidden" name="token" value={token} />

      {isIntro ? (
        <IntroStep onStart={() => setCurrent(0)} />
      ) : (
        <>
          {/* Progress indicator */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-main">
                Section {current + 1} of {total}
              </span>
              <span className="text-muted">{progress}% complete</span>
            </div>
            <div
              className="h-2 w-full overflow-hidden rounded-[7px] bg-primary-soft"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-[7px] bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/*
            Render every section but only show the current one. Keeping all fields
            mounted means a single final submit captures every answer.
          */}
          {sections.map((s, index) => (
            <div
              key={s.key}
              hidden={index !== current}
              className="flex flex-col gap-5"
            >
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold text-main">{s.title}</h2>
                {s.description && (
                  <p className="text-sm text-muted">{s.description}</p>
                )}
              </div>
              <div className="flex flex-col gap-5">
                {s.questions.map((q) => {
                  const name = fieldName(s.key, q.key);
                  return <QuestionField key={q.key} section={s} question={q} error={errors[name]} />;
                })}
              </div>
            </div>
          ))}

          {/* Navigation */}
          <div className="flex items-center justify-between border-t border-border pt-5">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setCurrent(Math.max(0, current - 1))}
              disabled={isFirst}
            >
              Back
            </Button>

            {isLast ? (
              <SubmitButton />
            ) : (
              <Button type="button" onClick={goNext}>
                Next
              </Button>
            )}
          </div>
        </>
      )}
    </form>
  );
}
