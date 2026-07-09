import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Users,
  Target,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Search,
  ClipboardList,
  Palette,
  Code2,
  Rocket,
  PackageCheck,
  Trophy,
  MapPin,
  Star,
} from 'lucide-react';

import SectionHeading from '@/components/common/SectionHeading';
import StatsStrip from '@/components/sections/StatsStrip';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import TeamSection from '@/components/sections/TeamSection';
import FaqsSection from '@/components/sections/FaqsSection';
import CtaBanner from '@/components/sections/CtaBanner';
import { ABOUT_TEAM_IMAGE, ABOUT_HERO_IMAGE } from '@/data/placeholders';

const fade = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: 'easeOut' },
  }),
};

const PILLARS = [
  {
    icon: Users,
    title: 'Who Are We',
    body:
      'DigiSwarm is a digital marketing agency that offers a broad range of services to clients across a variety of industries — from local startups to growing brands. We bring strategy, creativity, and execution together under one roof.',
  },
  {
    icon: Target,
    title: 'Our Mission',
    body:
      'Many marketing organizations claim a customer-centric emphasis, but only a handful truly deliver it. DigiSwarm is built around outcomes that matter to your business — leads, sales, and a brand customers love.',
  },
  {
    icon: Briefcase,
    title: 'What We Do',
    items: [
      'SEO',
      'Website Development',
      'Social Media Marketing',
      'Pay Per Click (PPC)',
      'Content & Graphic Design',
      'WhatsApp Marketing',
    ],
  },
];

const PROCESS_6D = [
  {
    step: '01',
    title: 'Discover',
    icon: Search,
    body:
      'Our journey begins with a deep dive into understanding your business and targeted audience. We make insights that will shape your digital strategy.',
  },
  {
    step: '02',
    title: 'Define',
    icon: ClipboardList,
    body:
      'We work closely with you to establish clear, measurable objectives. Based on the defined goals, we create a customized digital marketing strategy.',
  },
  {
    step: '03',
    title: 'Design',
    icon: Palette,
    body:
      'We focus on designing or optimizing your website to provide a seamless user experience. Content is king in digital marketing, and we have expertise in creating high-quality, relevant content.',
  },
  {
    step: '04',
    title: 'Develop',
    icon: Code2,
    body:
      'With strategies in place, we put our plans into action. Our team of professionals develops and executes the marketing campaigns, websites, content, and ads that will drive your success.',
  },
  {
    step: '05',
    title: 'Deploy',
    icon: Rocket,
    body:
      'We launch your campaigns across various digital channels. For you, this is when things start to get real. We will set up a live version of your solution so you can see how it works.',
  },
  {
    step: '06',
    title: 'Deliver',
    icon: PackageCheck,
    body:
      'The final "D" is all about delivering results and optimizing for ongoing success. We will deliver you the keys once we are confident that you are pleased with your new solution.',
  },
];

