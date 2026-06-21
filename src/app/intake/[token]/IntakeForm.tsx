'use client';

import { useState } from 'react';
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

function QuestionField({ section, question }: { section: IntakeSection; question: IntakeQuestion }) {
  const name = fieldName(section.key, question.key);
  const supportsOther = question.type === 'select' && question.allowOther && question.options?.includes('Other');
  const [selectedValue, setSelectedValue] = useState('');

  return (
    <Field htmlFor={name} label={question.label} helper={question.helper}>
      {question.type === 'textarea' ? (
        <Textarea id={name} name={name} placeholder={question.placeholder} />
      ) : question.type === 'select' ? (
        <div className="flex flex-col gap-3">
          <Select
            id={name}
            name={name}
            defaultValue=""
            onChange={(event) => setSelectedValue(event.target.value)}
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
      ) : (
        <Input
          id={name}
          name={name}
          type={question.type === 'url' ? 'url' : 'text'}
          placeholder={question.placeholder}
        />
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

export function IntakeForm({
  token,
  sections,
}: {
  token: string;
  sections: IntakeSection[];
}) {
  const [current, setCurrent] = useState(0);
  const total = sections.length;
  const isFirst = current === 0;
  const isLast = current === total - 1;
  const progress = Math.round(((current + 1) / total) * 100);

  return (
    <form action={submitIntake} className="flex flex-col gap-6">
      <input type="hidden" name="token" value={token} />

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
            {s.questions.map((q) => (
              <QuestionField key={q.key} section={s} question={q} />
            ))}
          </div>
        </div>
      ))}

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-border pt-5">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={isFirst}
        >
          Back
        </Button>

        {isLast ? (
          <SubmitButton />
        ) : (
          <Button
            type="button"
            onClick={() => setCurrent((c) => Math.min(total - 1, c + 1))}
          >
            Next
          </Button>
        )}
      </div>
    </form>
  );
}
