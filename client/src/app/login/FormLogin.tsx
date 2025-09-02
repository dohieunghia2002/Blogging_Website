"use client"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import envConfig from "@/config"
import { LoginBody, LoginBodyType } from "../schemaValidation/auth"

export function FormLogin() {
    const router = useRouter()
    const form = useForm<LoginBodyType>({
        resolver: zodResolver(LoginBody),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: { email: string; password: string }) {
        const res = await signIn("credentials", {
            redirect: false,
            email: values.email,
            password: values.password,
        })

        if (res?.error) {
            toast.error("Đăng nhập thất bại ❌")
        } else {
            toast.success("Đăng nhập thành công 🎉")
            router.push("/")
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto shadow-lg rounded-2xl">
            <CardHeader>
                <CardTitle className="text-center text-2xl font-bold">Welcome back</CardTitle>
                <CardDescription className="text-center">
                    Please enter your credentials to login
                </CardDescription>
            </CardHeader>

            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-5">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="example@gmail.com" {...field} />
                                    </FormControl>
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
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full">Login</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