export default function About() {
  return (
    <>
      <Helmet>
        <title>About DigiSwarm — Your Trusted Digital Partner in Uttarakhand</title>
        <meta
          name="description"
          content="DigiSwarm is a leading digital marketing agency in Uttarakhand. Discover our mission, our 6-D process, and the people behind the brand."
        />
      </Helmet>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50/70 via-white to-white" />
        <div
          aria-hidden
          className="absolute -top-32 left-1/2 -z-10 h-[460px] w-[680px] -translate-x-1/2 rounded-full bg-brand-300/20 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.14] [background-image:radial-gradient(rgba(31,68,245,0.4)_1px,transparent_1px)] [background-size:22px_22px]"
        />

        <div className="container-x pt-8 pb-8 md:pt-10 md:pb-12">
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Text — 7 cols on desktop, more room for content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fade}
              className="text-center lg:col-span-7 lg:text-left"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-700 shadow-soft backdrop-blur">
                <Sparkles size={13} /> About us
              </span>
              <motion.h1
                variants={fade}
                custom={1}
                className="mt-4 text-3xl font-extrabold leading-[1.05] tracking-tight text-ink-900 sm:text-4xl md:text-5xl lg:text-[2.75rem] xl:text-[3.25rem]"
              >
                Welcome to{' '}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-500 bg-clip-text text-transparent">
                    DigiSwarm
                  </span>
                  <svg
                    aria-hidden
                    viewBox="0 0 200 14"
                    preserveAspectRatio="none"
                    className="absolute -bottom-1 left-0 h-2 w-full text-brand-300/70"
                  >
                    <path
                      d="M2 8 Q 50 0 100 8 T 198 8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </motion.h1>
              <motion.p
                variants={fade}
                custom={2}
                className="mx-auto mt-4 max-w-xl text-sm font-semibold text-ink-700 sm:text-base lg:mx-0"
              >
                Your Trusted Partner for Digital Excellence in Uttarakhand
              </motion.p>
              <motion.p
                variants={fade}
                custom={3}
                className="mx-auto mt-3 max-w-xl text-[14px] leading-relaxed text-ink-600 sm:text-[15px] lg:mx-0"
              >
                We are more than a digital marketing agency — we are your strategic ally for
                navigating the digital landscape with a passion for innovation and measurable
                results.
              </motion.p>

              {/* Inline stat strip — 3 cells */}
              <motion.div
                variants={fade}
                custom={4}
                className="mx-auto mt-5 grid max-w-md grid-cols-3 gap-2 lg:mx-0 lg:max-w-md"
              >
                <AboutStat value="60+" label="Happy clients" />
                <AboutStat value="200+" label="Projects" />
                <AboutStat value="12" label="Specialists" />
              </motion.div>

              {/* CTAs */}
              <motion.div
                variants={fade}
                custom={5}
                className="mt-5 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
              >
                <Link to="/services" className="btn-primary group">
                  Explore services
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
                <Link to="/contact" className="btn-outline">
                  Talk to our team
                </Link>
              </motion.div>
            </motion.div>

            {/* Image — 5 cols on lg, compact size, landscape aspect on desktop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5"
            >
              <div className="relative mx-auto w-full max-w-[380px] sm:max-w-[440px] md:max-w-[520px] lg:max-w-none">
                {/* Glow halo */}
                <div className="absolute -inset-5 -z-10 rounded-[2.5rem] bg-gradient-to-br from-brand-300/45 via-indigo-300/30 to-fuchsia-300/25 blur-3xl" />
                {/* Stacked back frame */}
                <div
                  aria-hidden
                  className="absolute inset-0 -z-10 translate-x-2.5 translate-y-2.5 rounded-3xl bg-gradient-to-br from-brand-600 to-indigo-600 opacity-90"
                />

                <div className="relative w-full overflow-hidden rounded-3xl border border-white/40 bg-white/70 p-1.5 shadow-card backdrop-blur-md">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-50 to-white">
                    <img
                      src={ABOUT_HERO_IMAGE}
                      alt="Welcome to DigiSwarm — your digital partner in Uttarakhand"
                      className="block aspect-[4/5] w-full object-cover sm:aspect-[5/4]"
                      loading="eager"
                      fetchpriority="high"
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-brand-600/5 via-transparent to-white/10"
                    />
                  </div>
                </div>

                {/* Floating "Based in" — top-left */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: -8 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.45 }}
                  className="absolute left-[-5%] top-[6%] z-10 hidden sm:block"
                >
                  <div className="flex items-center gap-2 rounded-xl border border-ink-100 bg-white/95 px-3 py-2 shadow-card backdrop-blur">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
                      <MapPin size={14} />
                    </span>
                    <div className="leading-tight">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-ink-500">
                        Based in
                      </p>
                      <p className="text-xs font-extrabold text-ink-900">Dehradun, UK</p>
                    </div>
                  </div>
                </motion.div>

                {/* Floating "4.9" — bottom-right */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: 8 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: 0.75, duration: 0.45 }}
                  className="absolute bottom-[6%] right-[-5%] z-10 hidden sm:block"
                >
                  <div className="flex items-center gap-2 rounded-xl border border-ink-100 bg-white/95 px-3 py-2 shadow-card backdrop-blur">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-50 text-amber-700">
                      <Star size={14} className="fill-amber-500 text-amber-500" />
                    </span>
                    <div className="leading-tight">
                      <p className="text-sm font-extrabold text-ink-900">4.9 / 5</p>
                      <p className="text-[9px] font-medium text-ink-500">from 40+ clients</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* THREE PILLARS — Who / Mission / What */}
      <section className="section pt-4">
        <div className="container-x">
          <div className="grid gap-6 md:grid-cols-3">
            {PILLARS.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fade}
                  custom={i}
                  className="card group relative overflow-hidden p-7 transition hover:-translate-y-1 hover:shadow-card"
                >
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-50 opacity-0 transition group-hover:opacity-100" />
                  <div className="relative">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-700">
                      <Icon size={22} />
                    </div>
                    <div className="mt-5 flex items-center gap-2">
                      <span className="h-1 w-8 rounded-full bg-brand-600" />
                      <h3 className="text-xl font-extrabold text-ink-900">{p.title}</h3>
                    </div>
                    {p.body && (
                      <p className="mt-3 text-sm leading-relaxed text-ink-600">{p.body}</p>
                    )}
                    {p.items && (
                      <ul className="mt-4 space-y-2.5">
                        {p.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2 text-sm text-ink-700"
                          >
                            <CheckCircle2
                              size={16}
                              className="mt-0.5 shrink-0 text-brand-600"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* OUR COMPANY — long-form story */}
      <section className="section bg-ink-50/60">
        <div className="container-x">
          <div className="grid items-start gap-12 lg:grid-cols-12">
            {/* Visual side */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5"
            >
              <div className="relative mx-auto w-full max-w-[420px] sm:max-w-[480px] md:max-w-[540px] lg:max-w-none">
                <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-brand-300/50 via-indigo-200/40 to-transparent blur-2xl" />
                {/* Decorative stacked frame */}
                <div
                  aria-hidden
                  className="absolute inset-0 -z-10 translate-x-4 translate-y-4 rounded-3xl bg-gradient-to-br from-brand-600 to-indigo-600 opacity-90"
                />
                <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/70 p-2 shadow-card backdrop-blur-md">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl sm:aspect-[5/6] md:aspect-[5/6]">
                    <img
                      src={ABOUT_TEAM_IMAGE}
                      alt="The DigiSwarm team — designers, developers, marketers, and strategists"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    {/* Bottom dark fade */}
                    <div
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink-900/85 via-ink-900/40 to-transparent"
                    />
                    {/* Overlay content */}
                    <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                      <div className="flex items-center gap-2">
                        <Trophy size={20} className="text-amber-300" />
                        <p className="text-xs font-bold uppercase tracking-widest text-white/90">
                          Award-winning team
                        </p>
                      </div>
                      <p className="mt-3 text-xl font-extrabold leading-tight sm:text-2xl">
                        The best digital marketing company in Uttarakhand.
                      </p>
                      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/20 pt-4">
                        <div>
                          <p className="text-2xl font-extrabold">200+</p>
                          <p className="text-[11px] text-white/75">Projects delivered</p>
                        </div>
                        <div>
                          <p className="text-2xl font-extrabold">5★</p>
                          <p className="text-[11px] text-white/75">Average rating</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Text side */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-7"
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-700">
                Our Company
              </span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
                Why we are the best digital marketing company in Uttarakhand
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-600">
                <p>
                  DigiSwarm is a leading digital marketing agency that helps businesses achieve
                  their full potential online. Our journey began with a simple yet powerful
                  vision — to empower businesses in Uttarakhand with the digital tools and
                  strategies they need to succeed in the digital age. Since then, we&apos;ve come
                  a long way, helping numerous businesses thrive digitally through our expertise
                  and dedication.
                </p>
                <p>
                  Our team of experienced professionals is well-versed in the latest digital
                  marketing trends and techniques, including SEO, PPC, social media marketing,
                  and content marketing.
                </p>
                <p>
                  At DigiSwarm, we are at the heart of everything we do. We take the time to
                  understand your business, goals, and challenges and work collaboratively to
                  devise strategies that deliver real, measurable results. Our results-driven
                  approach has helped many businesses increase their online visibility and drive
                  more traffic to their websites.
                </p>
                <p>
                  We are proud to have a proven track record of success and are committed to
                  delivering results for our clients. We are passionate about helping businesses
                  succeed online and take great pride in the success of our clients.
                </p>
                <p className="font-medium text-ink-800">
                  Join us on this digital journey and experience the difference of working with
                  the best digital marketing agency in Uttarakhand. Let&apos;s grow your brand,
                  drive conversions, and achieve digital excellence together.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/services" className="btn-primary">
                  Explore our services <ArrowRight size={16} />
                </Link>
                <Link to="/contact" className="btn-outline">
                  Talk to our team
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6-D PROCESS */}
      <section className="section">
        <div className="container-x">
          <SectionHeading
            eyebrow="How we work"
            title="Our 6-D Process"
            subtitle="A repeatable framework that takes you from a blank slate to measurable digital results."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PROCESS_6D.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.step}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.25 }}
                  variants={fade}
                  custom={i}
                  className="group relative rounded-2xl border border-ink-100 bg-white p-7 transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-card"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-4xl font-extrabold tracking-tight text-brand-100 transition group-hover:text-brand-200">
                      {p.step}.
                    </span>
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white">
                      <Icon size={18} />
                    </div>
                  </div>
                  <h3 className="mt-4 text-xl font-extrabold text-ink-900">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{p.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <StatsStrip />
      <TeamSection />
      <TestimonialsSection />
      <FaqsSection
        eyebrow="Questions"
        title="Things people often ask"
        subtitle="Can't find what you need? The contact page is right there."
      />

      <CtaBanner
        title="Want to work with us?"
        body="Whether you&apos;re hiring a partner or looking to join us, we&apos;d love to hear from you."
        primary={{ to: '/contact', label: 'Get in touch' }}
        secondary={{ to: '/career', label: 'See open roles' }}
      />

      <section className="section pt-0">
        <div className="container-x text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-all hover:gap-2.5"
          >
            Explore our services next <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </>
  );
}

function AboutStat({ value, label }) {
  return (
    <div className="rounded-xl border border-ink-100 bg-white/85 px-2.5 py-2 text-center shadow-soft backdrop-blur lg:text-left">
      <p className="text-lg font-extrabold leading-none text-ink-900 sm:text-xl">
        {value}
      </p>
      <p className="mt-1 text-[9px] font-medium uppercase tracking-widest text-ink-500">
        {label}
      </p>
    </div>
  );
}
