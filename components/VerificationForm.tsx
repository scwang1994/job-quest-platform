"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { SelfApp, SelfAppBuilder } from "@selfxyz/qrcode";
import ClientQRWrapper from "@/components/ClientQRWrapper";
import "@fontsource/press-start-2p";

export default function VerificationForm() {
    const [form, setForm] = useState({
        name: "",
        disclosures: {
            nationality: false,
            age: false,
            sanctioned: false,
        },
    });
    const [selfApp, setSelfApp] = useState<SelfApp | null>(null);
    const router = useRouter();

    useEffect(() => {
        const name = getCookie("name") as string;
        if (name) {
            setForm((prevForm) => ({ ...prevForm, name }));
        }

        const selfApp = new SelfAppBuilder({
            appName: "Verification Platform",
            scope: "ben-app",
            endpoint: "http://1.34.238.124:3000/api/verify",
            logoBase64: "https://i.imgur.com/Rz8B3s7.png",
            userId: uuidv4(),
            disclosures: form.disclosures,
            devMode: true,
        }).build();

        setSelfApp(selfApp);
    }, [form.disclosures]);

    const handleDisclosureChange = (field: string) => {
        setForm((prevForm) => ({
            ...prevForm,
            disclosures: {
                ...prevForm.disclosures,
                [field]: !prevForm.disclosures[field as keyof typeof prevForm.disclosures],
            },
        }));
    };

    const updateUserData = async (data: typeof form) => {
        try {
            const isVerified = Object.keys(data.disclosures).filter(
                (key) => data.disclosures[key as keyof typeof data.disclosures]
            );

            const response = await fetch("/api/updateUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, isVerified }),
            });

            if (!response.ok) throw new Error("Failed to update user data");

            setCookie("disclosures", JSON.stringify(data.disclosures));
            setCookie("isVerifiedLength", String(isVerified.length));

            alert("✅ Verification submitted successfully!");
            router.push("/job-listing");
        } catch (error) {
            console.error(error);
            alert("❌ Failed to submit verification.");
        }
    };

    const handleVerificationSuccess = () => {
        console.log("Verification successful");
        updateUserData(form);
    };

    return (
        <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-6 font-['Press Start 2P'] text-gray-800">
            <form
                onSubmit={(e) => e.preventDefault()}
                className="bg-white border-4 border-blue-900 p-6 rounded-none shadow-[6px_6px_0px_black] w-full max-w-md space-y-4 text-[10px]"
            >
                <h1 className="text-xl text-blue-900 text-center mb-4 border-b-4 border-blue-900 pb-2">
                    🛡️ VERIFICATION
                </h1>

                <div>
                    <label className="block mb-1">👤 Name: {form.name || "No name provided"}</label>
                </div>

                <div>
                    <label className="block mb-1">✅ Select items to verify</label>
                    <div className="space-y-2">
                        {["nationality", "age", "sanctioned"].map((key) => (
                            <div key={key}>
                                <input
                                    type="checkbox"
                                    checked={form.disclosures[key as keyof typeof form.disclosures]}
                                    onChange={() => handleDisclosureChange(key)}
                                    className="mr-2"
                                />
                                <label>
                                    {key === "nationality" && "🌍 Nationality"}
                                    {key === "age" && "🎂 Age"}
                                    {key === "sanctioned" && "⚠️ Sanctioned"}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {selfApp && typeof window !== "undefined" && (
                    <div className="mt-4">
                        <ClientQRWrapper selfApp={selfApp} onSuccess={handleVerificationSuccess} />
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => alert("Please complete verification via QR code.")}
                    className="w-full bg-blue-900 text-white py-3 mt-2 border-4 border-black rounded-none shadow-[4px_4px_0px_black] hover:bg-blue-800"
                >
                    🚀 SUBMIT VERIFICATION
                </button>
            </form>
        </div>
    );
}
