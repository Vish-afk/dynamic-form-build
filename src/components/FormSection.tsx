
import { FormField, FormSection, UserFormData } from "@/types/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormSectionProps {
  section: FormSection;
  userFormData: UserFormData;
  errors: Record<string, string>;
  onFieldChange: (fieldId: string, value: string | string[] | boolean) => void;
}

const FormSectionComponent: React.FC<FormSectionProps> = ({
  section,
  userFormData,
  errors,
  onFieldChange,
}) => {
  const renderField = (field: FormField) => {
    const value = userFormData[field.fieldId] || "";
    const error = errors[field.fieldId];

    switch (field.type) {
      case "text":
      case "tel":
      case "email":
        return (
          <div key={field.fieldId} className="space-y-2 mb-4">
            <Label htmlFor={field.fieldId} className="text-sm font-medium">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={field.fieldId}
              type={field.type}
              value={value as string}
              onChange={(e) => onFieldChange(field.fieldId, e.target.value)}
              placeholder={field.placeholder || ""}
              maxLength={field.maxLength}
              data-test-id={field.dataTestId}
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="field-error">{error}</p>}
          </div>
        );

      case "textarea":
        return (
          <div key={field.fieldId} className="space-y-2 mb-4">
            <Label htmlFor={field.fieldId} className="text-sm font-medium">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id={field.fieldId}
              value={value as string}
              onChange={(e) => onFieldChange(field.fieldId, e.target.value)}
              placeholder={field.placeholder || ""}
              maxLength={field.maxLength}
              data-test-id={field.dataTestId}
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="field-error">{error}</p>}
          </div>
        );

      case "date":
        return (
          <div key={field.fieldId} className="space-y-2 mb-4">
            <Label htmlFor={field.fieldId} className="text-sm font-medium">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={field.fieldId}
              type="date"
              value={value as string}
              onChange={(e) => onFieldChange(field.fieldId, e.target.value)}
              data-test-id={field.dataTestId}
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="field-error">{error}</p>}
          </div>
        );

      case "dropdown":
        return (
          <div key={field.fieldId} className="space-y-2 mb-4">
            <Label htmlFor={field.fieldId} className="text-sm font-medium">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Select
              value={value as string}
              onValueChange={(val) => onFieldChange(field.fieldId, val)}
            >
              <SelectTrigger 
                id={field.fieldId} 
                data-test-id={field.dataTestId}
                className={error ? "border-red-500" : ""}
              >
                <SelectValue placeholder={field.placeholder || "Select an option"} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    data-test-id={option.dataTestId}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="field-error">{error}</p>}
          </div>
        );

      case "radio":
        return (
          <div key={field.fieldId} className="space-y-3 mb-4">
            <div className="text-sm font-medium">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </div>
            <RadioGroup
              value={value as string}
              onValueChange={(val) => onFieldChange(field.fieldId, val)}
              className={error ? "border-red-500 border p-3 rounded" : ""}
            >
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={option.value} 
                    id={`${field.fieldId}-${option.value}`}
                    data-test-id={option.dataTestId}
                  />
                  <Label htmlFor={`${field.fieldId}-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
            {error && <p className="field-error">{error}</p>}
          </div>
        );

      case "checkbox":
        const checkboxValues = Array.isArray(value) ? value : [];
        return (
          <div key={field.fieldId} className="space-y-3 mb-4">
            <div className="text-sm font-medium">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </div>
            <div className={`space-y-2 ${error ? "border-red-500 border p-3 rounded" : ""}`}>
              {field.options?.map((option) => {
                const isChecked = checkboxValues.includes(option.value);
                return (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${field.fieldId}-${option.value}`}
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          onFieldChange(field.fieldId, [
                            ...checkboxValues,
                            option.value,
                          ]);
                        } else {
                          onFieldChange(
                            field.fieldId,
                            checkboxValues.filter((v) => v !== option.value)
                          );
                        }
                      }}
                      data-test-id={option.dataTestId}
                    />
                    <Label htmlFor={`${field.fieldId}-${option.value}`}>{option.label}</Label>
                  </div>
                );
              })}
            </div>
            {error && <p className="field-error">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="form-section">
      <h2 className="section-title">{section.title}</h2>
      <p className="section-description">{section.description}</p>
      {section.fields.map(renderField)}
    </div>
  );
};

export default FormSectionComponent;
