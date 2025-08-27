"use client"
import { useRouter } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RegisterBody, RegisterBodyType } from "../schemaValidation/auth"
import { toast } from "sonner"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import envConfig from "@/config"

export function FormRegister() {
  const router = useRouter()
  const form = useForm<RegisterBodyType>({
    resolver: zodResolver(RegisterBody),
    defaultValues: {
      fullname: "",
      penName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: RegisterBodyType) {
    try {
      console.log(JSON.stringify(values));
      
      const res = await fetch(`${envConfig.NEXT_PUBLIC_SERVER_API}/auth/signup`, {
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      })

      const result = await res.json()
      console.log(result);
      

      if (!res.ok) {
        toast.error(result.message || "Đăng ký thất bại")
        return
      }

      toast.success("Đăng ký thành công 🎉")
      form.reset()

      // Redirect sang login sau 1.5s
      setTimeout(() => {
        router.push("/login")
      }, 1500)
    } catch (error) {
      toast.error("Không thể kết nối đến server")
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">Create an account</CardTitle>
        <CardDescription className="text-center">
          Fill in the information below to register
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-5">
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input placeholder="Steven Do" {...field} />
                  </FormControl>
                  <FormDescription className="italic">
                    Your full legal name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="penName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pen name</FormLabel>
                  <FormControl>
                    <Input placeholder="The Perfect Writer" {...field} />
                  </FormControl>
                  <FormDescription className="italic">
                    This is your public display name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="theperfect@gmail.com" type="email" {...field} />
                  </FormControl>
                  <FormDescription className="italic">
                    Must be a valid email address
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormDescription className="italic">At least 8 characters</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3">
              <Button type="submit" className="flex-1">Register</Button>
              <Button type="button" variant="outline" className="flex-1" onClick={() => form.reset()}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
