/* eslint-disable @typescript-eslint/no-unused-vars */


"use client"

import React, { useState, useTransition } from 'react';
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as z from "zod";
import { Eye, EyeOff, User, Mail, Phone, Lock } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { RegisterUserSchema, Role } from "@/validaton-schema";
import { registerUser } from "@/actions/registerUser";
import MainButton from "@/components/common/MainButton";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import Image from 'next/image';

const FormSchema = RegisterUserSchema;

type RegisterFormProps = {
  text: string;
  role: Role;
};

const RegisterForm = ({ text, role }: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      password: "",
      role: "SALES_REP", // Default role, can be overridden
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (role) {
      data.role = role;
    }

    setError(undefined);
    setSuccess(undefined);

    startTransition(() => {
      registerUser(data)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
          }
          if (data?.success) {
            form.reset();
            setSuccess(data.success);
            toast({
              title: "🎉 Registration success",
              description: data.success,
            });
          }
        })
        .catch(() => setError("Something went wrong!"));
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardHeader>
          <div className="text-center">
            <Image
              src="https://gojf7j54p4.ufs.sh/f/CcC11ljtXd0cVJkIxkqEgHb468cUmrZkfjiutLze1KlGD7xp"
              alt="Logo"
              width={100}
              height={100}
              className="mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500" />
                        <Input
                          {...field}
                          className="h-12 pl-10 w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                          placeholder="Full name"
                        />
                      </div>  
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 h-5 w-5" />
                        <Input
                          {...field}
                          className="h-12 pl-10 w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                          placeholder="Email Address"
                          type="email"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 h-5 w-5" />
                        <Input
                          {...field}
                          className="h-12 pl-10 w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                          placeholder="Phone Number"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 h-5 w-5" />
                        <Input
                          {...field}
                          className="h-12 pl-10 pr-10 w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormError message={error}  />
              <FormSuccess message={success}  />

              <MainButton
                text="Register"
                classes="h-12 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:from-emerald-600 hover:to-blue-600"
                width="full_width"
                isSubmitable
                isLoading={isPending}
              />

              <div className="text-center mt-4">
                <Link 
                  href="/auth/login" 
                  className="text-sm font-semibold text-emerald-600 hover:text-emerald-800 transition-colors duration-200"
                >
                  Already have an account? Login Instead
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterForm;