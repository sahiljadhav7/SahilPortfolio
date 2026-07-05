"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dithering } from "@paper-design/shaders-react";
export default function ResumePage() {
    return (_jsxs("div", { className: "relative min-h-screen overflow-hidden flex", children: [_jsxs("div", { className: "w-1/2 p-10 font-mono relative z-10 flex flex-col bg-black text-white", children: [_jsxs("div", { className: "mb-12 flex-1", children: [_jsxs("div", { className: "mb-10", children: [_jsx("h2", { className: "text-3xl font-bold tracking-tight", children: "SAHIL JADHAV" }), _jsx("h3", { className: "text-xl font-normal opacity-60 mt-1", children: "SOFTWARE ENGINEER" })] }), _jsx("p", { className: "text-sm leading-relaxed mb-10 max-w-sm opacity-70 text-gray-300", children: "Software Engineer with hands-on experience at JIO and CONCERTO. B.E. in EXTC @ LTCE (2022\u20132026). Published ML researcher. Building full-stack apps with React, Next.js and Node.js." }), _jsxs("div", { className: "mb-10 space-y-2", children: [_jsx("p", { className: "text-xs opacity-40 uppercase tracking-widest mb-3", children: "Selected Projects" }), [
                                        {
                                            name: "ForgeAI",
                                            type: "AI App Builder",
                                            year: "2026",
                                        },
                                        {
                                            name: "Webscraper",
                                            type: "News Intelligence Platform",
                                            year: "2026",
                                        },
                                        { name: "RupeeDash", type: "Finance Dashboard", year: "2026" },
                                        { name: "SecondBrain", type: "Knowledge Manager", year: "2026" },
                                    ].map((p) => (_jsxs("div", { className: "flex items-center gap-4 text-sm", children: [_jsx("span", { className: "w-36 font-medium truncate", children: p.name }), _jsx("span", { className: "flex-1 opacity-50 text-xs", children: p.type }), _jsx("span", { className: "opacity-30 text-xs", children: p.year })] }, p.name)))] }), _jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-xs opacity-40 uppercase tracking-widest mb-3", children: "Experience" }), [
                                        {
                                            company: "JIO",
                                            role: "SDE Intern",
                                            period: "Dec 2025 → Feb 2026",
                                        },
                                        {
                                            company: "CONCERTO",
                                            role: "Frontend Intern",
                                            period: "Jan 2024 → Feb 2024",
                                        },
                                    ].map((e) => (_jsxs("div", { className: "flex text-sm gap-4", children: [_jsx("span", { className: "w-28 font-medium", children: e.company }), _jsx("span", { className: "flex-1 opacity-50 text-xs", children: e.role }), _jsx("span", { className: "opacity-30 text-xs", children: e.period })] }, e.company)))] })] }), _jsx("div", { className: "mt-auto", children: _jsxs("div", { className: "flex gap-5 text-sm font-mono opacity-50", children: [_jsx("a", { href: "https://github.com/sahiljadhav7", target: "_blank", rel: "noopener", className: "hover:opacity-100 transition-opacity", children: "GitHub" }), _jsx("a", { href: "mailto:jadhavsahilcodes@gmail.com", className: "hover:opacity-100 transition-opacity", children: "Email" }), _jsx("a", { href: "https://www.linkedin.com/in/sahil-jadhav1/", target: "_blank", rel: "noopener", className: "hover:opacity-100 transition-opacity", children: "LinkedIn" })] }) })] }), _jsx("div", { className: "w-1/2 relative", children: _jsx(Dithering, { style: { height: "100%", width: "100%" }, colorBack: "hsl(0, 0%, 0%)", colorFront: "hsl(260, 80%, 65%)", shape: "wave", type: "4x4", pxSize: 3, offsetX: 0, offsetY: 0, scale: 0.8, rotation: 0, speed: 0.1 }) })] }));
}
