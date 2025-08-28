"use client"
import { useRouter } from "next/navigation"
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

    async function onSubmit(values: LoginBodyType) {
        try {
            const res = await fetch(`${envConfig.NEXT_PUBLIC_SERVER_API}/auth/login`, {
                body: JSON.stringify(values),
                headers: { "Content-Type": "application/json" },
                method: "POST",
            })

            const result = await res.json()
            console.log(res)

            if (!res.ok) {
                toast.error(result.message || "Đăng nhập thất bại")
                return
            }

            toast.success("Đăng nhập thành công 🎉")

            // Lưu token (ví dụ vào localStorage)
            localStorage.setItem("accessToken", result.data.accessToken)

            setTimeout(() => {
                router.push("/")
            }, 8000)
        } catch (error) {
            toast.error("Không thể kết nối đến server")
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
