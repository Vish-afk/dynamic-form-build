
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const Success = () => {
  const navigate = useNavigate();
  const userName = sessionStorage.getItem("userName") || "Student";

  useEffect(() => {
    // If no userName is found, redirect to login
    if (!sessionStorage.getItem("userName")) {
      navigate("/");
    }
  }, [navigate]);

  const handleStartNewForm = () => {
    // Clear session storage
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-center">Form Submitted Successfully!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Thank you, {userName}! Your form has been submitted successfully. 
            The form data has been logged to the console.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={handleStartNewForm}>Start New Form</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Success;
