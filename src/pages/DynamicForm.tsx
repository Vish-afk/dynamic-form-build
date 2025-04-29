
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { getFormData } from "@/services/api";
import { FormResponse, FormSection, UserFormData } from "@/types/form";
import FormSectionComponent from "@/components/FormSection";
import { ArrowLeft, ArrowRight } from "lucide-react";

const DynamicForm = () => {
  const [formData, setFormData] = useState<FormResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [userFormData, setUserFormData] = useState<UserFormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const rollNumber = sessionStorage.getItem("rollNumber");
    
    if (!rollNumber) {
      toast({
        title: "Error",
        description: "Please login first",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    const fetchForm = async () => {
      try {
        const response = await getFormData(rollNumber);
        setFormData(response);
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch form",
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [navigate, toast]);

  const validateSection = (section: FormSection): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    for (const field of section.fields) {
      const value = userFormData[field.fieldId];
      
      // Check required fields
      if (field.required && 
          (value === undefined || value === "" || 
           (Array.isArray(value) && value.length === 0))) {
        newErrors[field.fieldId] = field.validation?.message || "This field is required";
        isValid = false;
      }
      
      // Check minLength (for text inputs)
      if (field.minLength !== undefined && 
          typeof value === "string" && 
          value.length < field.minLength && 
          value !== "") {
        newErrors[field.fieldId] = `Minimum ${field.minLength} characters required`;
        isValid = false;
      }
      
      // Check maxLength (for text inputs)
      if (field.maxLength !== undefined && 
          typeof value === "string" && 
          value.length > field.maxLength) {
        newErrors[field.fieldId] = `Maximum ${field.maxLength} characters allowed`;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    const currentSection = formData?.form.sections[currentSectionIndex];
    if (!currentSection) return;

    if (validateSection(currentSection)) {
      setCurrentSectionIndex((prev) => prev + 1);
    } else {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before proceeding",
        variant: "destructive",
      });
    }
  };

  const handlePrevious = () => {
    setCurrentSectionIndex((prev) => Math.max(0, prev - 1));
  };

  const handleSubmit = () => {
    const currentSection = formData?.form.sections[currentSectionIndex];
    if (!currentSection) return;

    if (validateSection(currentSection)) {
      // Log the collected form data
      console.log("Form submission data:", userFormData);
      
      toast({
        title: "Form Submitted",
        description: "Check the console for the submitted data",
      });
      
      // Navigate to success page or show success message
      navigate("/success");
    } else {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting",
        variant: "destructive",
      });
    }
  };

  const handleFieldChange = (fieldId: string, value: string | string[] | boolean) => {
    setUserFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
    
    // Clear error for this field when user changes its value
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading form...</p>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-destructive">Failed to load form data</p>
      </div>
    );
  }

  const currentSection = formData.form.sections[currentSectionIndex];
  const isLastSection = currentSectionIndex === formData.form.sections.length - 1;

  return (
    <div className="min-h-screen py-8 px-4 bg-secondary/30">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="form-title">{formData.form.formTitle}</CardTitle>
            <div className="w-full bg-secondary rounded-full h-2 mb-4">
              <div 
                className="h-full bg-primary rounded-full transition-all" 
                style={{ 
                  width: `${((currentSectionIndex + 1) / formData.form.sections.length) * 100}%` 
                }}
              ></div>
            </div>
          </CardHeader>

          <CardContent>
            {currentSection && (
              <FormSectionComponent
                section={currentSection}
                userFormData={userFormData}
                errors={errors}
                onFieldChange={handleFieldChange}
              />
            )}

            <div className="form-buttons">
              {currentSectionIndex > 0 && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handlePrevious}
                  data-test-id="prev-button"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft size={16} /> Previous
                </Button>
              )}
              
              {!isLastSection ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  data-test-id="next-button"
                  className="ml-auto flex items-center gap-2"
                >
                  Next <ArrowRight size={16} />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  data-test-id="submit-button"
                  className="ml-auto bg-green-600 hover:bg-green-700"
                >
                  Submit Form
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DynamicForm;
