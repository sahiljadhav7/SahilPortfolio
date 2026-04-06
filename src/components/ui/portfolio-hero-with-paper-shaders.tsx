"use client";

import { Dithering } from "@paper-design/shaders-react";

export default function ResumePage() {
  return (
    <div className="relative min-h-screen overflow-hidden flex">
      {/* Left Panel — Portfolio Info */}
      <div className="w-1/2 p-10 font-mono relative z-10 flex flex-col bg-black text-white">
        {/* Header */}
        <div className="mb-12 flex-1">
          <div className="mb-10">
            <h2 className="text-3xl font-bold tracking-tight">SAHIL JADHAV</h2>
            <h3 className="text-xl font-normal opacity-60 mt-1">
              SOFTWARE ENGINEER
            </h3>
          </div>

          {/* About snippet */}
          <p className="text-sm leading-relaxed mb-10 max-w-sm opacity-70 text-gray-300">
            Software Engineer with hands-on experience at JIO and CONCERTO. B.E.
            in EXTC @ LTCE (2022–2026). Published ML researcher. Building
            full-stack apps with React, Next.js and Node.js.
          </p>

          {/* Projects / Experience */}
          <div className="mb-10 space-y-2">
            <p className="text-xs opacity-40 uppercase tracking-widest mb-3">
              Selected Projects
            </p>
            {[
              {
                name: "Webscraper",
                type: "News Intelligence Platform",
                year: "2026",
              },
              { name: "RupeeDash", type: "Finance Dashboard", year: "2026" },
              { name: "QRGenerator", type: "React + Canvas App", year: "2025" },

              { name: "LeadPilot", type: "AI Lead Gen Tool", year: "2026" },
              { name: "SecondBrain", type: "Knowledge Manager", year: "2026" },
            ].map((p) => (
              <div key={p.name} className="flex items-center gap-4 text-sm">
                <span className="w-36 font-medium truncate">{p.name}</span>
                <span className="flex-1 opacity-50 text-xs">{p.type}</span>
                <span className="opacity-30 text-xs">{p.year}</span>
              </div>
            ))}
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <p className="text-xs opacity-40 uppercase tracking-widest mb-3">
              Experience
            </p>
            {[
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
            ].map((e) => (
              <div key={e.company} className="flex text-sm gap-4">
                <span className="w-28 font-medium">{e.company}</span>
                <span className="flex-1 opacity-50 text-xs">{e.role}</span>
                <span className="opacity-30 text-xs">{e.period}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-auto">
          <div className="flex gap-5 text-sm font-mono opacity-50">
            <a
              href="https://github.com/sahiljadhav7"
              target="_blank"
              rel="noopener"
              className="hover:opacity-100 transition-opacity"
            >
              GitHub
            </a>
            <a
              href="mailto:jadhavsahilcodes@gmail.com"
              className="hover:opacity-100 transition-opacity"
            >
              Email
            </a>
            <a
              href="https://www.linkedin.com/in/sahil-jadhav1/"
              target="_blank"
              rel="noopener"
              className="hover:opacity-100 transition-opacity"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* Right Panel — Paper Shader Animation */}
      <div className="w-1/2 relative">
        <Dithering
          style={{ height: "100%", width: "100%" }}
          colorBack="hsl(0, 0%, 0%)"
          colorFront="hsl(260, 80%, 65%)"
          shape="wave"
          type="4x4"
          pxSize={3}
          offsetX={0}
          offsetY={0}
          scale={0.8}
          rotation={0}
          speed={0.1}
        />
      </div>
    </div>
  );
}
