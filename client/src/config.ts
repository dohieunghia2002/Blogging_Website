import { z } from "zod";

const configScheme = z.object({
    NEXT_PUBLIC_SERVER_API: z.string()
});

const configProject = configScheme.safeParse({
    NEXT_PUBLIC_SERVER_API: process.env.NEXT_PUBLIC_SERVER_API
});

if (!configProject.success) {
    console.error(configProject.error.issues);
    throw new Error('Values in .env file unlegal')
}

const envConfig = configProject.data;
export default envConfig;