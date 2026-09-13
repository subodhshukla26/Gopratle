'use client';

import { useState } from 'react';

const eventTypes = ['Wedding', 'Corporate Event', 'Concert', 'Festival', 'Party', 'Conference', 'Other'];
const categories = [
  { label: 'Event Planner', value: 'planner', detail: 'Coordinate the full experience' },
  { label: 'Performer', value: 'performer', detail: 'Bring the atmosphere to life' },
  { label: 'Crew', value: 'crew', detail: 'Support the event behind the scenes' },
];
const detailFields = {
  planner: [
    { name: 'services', label: 'Services needed', type: 'text', placeholder: 'e.g. Full planning, day-of coordination' },
    { name: 'guestCount', label: 'Estimated guest count', type: 'number', placeholder: 'e.g. 150' },
    { name: 'budget', label: 'Planning budget', type: 'text', placeholder: 'e.g. $2,000 – $5,000' },
  ],
  performer: [
    { name: 'performanceType', label: 'Performance type', type: 'text', placeholder: 'e.g. Live band, DJ, acoustic set' },
    { name: 'duration', label: 'Performance duration', type: 'text', placeholder: 'e.g. 2 hours' },
    { name: 'budget', label: 'Performance budget', type: 'text', placeholder: 'e.g. $1,500 – $3,000' },
  ],
  crew: [
    { name: 'crewRole', label: 'Crew role needed', type: 'text', placeholder: 'e.g. Sound engineer, stagehand' },
    { name: 'crewSize', label: 'Number of crew members', type: 'number', placeholder: 'e.g. 4' },
    { name: 'budget', label: 'Crew budget', type: 'text', placeholder: 'e.g. $800 – $1,500' },
  ],
};
const initialForm = { eventName: '', eventType: '', startDate: '', endDate: '', location: '', venue: '', category: '', categoryDetails: {} };

