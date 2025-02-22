"use client";

import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <Image
                src="/images/logo.svg"
                alt={`${APP_NAME} logo`}
                width={48}
                height={48}
                priority={true}
            />
            <div className="w-1/3 rounded-lg p-6 text-center shadow-md">
                <h1 className="mb-4 text-3xl font-bold">Not Found - 404</h1>
                <p className="text-destructive">
                    Could not find the page you were looking for.
                </p>
                <Button
                    variant="outline"
                    className="ml-2 mt-4"
                    onClick={() => (window.location.href = "/")}
                >
                    Back to Home
                </Button>
            </div>
        </div>
    );
};
export default NotFoundPage;
