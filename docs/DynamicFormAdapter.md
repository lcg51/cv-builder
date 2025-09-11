# Dynamic Form Adapter

The Dynamic Form Adapter is a powerful component that allows you to create form components dynamically by passing a configuration schema. This eliminates code duplication across form components while maintaining type safety and validation.

## Features

-   ✅ **Dynamic Field Generation**: Create forms by defining field configurations
-   ✅ **Type Safety**: Full TypeScript support with proper type inference
-   ✅ **Validation**: Integrated Zod validation with custom schemas
-   ✅ **Multiple Field Types**: Support for text, email, tel, url, textarea, date, slider, and number inputs
-   ✅ **Array Fields**: Support for dynamic arrays (like education, experience lists)
-   ✅ **Grid Layout**: Flexible grid layouts with half/full column options
-   ✅ **StepsBar Integration**: Compatible with existing StepsBar validation system
-   ✅ **Custom Styling**: Consistent styling with the existing design system

## Supported Field Types

| Type       | Component       | Description                     |
| ---------- | --------------- | ------------------------------- |
| `text`     | Input           | Standard text input             |
| `email`    | Input           | Email input with validation     |
| `tel`      | Input           | Phone number input              |
| `url`      | Input           | URL input with validation       |
| `textarea` | Textarea        | Multi-line text input           |
| `date`     | MonthYearPicker | Date picker component           |
| `slider`   | Slider          | Range slider for numeric values |
| `number`   | Input           | Numeric input with min/max      |

## Basic Usage

### Simple Form (Contact Information)

```typescript
import React from 'react';
import { ContactIcon } from '@/ui/icons/FormIcons';
import { DynamicFormAdapter, type DynamicFormConfig } from './DynamicFormAdapter';

const contactFormConfig: DynamicFormConfig = {
  header: {
    title: 'Contact Information',
    description: 'Tell us about yourself and how to reach you',
    icon: <ContactIcon color="black" />
  },
  fields: [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      placeholder: 'John',
      required: true,
      minLength: 2,
      gridColumn: 'half'
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      placeholder: 'Doe',
      required: true,
      minLength: 2,
      gridColumn: 'half'
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'john.doe@example.com',
      required: true,
      gridColumn: 'half'
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'tel',
      placeholder: '+1 (555) 123-4567',
      required: true,
      gridColumn: 'half'
    }
  ]
};

export const ContactFormDynamic = (props) => {
  return <DynamicFormAdapter config={contactFormConfig} {...props} />;
};
```

### Array Form (Education/Experience)

```typescript
import React from 'react';
import { EducationIcon } from '@/ui/icons';
import { DynamicFormAdapter, type DynamicFormConfig } from './DynamicFormAdapter';

const educationFormConfig: DynamicFormConfig = {
  header: {
    title: 'Education',
    description: 'Add your educational background',
    icon: <EducationIcon color="black" />
  },
  formKey: 'education', // Groups all form data under this key
  fields: [
    {
      name: 'educationForms',
      label: 'Education',
      type: 'text',
      isArray: true,
      addButtonText: 'Add Another Education',
      itemTitle: (index: number) => `Education ${index + 1}`,
      arrayItemSchema: {
        university: {
          name: 'university',
          label: 'School/University',
          type: 'text',
          placeholder: 'Harvard University',
          required: true,
          minLength: 2,
          gridColumn: 'half'
        },
        degree: {
          name: 'degree',
          label: 'Degree',
          type: 'text',
          placeholder: 'Bachelor of Science',
          required: true,
          minLength: 2,
          gridColumn: 'half'
        },
        finishDate: {
          name: 'finishDate',
          label: 'Graduation Date',
          type: 'date',
          required: true,
          gridColumn: 'half'
        },
        description: {
          name: 'description',
          label: 'Description (Optional)',
          type: 'textarea',
          placeholder: 'Describe your achievements...',
          required: false,
          gridColumn: 'full'
        }
      }
    }
  ]
};

export const EducationFormDynamic = (props) => {
  return <DynamicFormAdapter config={educationFormConfig} {...props} />;
};
```

### Experience Form with Multiple Date Fields