export default function PostRequirementPage() {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submittedRequirement, setSubmittedRequirement] = useState(null);

  const restoreFocusedField = () => {
    const activeFieldId = document.activeElement?.id;

    if (!activeFieldId) return;

    requestAnimationFrame(() => {
      const field = document.getElementById(activeFieldId);

      if (!field || document.activeElement === field) return;

      field.focus();

      const selectableInputTypes = ['text', 'search', 'url', 'tel', 'password'];

      if (field instanceof HTMLInputElement && selectableInputTypes.includes(field.type)) {
        const cursorPosition = field.value.length;
        field.setSelectionRange(cursorPosition, cursorPosition);
      }
    });
  };

  const updateField = (name, value) => {
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    restoreFocusedField();
  };

  const updateDetail = (name, value) => {
    setFormData((current) => ({ ...current, categoryDetails: { ...current.categoryDetails, [name]: value } }));
    setErrors((current) => ({ ...current, [name]: '' }));
    restoreFocusedField();
  };
  const validateBasics = () => {
    const next = {};
    if (!formData.eventName.trim()) next.eventName = 'Enter an event name.';
    if (!formData.eventType) next.eventType = 'Choose an event type.';
    if (!formData.startDate) next.startDate = 'Choose a start date.';
    if (!formData.endDate) next.endDate = 'Choose an end date.';
    if (formData.startDate && formData.endDate && formData.endDate < formData.startDate) next.endDate = 'End date cannot be before the start date.';
    if (!formData.location.trim()) next.location = 'Enter a city or location.';
    if (!formData.category) next.category = 'Select who you are looking for.';
    return next;
  };
  const validateDetails = () => Object.fromEntries((detailFields[formData.category] || []).filter((field) => !String(formData.categoryDetails[field.name] || '').trim()).map((field) => [field.name, `Enter ${field.label.toLowerCase()}.`]));
  const nextStep = (event) => {
    event.preventDefault();
    const next = currentStep === 1 ? validateBasics() : validateDetails();
    setErrors(next);
    if (!Object.keys(next).length) setCurrentStep((step) => Math.min(step + 1, 3));
  };
  const errorProps = (name) => ({ 'aria-invalid': Boolean(errors[name]), 'aria-describedby': errors[name] ? `${name}-error` : undefined });
  const selectedCategory = categories.find((item) => item.value === formData.category);
  const submitRequirement = async () => {
  if (isSubmitting) return;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    setSubmitError('API URL is not configured.');
    return;
  }

  setIsSubmitting(true);
  setSubmitError('');

  try {
    const response = await fetch(
      `${apiUrl.replace(/\/$/, '')}/api/requirements`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventName: formData.eventName.trim(),
          eventType: formData.eventType,
          startDate: formData.startDate,
          endDate: formData.endDate,
          location: formData.location.trim(),
          venue: formData.venue.trim() || undefined,
          category: formData.category,
          categoryDetails: formData.categoryDetails,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Unable to submit requirement.');
    }

    setSubmittedRequirement(result.data);
    setCurrentStep(4);
  } catch (error) {
    setSubmitError(error.message);
  } finally {
    setIsSubmitting(false);
  }
};
  return <main className="page-shell"><section className="form-card" aria-labelledby="page-title">
    <header className="page-header"><div className="brand-row"><span className="brand-dot" aria-hidden="true" /> GoPratle</div><p className="eyebrow">Create a new requirement</p><h1 id="page-title">Post a Requirement</h1><p>Tell us the essentials and we&apos;ll help you find the right people for your event.</p></header>
    <nav className="progress" aria-label="Requirement posting progress"><div className="progress-line" aria-hidden="true"><span style={{ width: `${(currentStep - 1) * 50}%` }} /></div>{[['1', 'Event Basics'], ['2', 'Category Details'], ['3', 'Review']].map(([number, label], index) => <div className={`progress-step ${index + 1 === currentStep ? 'active' : ''} ${index + 1 < currentStep ? 'complete' : ''}`} key={number}><span className="step-number">{index + 1 < currentStep ? '✓' : number}</span><span className="step-label">{label}</span></div>)}</nav>
    {currentStep === 1 && <form className="event-form" onSubmit={nextStep} noValidate><div className="form-grid"><Field label="Event name" name="eventName" error={errors.eventName}><input id="eventName" type="text" placeholder="Enter event name" value={formData.eventName} onChange={(e) => updateField('eventName', e.target.value)} {...errorProps('eventName')} /></Field><Field label="Event type" name="eventType" error={errors.eventType}><select id="eventType" value={formData.eventType} onChange={(e) => updateField('eventType', e.target.value)} {...errorProps('eventType')}><option value="">Select an event type</option>{eventTypes.map((type) => <option key={type}>{type}</option>)}</select></Field><Field label="Start date" name="startDate" error={errors.startDate}><input id="startDate" type="date" value={formData.startDate} onChange={(e) => updateField('startDate', e.target.value)} {...errorProps('startDate')} /></Field><Field label="End date" name="endDate" error={errors.endDate}><input id="endDate" type="date" min={formData.startDate || undefined} value={formData.endDate} onChange={(e) => updateField('endDate', e.target.value)} {...errorProps('endDate')} /></Field><Field label="Location" name="location" error={errors.location} wide><input id="location" type="text" placeholder="City or location" value={formData.location} onChange={(e) => updateField('location', e.target.value)} {...errorProps('location')} /></Field><Field label={<span>Venue <em>Optional</em></span>} name="venue" wide><input id="venue" type="text" placeholder="Venue name or address" value={formData.venue} onChange={(e) => updateField('venue', e.target.value)} /></Field></div><CategoryPicker value={formData.category} error={errors.category} onChange={(value) => updateField('category', value)} /><Footer action="Continue" /></form>}
    {currentStep === 2 && <form className="event-form" onSubmit={nextStep} noValidate><div><p className="step-kicker">Step 2 of 3</p><h2>Tell us about the {selectedCategory?.label.toLowerCase()} you need.</h2><p className="section-copy">Add a few details so the right professionals can respond to your requirement.</p></div><div className="form-grid">{(detailFields[formData.category] || []).map((field) => <Field key={field.name} label={field.label} name={field.name} error={errors[field.name]}><input id={field.name} type={field.type} placeholder={field.placeholder} value={formData.categoryDetails[field.name] || ''} onChange={(e) => updateDetail(field.name, e.target.value)} {...errorProps(field.name)} /></Field>)}</div><div className="form-footer"><button className="button button-secondary" type="button" onClick={() => setCurrentStep(1)}>Back</button><button className="button button-primary" type="submit">Review <span aria-hidden="true">→</span></button></div></form>}
    {currentStep === 3 && (
  <div className="event-form">
    <div>
      <p className="step-kicker">Step 3 of 3</p>
      <h2>Review your requirement</h2>
      <p className="section-copy">
        Make sure everything looks right before submitting.
      </p>
    </div>

    <Review formData={formData} category={selectedCategory} />

    {submitError && (
      <p className="error-message" role="alert">
        {submitError}
      </p>
    )}

    <div className="form-footer">
      <button
        className="button button-secondary"
        type="button"
        onClick={() => setCurrentStep(2)}
        disabled={isSubmitting}
      >
        Back to edit
      </button>

      <button
        className="button button-primary"
        type="button"
        onClick={submitRequirement}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit requirement'}
      </button>
    </div>
  </div>
)}
    {currentStep === 4 && (
  <div className="completion-card">
    <div className="success-mark" aria-hidden="true">
      ✓
    </div>

    <p className="step-kicker">Submitted</p>

    <h2>Requirement submitted successfully!</h2>

    <p className="completion-copy">
      Your requirement has been saved successfully.
    </p>

  </div>
)}
  </section>
  </main>;

function Field({ label, name, error, wide, children }) { return <div className={`field ${wide ? 'wide' : ''}`}><label htmlFor={name}>{label}</label>{children}{error && <p className="error-message" id={`${name}-error`} role="alert">{error}</p>}</div>; }
function CategoryPicker({ value, error, onChange }) { return <fieldset className="category-fieldset"><legend>What are you looking for?</legend><p className="field-hint">Choose one category to continue.</p>{error && <p className="error-message" role="alert">{error}</p>}<div className="category-grid">{categories.map((category) => <button key={category.value} type="button" className={`category-card ${value === category.value ? 'selected' : ''}`} onClick={() => onChange(category.value)} aria-pressed={value === category.value}><span className="category-radio" aria-hidden="true">{value === category.value ? '✓' : ''}</span><span><strong>{category.label}</strong><small>{category.detail}</small></span></button>)}</div></fieldset>; }
function Footer({ action }) { return <div className="form-footer"><span className="required-note"><span aria-hidden="true">*</span> Required fields</span><button className="button button-primary" type="submit">{action} <span aria-hidden="true">→</span></button></div>; }
function Review({ formData, category }) { const details = detailFields[formData.category] || []; return <div className="review-list"><ReviewRow label="Event name" value={formData.eventName} /><ReviewRow label="Event type" value={formData.eventType} /><ReviewRow label="Dates" value={`${formData.startDate} – ${formData.endDate}`} /><ReviewRow label="Location" value={[formData.location, formData.venue].filter(Boolean).join(' · ')} /><ReviewRow label="Category" value={category?.label} />{details.map((field) => <ReviewRow key={field.name} label={field.label} value={formData.categoryDetails[field.name]} />)}</div>; }
function ReviewRow({ label, value }) { return <div className="review-row"><span>{label}</span><strong>{value}</strong></div>; }
}
