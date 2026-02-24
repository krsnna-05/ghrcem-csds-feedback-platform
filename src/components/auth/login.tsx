import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { account } from "@/handlers/appwrite";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner"; // ✅ correct sonner import
import { useAuth } from "@/context/Auth";
import { useNavigate } from "react-router";

// ✅ Zod Schema
const formSchema = z.object({
  email: z.email("Enter a valid email"),
  accessCode: z.string().min(8, "Access code must be at least 8 characters"),
});

// ✅ Inferred strict type
type FormSchema = z.infer<typeof formSchema>;

const LoginForm = () => {
  useEffect(() => {
    const userPromise = account.get();
    userPromise
      .then((user) => {
        setAuth(user.$id, user.email, user.name, true);

        toast.success(`Welcome back, ${user.name}`);

        setTimeout(() => {
          navigate("/faculty/dashboard");
        }, 1500);
      })
      .catch((error) => {
        console.log("User is not logged in", error);
      });

    return () => {
      toast.dismiss();
    };
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  // ✅ React Hook Form with strict typing
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      accessCode: "",
    },
    mode: "onSubmit",
  });

  // ✅ Typed submit handler
  const onSubmit: SubmitHandler<FormSchema> = async (values) => {
    setIsLoading(true);
    const t = toast.loading("Logging in...");

    try {
      await account.createEmailPasswordSession(values.email, values.accessCode);

      const user = await account.get();

      form.reset();

      setAuth(user.$id, user.email, user.name, true);

      toast.success(`Welcome back, ${user.name}`, { id: t }); // replaces loading

      setTimeout(() => {
        navigate("/faculty/dashboard");
      }, 1000);
    } catch (error: any) {
      form.reset();
      toast.error(error.message || "Login failed", { id: t }); // replaces loading
      console.error("Login failed:", error.message || error);
    } finally {
      form.reset();
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-background px-4 flex-1">
      <Card className="w-full max-w-sm border border-border shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-lg font-bold">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Access Code */}
              <FormField
                control={form.control}
                name="accessCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Access Code</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter access code"
                          {...field}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