```typescript
import React from 'react';
import { ExperienceIcon } from '@/ui/icons';
import { DynamicFormAdapter, type DynamicFormConfig } from './DynamicFormAdapter';

const experienceFormConfig: DynamicFormConfig = {
	header: {
		title: 'Work Experience',
		description: 'Add your professional experience, starting with your most recent position',
		icon: <ExperienceIcon color="black" />
	},
	formKey: 'workExperience',
	fields: [
		{
			name: 'experienceForms',
			label: 'Experience',
			type: 'text',
			isArray: true,
			addButtonText: 'Add Another Experience',
			itemTitle: (index: number) => `Experience ${index + 1}`,
			arrayItemSchema: {
				jobTitle: {
					name: 'jobTitle',
					label: 'Job Title',
					type: 'text',
					placeholder: 'Software Engineer',
					required: true,
					minLength: 2,
					gridColumn: 'half'
				},
				company: {
					name: 'company',
					label: 'Company',
					type: 'text',
					placeholder: 'Google',
					required: true,
					minLength: 2,
					gridColumn: 'half'
				},
				startDate: {
					name: 'startDate',
					label: 'Start Date',
					type: 'date',
					required: true,
					gridColumn: 'half'
				},
				endDate: {
					name: 'endDate',
					label: 'End Date',
					type: 'date',
					required: true,
					gridColumn: 'half'
				},
				location: {
					name: 'location',
					label: 'Location',
					type: 'text',
					placeholder: 'San Francisco, CA',
					required: true,
					minLength: 2,
					gridColumn: 'half'
				},
				description: {
					name: 'description',
					label: 'Job Description',
					type: 'textarea',
					placeholder: 'Describe your key responsibilities and achievements...',
					required: true,
					minLength: 2,
					gridColumn: 'full'
				}
			}
		}
	]
};

export const ExperienceFormDynamic = (props) => {
	return <DynamicFormAdapter config={experienceFormConfig} {...props} />;
};
```

### Skills Form with Slider

```typescript
import React from 'react';
import { SkillsIcon } from '@/ui/icons';
import { DynamicFormAdapter, type DynamicFormConfig } from './DynamicFormAdapter';

const skillsFormConfig: DynamicFormConfig = {
	header: {
		title: 'Skills & Expertise',
		description: 'Add your key skills and rate your proficiency',
		icon: <SkillsIcon color="black" />
	},
	formKey: 'skills',
	fields: [
		{
			name: 'skillsForms',
			label: 'Skills',
			type: 'text',
			isArray: true,
			addButtonText: 'Add Another Skill',
			itemTitle: (index: number) => `Skill ${index + 1}`,
			arrayItemSchema: {
				title: {
					name: 'title',
					label: 'Skill Name',
					type: 'text',
					placeholder: 'JavaScript',
					required: true,
					minLength: 2,
					gridColumn: 'half'
				},
				level: {
					name: 'level',
					label: 'Proficiency Level',
					type: 'slider',
					min: 0,
					max: 100,
					step: 5,
					required: true,
					gridColumn: 'half'
				}
			}
		}
	]
};

export const SkillsFormDynamic = (props) => {
	return <DynamicFormAdapter config={skillsFormConfig} {...props} />;
};
```

### About Form with Custom Validation

```typescript
import React from 'react';
import { z } from 'zod';
import { AboutIcon } from '@/ui/icons/FormIcons';
import { DynamicFormAdapter, type DynamicFormConfig } from './DynamicFormAdapter';

// Custom validation for GitHub URLs
const githubValidation = z
	.string()
	.refine(
		url => {
			if (url === '') return true; // Allow empty string
			try {
				new URL(url);
				return url.includes('github.com');
			} catch {
				return false;
			}
		},
		{
			message: 'Please enter a valid GitHub URL or leave empty'
		}
	)
	.optional()
	.or(z.literal(''));

const aboutFormConfig: DynamicFormConfig = {
	header: {
		title: 'Professional Summary',
		description: 'Write a brief summary that highlights your key achievements',
		icon: <AboutIcon color="black" />
	},
	fields: [
		{
			name: 'aboutMe',
			label: 'Professional Summary',
			type: 'textarea',
			placeholder: 'I am a passionate software engineer...',
			required: true,
			minLength: 2,
			gridColumn: 'full',
			helpText: 'Keep it concise (2-3 sentences recommended)'
		},
		{
			name: 'github',
			label: 'GitHub Profile',
			type: 'url',
			placeholder: 'https://github.com/yourusername',
			required: false,
			validation: githubValidation,
			gridColumn: 'full',
			helpText: 'Include your full GitHub profile URL'
		}
	]
};

export const AboutFormDynamic = (props) => {
	return <DynamicFormAdapter config={aboutFormConfig} {...props} />;
};
```

## Configuration Options

### DynamicFormConfig

```typescript
interface DynamicFormConfig {
	header: FormHeader;
	fields: FieldConfig[];
	formKey?: string; // Optional key for grouping form data in onFieldChange
	containerClassName?: string; // Optional additional CSS classes
}
```

### FormHeader

```typescript
interface FormHeader {
	title: string;
	description: string;
	icon: ReactNode;
}
```

### Field Configuration

#### Base Field Config

```typescript
interface BaseFieldConfig {
	name: string;
	label: string;
	type: FieldType;
	placeholder?: string;
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	min?: number; // For sliders and numbers
	max?: number; // For sliders and numbers
	step?: number; // For sliders and numbers
	validation?: z.ZodSchema<unknown>; // Custom Zod validation
	gridColumn?: 'full' | 'half';
	helpText?: string; // Optional help text below the field
}
```

#### Array Field Config

```typescript
interface ArrayFieldConfig extends BaseFieldConfig {
	isArray: true;
	arrayItemSchema: Record<string, BaseFieldConfig>;
	addButtonText?: string;
	itemTitle?: (index: number) => string;
}
```

## Custom Validation

