// src/app/careers/CareersClient.tsx
"use client";

import Link from "next/link";
import { ArrowLeft, Briefcase, Mail, Terminal, Coins, Globe, Heart, Shield, Cpu } from "lucide-react";
import { IsometricDevice } from "@/features/landing/components/IsometricDevice";

export function CareersClient() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-cloud border-b border-fog/20 relative overflow-hidden">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 items-center gap-8 px-4 py-16 sm:px-8 lg:px-12 sm:py-24">
          {/* Left side text */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate hover:text-graphite transition-colors mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Home
            </Link>

            <h1 className="font-display text-3xl font-bold tracking-tight text-graphite sm:text-4xl md:text-5xl animate-fade-in-up">
              Join M&amp;F Technologies
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate max-w-xl leading-relaxed animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              We design, build, and scale high-performance banking infrastructure, credit scoring frameworks, and secure transactional middleware that process billions in micro-lending disbursements worldwide.
            </p>
          </div>

          {/* Right side illustration */}
          <div className="relative flex justify-center lg:justify-end animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <div className="max-w-[280px] sm:max-w-[360px] md:max-w-md w-full">
              <IsometricDevice />
            </div>
          </div>
        </div>
      </section>

      {/* Main Careers Content */}
      <section className="w-full px-4 py-16 sm:px-8 lg:px-12 sm:py-24 space-y-20">
        
        {/* Culture & Operations */}
        <div className="space-y-6 max-w-4xl">
          <h2 className="font-display text-2xl font-bold text-graphite sm:text-3xl">
            Our Mission &amp; Engineering Culture
          </h2>
          <p className="text-sm sm:text-base text-slate leading-relaxed">
            At M&amp;F Technologies, we believe that access to credit is a fundamental pillar of economic growth and social mobility. By replacing slow, error-prone legacy underwriting pipelines with automated microservices and secure database systems, we help financial institutions serve millions of underbanked individuals across emerging markets.
          </p>
          <p className="text-sm sm:text-base text-slate leading-relaxed">
            We operate as a highly collaborative, remote-first team of system engineers, database architects, security experts, and financial product thinkers. We care deeply about clean code, performance testing (our API response latency SLAs are sub-200ms), automated test suites, and strict mathematical ledger validation. If you enjoy solving hard backend coordination challenges, optimizing PostgreSQL databases, and designing resilient API contracts, you will fit right in.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="border-t border-fog/20 pt-16 space-y-8">
          <h3 className="font-display text-xl font-bold text-graphite sm:text-2xl text-center">
            Why Build Your Career at M&amp;F?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-xl border border-fog/30 bg-cloud p-6 flex flex-col items-center text-center space-y-3">
              <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center text-graphite shadow-sm border border-fog/10">
                <Terminal className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-graphite text-sm sm:text-base">Modern Tech Stack</h4>
              <p className="text-xs text-slate leading-relaxed">
                We build with Next.js, Node.js, TypeScript, PostgreSQL, Docker, and Kubernetes. We run clean migrations, strict lint rules, and automated CI/CD pipelines.
              </p>
            </div>
            <div className="rounded-xl border border-fog/30 bg-cloud p-6 flex flex-col items-center text-center space-y-3">
              <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center text-graphite shadow-sm border border-fog/10">
                <Coins className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-graphite text-sm sm:text-base">Global Financial Impact</h4>
              <p className="text-xs text-slate leading-relaxed">
                Our code processes disbursements for real commercial banks and regional lending platforms. Your work directly affects the efficiency of small-business lending systems.
              </p>
            </div>
            <div className="rounded-xl border border-fog/30 bg-cloud p-6 flex flex-col items-center text-center space-y-3">
              <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center text-graphite shadow-sm border border-fog/10">
                <Globe className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-graphite text-sm sm:text-base font-semibold">Remote-First Flexibility</h4>
              <p className="text-xs text-slate leading-relaxed">
                Work from anywhere in the world. We focus on engineering output, documentation completeness, and communication quality over rigid office hours.
              </p>
            </div>
          </div>
        </div>

        {/* Active Openings */}
        <div className="border-t border-fog/20 pt-16 space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-xs font-semibold mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              We're Hiring
            </div>
            <h3 className="font-display text-xl font-bold text-graphite sm:text-2xl">
              Active Job Openings
            </h3>
            <p className="text-sm text-slate mt-2 max-w-2xl leading-relaxed">
              We are expanding our engineering team. Explore our active openings and apply below.
            </p>
          </div>

          <div className="border border-fog/30 rounded-xl bg-cloud overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-graphite" />
                    <h4 className="font-bold text-graphite text-lg sm:text-xl">Junior Python Developer</h4>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#1B222C]/5 text-graphite">Remote</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#1B222C]/5 text-graphite">Full-Time</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#1B222C]/5 text-graphite">Engineering</span>
                  </div>
                </div>
                <a
                  href="mailto:info@mftechnologies.org?subject=Application%20for%20Junior%20Python%20Developer%20Role"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1B222C] hover:bg-[#3E4C59] px-5 py-2.5 text-xs font-semibold text-white transition-colors shadow-sm"
                >
                  <Mail className="h-4 w-4 text-white" />
                  Apply Now
                </a>
              </div>

              <div className="border-t border-fog/20 pt-6 space-y-8">
                {/* Detailed Description */}
                <div className="space-y-4">
                  <h5 className="font-bold text-graphite text-sm sm:text-base">Role Overview</h5>
                  <p className="text-xs sm:text-sm text-slate leading-relaxed">
                    We are seeking a junior, detail-oriented Python Developer to help build and maintain custom plugins, third-party integrations, and secure data processing pipelines for our institutional-grade lending platforms. In this role, you will assist in designing, developing, and implementing robust data models, index structures, and storage strategies. 
                  </p>
                  <p className="text-xs sm:text-sm text-slate leading-relaxed">
                    You will work on ingestion and indexing processes, transforming and normalizing transaction logs and credit scoring data using tools like Elasticsearch, and integrating services with REST and SOAP APIs across multiple banking applications. This is a 100% remote position offering hands-on mentorship from senior backend and infrastructure security engineers.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Responsibilities */}
                  <div className="space-y-4">
                    <h5 className="font-bold text-graphite text-sm sm:text-base">Key Responsibilities</h5>
                    <ul className="list-disc pl-4 space-y-2 text-xs sm:text-sm text-slate leading-relaxed">
                      <li>Design, write, and maintain custom Python scripts and backend plugins to integrate third-party APIs and fintech data providers.</li>
                      <li>Develop and implement data models, indexes, and storage schemas for high-performance transaction logging and audit trails.</li>
                      <li>Build ingestion pipelines that transform, normalize, and enrich transaction log streams and financial event records.</li>
                      <li>Create and optimize queries against databases to extract analytics and support real-time credit scoring runs.</li>
                      <li>Participate in system design reviews, code reviews, and automate tests using CI/CD pipelines.</li>
                    </ul>
                  </div>

                  {/* Requirements & Skills */}
                  <div className="space-y-4">
                    <h5 className="font-bold text-graphite text-sm sm:text-base">Education & Core Requirements</h5>
                    <ul className="list-disc pl-4 space-y-2 text-xs sm:text-sm text-slate leading-relaxed">
                      <li><strong>Education:</strong> Degree in Computer Science, Software Engineering, or any IT/STEM related field.</li>
                      <li><strong>Application Documents:</strong> Submission of an Application Letter (Cover Letter) and a detailed CV.</li>
                      <li>Solid understanding of Python programming (either through professional experience or significant academic/personal projects).</li>
                      <li>Experience using or building REST and/or SOAP APIs to query and update data.</li>
                      <li>Familiarity with Git version control, branch workflows, and basic CI/CD concepts.</li>
                      <li>Strong logical thinking, problem-solving, and written communication skills.</li>
                    </ul>
                  </div>
                </div>

                {/* Nice to haves */}
                <div className="border-t border-fog/20 pt-6 space-y-4">
                  <h5 className="font-bold text-graphite text-sm sm:text-base">Nice to Have (Bonus Skills)</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs sm:text-sm text-slate leading-relaxed">
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Experience with Elasticsearch, Logstash, Kibana (ELK stack), or log aggregation systems.</li>
                      <li>Database modeling experience (relational like PostgreSQL, or non-relational like MongoDB).</li>
                      <li>Familiarity with container services like Docker and Kubernetes.</li>
                    </ul>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Basic cloud infrastructure experience (especially AWS or Azure).</li>
                      <li>Exposure to configuration management tools (Ansible, Terraform).</li>
                      <li>Basic Linux administration and bash scripting knowledge.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-t border-fog/20 pt-6 space-y-4 bg-white/50 -mx-6 -mb-6 p-6 sm:-mx-8 sm:-mb-8 sm:p-8">
                <h5 className="font-bold text-graphite text-sm sm:text-base">How to Apply</h5>
                <p className="text-xs sm:text-sm text-slate leading-relaxed">
                  Interested candidates who meet the requirements should submit the following application documents:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="flex items-start gap-3 rounded-lg border border-fog/20 p-4 bg-white">
                    <div className="p-2 rounded bg-cloud text-graphite">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <div>
                      <h6 className="font-bold text-graphite text-xs">1. Curriculum Vitae (CV)</h6>
                      <p className="text-[11px] text-slate mt-0.5">Updated resume highlighting your skills, education, and any projects you have worked on.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg border border-fog/20 p-4 bg-white">
                    <div className="p-2 rounded bg-cloud text-graphite">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <h6 className="font-bold text-graphite text-xs">2. Application Letter</h6>
                      <p className="text-[11px] text-slate mt-0.5">A cover letter explaining your suitability and interest in joining M&amp;F Technologies.</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate pt-2 leading-relaxed">
                  Please send both documents to <a href="mailto:info@mftechnologies.org?subject=Application%20for%20Junior%20Python%20Developer%20Role" className="font-semibold text-graphite hover:underline">info@mftechnologies.org</a> with the subject line <strong>"Application: Junior Python Developer"</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Future Opportunities & Core Disciplines */}
        <div className="border-t border-fog/20 pt-16 space-y-8">
          <div>
            <h3 className="font-display text-xl font-bold text-graphite sm:text-2xl">
              Future Opportunities &amp; Core Disciplines
            </h3>
            <p className="text-sm text-slate mt-2 max-w-2xl leading-relaxed">
              In addition to our active hiring, we are always on the lookout for talented team members in the following areas:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-[#9AA5B1]/20 rounded-xl p-6 bg-[#F8FAFC] space-y-3">
              <div className="flex items-center gap-2">
                <Cpu className="h-4.5 w-4.5 text-[#3E4C59]" />
                <h4 className="font-bold text-graphite text-sm sm:text-base">Backend &amp; Ledger Systems Engineer</h4>
              </div>
              <p className="text-xs text-slate leading-relaxed">
                Responsible for maintaining the double-entry accounting engine, scaling database replication, securing microservice middleware, and optimizing transaction consistency models. Proficient in Node.js, SQL, and distributed system architectures.
              </p>
            </div>

            <div className="border border-[#9AA5B1]/20 rounded-xl p-6 bg-[#F8FAFC] space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4.5 w-4.5 text-[#3E4C59]" />
                <h4 className="font-bold text-graphite text-sm sm:text-base">Infrastructure Security Specialist</h4>
              </div>
              <p className="text-xs text-slate leading-relaxed">
                Coordinates our SOC 2 auditing pipelines, vulnerability tracking, key rotation routines, network isolation rules, and hardware MFA setups. Strong understanding of AWS/GCP IAM, VPC firewalls, and cryptographic practices.
              </p>
            </div>
          </div>
        </div>

        {/* General Application & Future Roles */}
        <div className="border-t border-fog/20 pt-16 flex flex-col items-center text-center space-y-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cloud border border-fog/20">
            <Heart className="h-6 w-6 text-slate" />
          </div>

          <div className="space-y-2">
            <h3 className="font-display text-xl font-bold text-graphite sm:text-2xl">
              Don't See the Right Fit?
            </h3>
            <p className="max-w-md text-xs sm:text-sm text-slate leading-relaxed">
              If you are an exceptional engineer passionate about lending technology but don't see an open role that matches your profile, you can still submit a general application.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-2">
            <a
              href="mailto:info@mftechnologies.org?subject=General%20Application%20for%20Future%20Roles"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1B222C] hover:bg-[#3E4C59] px-6 py-3 text-xs font-semibold text-white transition-colors w-full sm:w-auto shadow-sm"
            >
              <Mail className="h-4 w-4 text-white" />
              Submit General Resume
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg border border-fog/40 bg-white px-6 py-3 text-xs font-semibold text-graphite hover:bg-cloud transition-colors w-full sm:w-auto"
            >
              Return to Homepage
            </Link>
          </div>
        </div>

      </section>
    </main>
  );
}