You can provide custom Zod validation schemas for complex validation requirements:

```typescript
import { z } from 'zod';

const customValidation = z
	.string()
	.url()
	.refine(url => url.includes('github.com'), {
		message: 'Must be a valid GitHub URL'
	});

const fieldConfig = {
	name: 'github',
	label: 'GitHub Profile',
	type: 'url',
	validation: customValidation,
	required: false
};
```

## Integration with StepsBar

The Dynamic Form Adapter integrates seamlessly with the existing StepsBar component:

```typescript
// In your StepsBar configuration
const steps = [
	{
		title: 'Contact',
		component: ContactFormDynamic,
		active: true,
		isClickable: true
	},
	{
		title: 'About',
		component: AboutFormDynamic,
		active: false,
		isClickable: false
	},
	{
		title: 'Experience',
		component: ExperienceFormDynamic,
		active: false,
		isClickable: false
	},
	{
		title: 'Education',
		component: EducationFormDynamic,
		active: false,
		isClickable: false
	},
	{
		title: 'Skills',
		component: SkillsFormDynamic,
		active: false,
		isClickable: false
	}
];
```

## Available Dynamic Forms

All the major form components now have dynamic equivalents:

| Original Form    | Dynamic Form            | Features                              |
| ---------------- | ----------------------- | ------------------------------------- |
| `ContactForm`    | `ContactFormDynamic`    | Simple fields, email/phone validation |
| `AboutForm`      | `AboutFormDynamic`      | Textarea, custom URL validation       |
| `ExperienceForm` | `ExperienceFormDynamic` | Array fields, date pickers, textarea  |
| `EducationForm`  | `EducationFormDynamic`  | Array fields, date pickers            |
| `SkillsForm`     | `SkillsFormDynamic`     | Array fields, slider components       |

## Initial Values Mapping

The Dynamic Form Adapter automatically handles initial value mapping based on the `formKey` configuration:

```typescript
// For ExperienceForm - formKey: 'workExperience'
const initialValues = {
	workExperience: [
		{
			jobTitle: 'Software Engineer',
			company: 'Google',
			startDate: '2022-01-01', // Will be converted to Date object
			endDate: '2023-12-31', // Will be converted to Date object
			location: 'San Francisco, CA',
			description: 'Built scalable web applications...'
		}
	]
};

// For EducationForm - formKey: 'education'
const initialValues = {
	education: [
		{
			university: 'Stanford University',
			degree: 'Computer Science',
			fieldOfStudy: 'Machine Learning',
			finishDate: '2021-06-01', // Will be converted to Date object
			city: 'Stanford, CA',
			description: 'Focused on AI and ML...'
		}
	]
};

// For SkillsForm - formKey: 'skills'
const initialValues = {
	skills: [
		{
			title: 'JavaScript',
			level: [85] // Slider values are arrays
		}
	]
};
```

**Key Points:**

-   Array forms use `formKey` to map data (e.g., `workExperience` → `experienceForms`)
-   Date strings are automatically converted to Date objects
-   Slider values are stored as arrays of numbers
-   The adapter handles all the data transformation automatically
-   Array forms extract the array data before sending to `onFieldChange`
-   Simple forms send individual field values when no `formKey` is specified

## Migration from Existing Forms

To migrate existing forms to use the Dynamic Form Adapter:

1. **Extract the schema**: Convert your Zod schema to field configurations
2. **Map the header**: Move the header section to the config
3. **Configure fields**: Convert each FormField to a field configuration
4. **Handle arrays**: Convert useFieldArray logic to array field configs
5. **Set formKey**: Ensure the formKey matches your data structure
6. **Test thoroughly**: Ensure validation and data flow work correctly

## Benefits

-   **Reduced Code Duplication**: Write form logic once, reuse everywhere
-   **Consistent UI**: All forms use the same styling and layout patterns
-   **Type Safety**: Full TypeScript support with proper inference
-   **Easy Maintenance**: Changes to form behavior apply to all forms
-   **Flexible**: Support for simple fields and complex array structures
-   **Extensible**: Easy to add new field types and validation rules

## Limitations

-   Complex custom layouts may require custom components
-   Performance overhead for very large forms (though minimal)
-   Learning curve for developers unfamiliar with configuration-driven approaches

## Troubleshooting

### Slider Not Updating

If slider values are not updating properly, ensure that:

-   The field type is set to `'slider'`
-   Default values are arrays: `[50]` not `50`
-   Min/max values are properly configured
-   The form is using the DynamicFormAdapter correctly

### Date Fields Not Loading

If date fields show undefined:

-   Ensure initial values contain Date objects or valid date strings
-   The adapter automatically converts date strings to Date objects
-   Check that the `formKey` matches your data structure

### Array Forms Not Saving

If array form data gets erased:

-   Verify the `formKey` matches your data source
-   Check console logs for data flow debugging
-   Ensure the store expects the correct data structure

## Future Enhancements

-   Support for conditional fields
-   Field dependencies and dynamic validation
-   Custom field renderers
-   Form sections and groups
-   Advanced layout options
