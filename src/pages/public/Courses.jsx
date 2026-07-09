import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  BookOpen,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Award,
  Sparkles,
  Briefcase,
  Target,
  Grid,
} from 'lucide-react';

const coursesData = {
  '3month': {
    id: '3month',
    title: '3-Month Digital Marketing Foundations',
    subtitle: 'Kickstart your digital marketing journey with foundational skills and hands-on practices.',
    duration: '3 Months (12 Weeks)',
    commitment: '6 hours/week',
    level: 'Beginner to Intermediate',
    format: 'Live Online + Practical Workshops',
    description: 'Learn the core building blocks of digital marketing. This program is designed for students, freelancers, and entrepreneurs looking to establish a solid digital presence and master organic growth channels.',
    highlights: [
      '10+ live hands-on projects',
      'Real-world agency case studies',
      'Preparation for Google & HubSpot Certifications',
      'Resume optimization & mock interview prep',
      'SEO audit and content production masterclass',
    ],
    curriculum: [
      {
        title: 'Module 1: Digital Ecosystem & SEO Foundations',
        details: 'Understanding the digital landscape, search engine algorithms, keyword research, on-page optimization, and setting up Google Search Console and Analytics.',
        image: '/Images/modules/3month-m1.jpg',
      },
      {
        title: 'Module 2: Social Media Organic Growth & SMM',
        details: 'Creating content strategies for Instagram, LinkedIn, and Facebook, profile optimization, visual designing basics with Canva, and community building techniques.',
        image: '/Images/modules/3month-m2.jpg',
      },
      {
        title: 'Module 3: Paid Advertising Basics (Meta & Google)',
        details: 'Introduction to paid funnels, setting up Facebook Ads Manager, building search campaigns on Google Ads, and understanding key metrics (CTR, CPC, Conversions).',
        image: '/Images/modules/3month-m3.jpg',
      },
      {
        title: 'Module 4: Email & Content Marketing Campaigns',
        details: 'Writing high-converting copy, creating newsletter sequences using Mailchimp, automation basics, and setting up landing pages that capture quality leads.',
        image: '/Images/modules/3month-m4.jpg',
      },
    ],
    ctaSubject: 'Enquiry for 3-Month Digital Marketing Foundations Course',
    ctaMessage: 'Hi DigiSwarm, I am interested in enrolling in the 3-Month Digital Marketing Foundations Course. Please provide details on next batch start dates, fees, and syllabus.',
  },
  '6month': {
    id: '6month',
    title: '6-Month Advanced Digital Marketing & Strategy',
    subtitle: 'The ultimate professional bootcamp with a guaranteed 2-month agency internship.',
    duration: '6 Months (24 Weeks)',
    commitment: '6 hours/week',
    level: 'Intermediate to Advanced',
    format: 'Hybrid (Online + Live Client Meetings)',
    description: 'A comprehensive, strategy-focused program built to transform you into a complete T-shaped marketer. Includes a 2-month internship working directly with DigiSwarm’s client service teams.',
    highlights: [
      'Guaranteed 2-Month Live Agency Internship',
      'Work on actual marketing budgets & active clients',
      '20+ industry recognized certifications',
      '1-on-1 mentorship from seasoned marketing leads',
      '100% placement assistance & hiring network access',
    ],
    curriculum: [
      {
        title: 'Module 1: Branding Psychology & Strategy Design',
        details: 'Consumer behaviour analysis, competitive landscape analysis, marketing funnel design, positioning, and constructing multi-channel growth strategies.',
        image: '/Images/modules/6month-m1.jpg',
      },
      {
        title: 'Module 2: Advanced SEO & Technical Audits',
        details: 'Technical SEO checklist, Core Web Vitals, programmatic SEO, schema markup, building backlink plans, and managing enterprise site rankings.',
        image: '/Images/modules/6month-m2.jpg',
      },
      {
        title: 'Module 3: Paid Ads (Google, Meta, LinkedIn, YouTube)',
        details: 'Advanced audience targeting, catalog ads, retargeting funnels, custom conversions, lead generation campaigns, and running professional advertising dashboard audits.',
        image: '/Images/modules/6month-m3.jpg',
      },
      {
        title: 'Module 4: Growth Hacking & Marketing Automation',
        details: 'Webhooks, Zapier integrations, CRM management (HubSpot, Salesforce), automation flows, interactive chatbot triggers, and data analysis pipelines.',
        image: '/Images/modules/6month-m4.jpg',
      },
      {
        title: 'Module 5: 2-Month Live Client Internship',
        details: 'Assigned directly to active agency teams at DigiSwarm. Assist in campaign creation, daily optimizations, and weekly reporting meetings for real clients.',
        image: '/Images/modules/6month-m5.jpg',
      },
      {
        title: 'Module 6: Capstone Project & Career Placement',
        details: 'Develop and present an end-to-end growth strategy for an assigned brand. Build your professional portfolio, prepare for technical rounds, and interview with partner companies.',
        image: '/Images/modules/6month-m6.jpg',
      },
    ],
    ctaSubject: 'Enquiry for 6-Month Advanced Digital Marketing Course',
    ctaMessage: 'Hi DigiSwarm, I am interested in enrolling in the 6-Month Advanced Digital Marketing & Strategy Program. Please share details regarding fees, internship structure, and batch schedule.',
  },
  'perfMarketing': {
    id: 'perfMarketing',
    title: 'Performance Marketing Specialist Masterclass',
    subtitle: 'An intensive, advanced masterclass focused purely on paid advertising and ROI scaling.',
    duration: '4 Months (16 Weeks)',
    commitment: '6 hours/week',
    level: 'Advanced / Career Accelerator',
    format: 'Live Campaigns + Interactive Mentorship',
    description: 'Designed specifically for marketing professionals, business owners, and graduates who want to specialize exclusively in paid ads, media buying, data attribution, and scaling budgets profitably.',
    highlights: [
      'Manage live ad budgets during the course',
      'Deep-dive into Conversion Rate Optimization (CRO)',
      'Advanced tracking: GTM, GA4, Server-side tracking, APIs',
      'Exclusively taught by Performance Marketing directors',
      'Case study presentation to industry hiring managers',
    ],
    curriculum: [
      {
        title: 'Module 1: Media Buying & Funnel Architecture',
        details: 'Constructing high-impact acquisition, retargeting, and retention funnels. Setting up the measurement infrastructure and learning data-driven decision making.',
        image: '/Images/modules/perf-m1.jpg',
      },
      {
        title: 'Module 2: Meta Ads (Facebook & Instagram) Scaling',
        details: 'Pixel setup, Conversions API, advanced custom and lookalike audiences, catalog sales, dynamic creatives, bidding models, and scaling budgets without fatigue.',
        image: '/Images/modules/perf-m2.jpg',
      },
      {
        title: 'Module 3: Google Ads (Search, Display, Shopping, PMax)',
        details: 'Keyword match types, quality score optimization, smart bidding, Performance Max campaign management, and YouTube video ad placement strategies.',
        image: '/Images/modules/perf-m3.jpg',
      },
      {
        title: 'Module 4: Analytics & Multi-Touch Attribution',
        details: 'Setting up Google Analytics 4 (GA4) and Google Tag Manager (GTM), custom event tracking, UTM parameters, Looker Studio dashboards, and understanding attribution models.',
        image: '/Images/modules/perf-m4.jpg',
      },
      {
        title: 'Module 5: Landing Page CRO & Ad Copy Psychology',
        details: 'A/B testing, heatmaps (Hotjar), psychological triggers in copywriting, hooks, offer creation, and reducing friction points to double landing page conversions.',
        image: '/Images/modules/perf-m5.jpg',
      },
    ],
    ctaSubject: 'Enquiry for Performance Marketing Specialist Masterclass',
    ctaMessage: 'Hi DigiSwarm, I am interested in enrolling in the Performance Marketing Specialist Masterclass. Please send more details on enrollment criteria, budget allocation during class, and pricing.',
  },
};

function AccordionItem({ title, details, isOpen, onToggle }) {
  return (
    <div className="border-b border-ink-100 last:border-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-4 text-left font-bold text-ink-900 transition hover:text-brand-600"
      >
        <span className="text-base sm:text-lg">{title}</span>
        {isOpen ? (
          <ChevronUp size={20} className="shrink-0 text-brand-600" />
        ) : (
          <ChevronDown size={20} className="shrink-0 text-ink-400" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm leading-relaxed text-ink-600">{details}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Courses() {
  const [activeTab, setActiveTab] = useState('modules');
  const [expandedModule, setExpandedModule] = useState(0);

  const selectedCourse = coursesData[activeTab];

  const allModules = Object.entries(coursesData).flatMap(([courseKey, course]) =>
    course.curriculum.map((mod, index) => ({
      ...mod,
      courseKey,
      courseTitle: course.title,
      courseDuration: course.duration,
      moduleIndex: index,
    }))
  );

  return (
    <>
      <Helmet>
        <title>Professional Courses — DigiSwarm</title>
        <meta
          name="description"
          content="Explore professional training programs at DigiSwarm. Choose from 3-Month Foundations, 6-Month Advanced Strategy, or our Performance Marketing Specialist Masterclass."
        />
      </Helmet>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 via-white to-white py-16 sm:py-20">
        <div className="absolute -top-32 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="container-x relative">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-semibold text-brand-700 shadow-soft">
              <Sparkles size={14} className="text-brand-600" /> Professional Academics
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl md:text-6xl">
              Accelerate Your Career with{' '}
              <span className="bg-gradient-to-r from-brand-600 to-indigo-500 bg-clip-text text-transparent">
                Practical Learning
              </span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-ink-600 sm:text-lg">
              Industry-grade courses taught directly by marketing leaders. Work on real agency budgets, secure certifications, and launch your career.
            </p>
          </div>
        </div>
      </section>

      {/* MAIN TABBED CONTROLS */}
      <section className="section pt-0">
        <div className="container-x">
          <div className="flex flex-col items-center">
            {/* 4 Buttons Selector */}
            <div id="courses-selector" className="grid w-full max-w-5xl grid-cols-1 gap-2 rounded-2xl bg-ink-50 p-2 sm:grid-cols-2 lg:grid-cols-4">
              <button
                onClick={() => {
                  setActiveTab('modules');
                  setExpandedModule(0);
                }}
                className={`flex items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-semibold transition-all ${
                  activeTab === 'modules'
                    ? 'bg-white text-brand-700 shadow-soft border-b border-brand-100'
                    : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
                }`}
              >
                <Grid size={16} />
                Modules
              </button>

              <button
                onClick={() => {
                  setActiveTab('3month');
                  setExpandedModule(0);
                }}
                className={`flex items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-semibold transition-all ${
                  activeTab === '3month'
                    ? 'bg-white text-brand-700 shadow-soft border-b border-brand-100'
                    : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
                }`}
              >
                <Clock size={16} />
                3 Months Program
              </button>

              <button
                onClick={() => {
                  setActiveTab('6month');
                  setExpandedModule(0);
                }}
                className={`flex items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-semibold transition-all ${
                  activeTab === '6month'
                    ? 'bg-white text-brand-700 shadow-soft border-b border-brand-100'
                    : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
                }`}
              >
                <Calendar size={16} />
                6 Months Program
              </button>

              <button
                onClick={() => {
                  setActiveTab('perfMarketing');
                  setExpandedModule(0);
                }}
                className={`flex items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-semibold transition-all ${
                  activeTab === 'perfMarketing'
                    ? 'bg-white text-brand-700 shadow-soft border-b border-brand-100'
                    : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
                }`}
              >
                <TrendingUp size={16} />
                Performance Marketing
              </button>
            </div>

            {/* Course Display Pane */}
            <div className="mt-12 w-full max-w-6xl">
              <AnimatePresence mode="wait">
                {activeTab === 'modules' ? (
                  <motion.div
                    key="modules"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.35 }}
                    className="w-full space-y-6 animate-fade-in"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {allModules.map((mod, i) => (
                        <div 
                          key={i} 
                          className="group relative flex flex-col justify-between rounded-2xl border border-ink-100 bg-white shadow-soft overflow-hidden hover:-translate-y-1 hover:shadow-card transition-all duration-300"
                        >
                          {/* Image cover header */}
                          <div className="relative w-full h-44 overflow-hidden bg-ink-100">
                            <img
                              src={mod.image}
                              alt={mod.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
                            {/* Course type badge overlaid on image */}
                            <span className={`absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border backdrop-blur-md ${
                              mod.courseKey === '3month' ? 'bg-brand-50/80 border-brand-200 text-brand-700' :
                              mod.courseKey === '6month' ? 'bg-purple-50/80 border-purple-200 text-purple-700' :
                              'bg-amber-50/80 border-amber-200 text-amber-700'
                            }`}>
                              {mod.courseKey === '3month' ? '3-Month Course' :
                               mod.courseKey === '6month' ? '6-Month Course' :
                               'Performance Marketing'}
                            </span>
                          </div>

                          {/* Card Body */}
                          <div className="p-6 pt-4 flex-1 flex flex-col justify-between">
                            <div className="space-y-3.5">
                              <div className="flex items-center justify-between">
                                <span className={`text-xs font-bold uppercase tracking-wider ${
                                  mod.courseKey === '3month' ? 'text-brand-600' :
                                  mod.courseKey === '6month' ? 'text-purple-600' :
                                  'text-amber-600'
                                }`}>
                                  Module {mod.moduleIndex + 1}
                                </span>
                                <span className={`grid h-8 w-8 place-items-center rounded-lg ${
                                  mod.courseKey === '3month' ? 'bg-brand-50 text-brand-600' :
                                  mod.courseKey === '6month' ? 'bg-purple-50 text-purple-600' :
                                  'bg-amber-50 text-amber-600'
                                }`}>
                                  <BookOpen size={16} />
                                </span>
                              </div>
                              <h4 className="text-base font-bold text-ink-900 group-hover:text-brand-600 transition-colors duration-200">
                                {mod.title.replace(/^Module \d+:\s*/, '')}
                              </h4>
                              <p className="text-sm leading-relaxed text-ink-600">
                                {mod.details}
                              </p>
                            </div>

                            <button
                              onClick={() => {
                                  setActiveTab(mod.courseKey);
                                  setExpandedModule(mod.moduleIndex);
                                  document.getElementById('courses-selector')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }}
                              className={`mt-6 w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold border transition-all duration-200 ${
                                mod.courseKey === '3month' ? 'border-brand-100 text-brand-600 hover:bg-brand-50 hover:border-brand-300' :
                                mod.courseKey === '6month' ? 'border-purple-100 text-purple-600 hover:bg-purple-50 hover:border-purple-300' :
                                'border-amber-100 text-amber-600 hover:bg-amber-50 hover:border-amber-300'
                              }`}
                            >
                              <span>View Program</span>
                              <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                            </button>

                            <div className={`mt-5 h-1 w-0 group-hover:w-full rounded-full transition-all duration-300 ${
                              mod.courseKey === '3month' ? 'bg-brand-500' :
                              mod.courseKey === '6month' ? 'bg-purple-500' :
                              'bg-amber-500'
                            }`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.35 }}
                    className="grid gap-8 lg:grid-cols-12"
                  >
                    {/* Left Column: Summary and Highlights */}
                    <div className="space-y-6 lg:col-span-7">
                      <div>
                        <h2 className="text-3xl font-extrabold text-ink-900 sm:text-4xl">
                          {selectedCourse.title}
                        </h2>
                        <p className="mt-3 text-lg font-medium text-brand-600 leading-relaxed">
                          {selectedCourse.subtitle}
                        </p>
                        <p className="mt-4 text-base leading-relaxed text-ink-600">
                          {selectedCourse.description}
                        </p>
                      </div>

                      {/* Meta quick stats */}
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="flex items-start gap-3.5 rounded-2xl border border-ink-100 bg-white p-4 shadow-soft">
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                            <Clock size={18} />
                          </span>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-ink-500">Duration</p>
                            <p className="mt-0.5 text-sm font-semibold text-ink-800">{selectedCourse.duration}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3.5 rounded-2xl border border-ink-100 bg-white p-4 shadow-soft">
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                            <BookOpen size={18} />
                          </span>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-ink-500">Commitment</p>
                            <p className="mt-0.5 text-sm font-semibold text-ink-800">{selectedCourse.commitment}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3.5 rounded-2xl border border-ink-100 bg-white p-4 shadow-soft">
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                            <Award size={18} />
                          </span>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-ink-500">Level</p>
                            <p className="mt-0.5 text-sm font-semibold text-ink-800">{selectedCourse.level}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3.5 rounded-2xl border border-ink-100 bg-white p-4 shadow-soft">
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                            <Briefcase size={18} />
                          </span>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-ink-500">Delivery Format</p>
                            <p className="mt-0.5 text-sm font-semibold text-ink-800">{selectedCourse.format}</p>
                          </div>
                        </div>
                      </div>

                      {/* Course Highlights */}
                      <div className="rounded-2xl border border-brand-100 bg-brand-50/30 p-6">
                        <h3 className="flex items-center gap-2 text-base font-bold uppercase tracking-wider text-brand-800">
                          <Target size={16} /> Course Highlights
                        </h3>
                        <ul className="mt-4 space-y-3">
                          {selectedCourse.highlights.map((h, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                              <span className="text-sm font-medium text-ink-700">{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Right Column: Syllabus Accordion and Call-To-Action */}
                    <div className="space-y-6 lg:col-span-5">
                      <div className="card p-6">
                        <h3 className="text-lg font-bold text-ink-900 border-b border-ink-100 pb-3">
                          Course Curriculum
                        </h3>
                        <div className="mt-2 divide-y divide-ink-100">
                          {selectedCourse.curriculum.map((c, i) => (
                            <AccordionItem
                              key={i}
                              title={c.title}
                              details={c.details}
                              isOpen={expandedModule === i}
                              onToggle={() => setExpandedModule(expandedModule === i ? -1 : i)}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Sticky-feel card for CTA */}
                      <div className="card bg-ink-950 p-6 text-white relative overflow-hidden">
                        <div className="pointer-events-none absolute inset-x-0 -top-32 h-64 bg-[radial-gradient(circle_at_50%_0%,rgba(53,99,255,0.22),transparent_70%)]" />
                        
                        <div className="relative">
                          <h4 className="text-xl font-bold">Interested in this course?</h4>
                          <p className="mt-2 text-sm text-ink-300">
                            Batches fill quickly. Claim your slot now, clear your queries with our academic counselors, and lock in the introductory prices.
                          </p>
                          
                          <div className="mt-6 flex flex-col gap-2">
                            <Link
                              to={`/contact?subject=${encodeURIComponent(selectedCourse.ctaSubject)}&message=${encodeURIComponent(selectedCourse.ctaMessage)}`}
                              className="btn bg-brand-600 text-white hover:bg-brand-700 justify-between w-full shadow-soft"
                            >
                              <span>Enquire & Register Now</span>
                              <ArrowRight size={16} />
                            </Link>
                            
                            <p className="text-[10px] text-center text-ink-400 mt-2">
                              No payment required now · Consultation is free
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Course-specific module cards rendered after the container-x div */}
        {activeTab !== 'modules' && (
          <div className="container-x mt-16 border-t border-ink-100 pt-16 animate-fade-in">
            <div className="mx-auto max-w-3xl text-center mb-10">
              <h3 className="text-3xl font-extrabold text-ink-900">
                Course Modules Detail
              </h3>
              <p className="mt-3 text-ink-600">
                Explore the detailed curriculum and learning outcomes for each module.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedCourse.curriculum.map((mod, index) => (
                <div 
                  key={index} 
                  className="group relative flex flex-col justify-between rounded-2xl border border-ink-100 bg-white shadow-soft overflow-hidden hover:-translate-y-1 hover:shadow-card transition-all duration-300"
                >
                  {/* Image cover header */}
                  <div className="relative w-full h-44 overflow-hidden bg-ink-100">
                    <img
                      src={mod.image}
                      alt={mod.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
                  </div>

                  {/* Card Body */}
                  <div className="p-6 pt-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold uppercase tracking-wider ${
                          activeTab === '3month' ? 'text-brand-600' :
                          activeTab === '6month' ? 'text-purple-600' :
                          'text-amber-600'
                        }`}>
                          Module {index + 1}
                        </span>
                        <span className={`grid h-8 w-8 place-items-center rounded-lg ${
                          activeTab === '3month' ? 'bg-brand-50 text-brand-600' :
                          activeTab === '6month' ? 'bg-purple-50 text-purple-600' :
                          'bg-amber-50 text-amber-600'
                        }`}>
                          <BookOpen size={16} />
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-ink-900 group-hover:text-brand-600 transition-colors duration-200">
                        {mod.title.replace(/^Module \d+:\s*/, '')}
                      </h4>
                      <p className="text-sm leading-relaxed text-ink-600">
                        {mod.details}
                      </p>
                    </div>

                    <div className={`mt-5 h-1 w-0 group-hover:w-full rounded-full transition-all duration-300 ${
                      activeTab === '3month' ? 'bg-brand-500' :
                      activeTab === '6month' ? 'bg-purple-500' :
                      'bg-amber-500'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* FREQUENTLY ASKED QUESTIONS SECTION */}
      <section className="section bg-ink-50">
        <div className="container-x">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold text-ink-900">Frequently Asked Questions</h2>
            <p className="mt-3 text-ink-600">Got questions? We have answers. If you do not find what you are looking for, contact us.</p>
          </div>

          <div className="mx-auto mt-8 max-w-3xl space-y-3">
            {[
              {
                q: 'Are these courses certified?',
                a: 'Yes! You will receive an official DigiSwarm Course Completion Certificate. Additionally, we will guide and prepare you for external industry standard certifications like Google Ads, Meta Certified Digital Marketing Associate, and HubSpot Certifications.',
              },
              {
                q: 'Is there any placement support provided?',
                a: 'Absolutely. For our 6-Month program and Performance Marketing masterclass, we offer 100% placement assistance, resume critiques, mock interviewer rounds, and exclusive access to DigiSwarm hiring partner list.',
              },
              {
                q: 'Can I attend if I am working full-time or studying?',
                a: 'Yes, our courses are scheduled in the evenings and weekends to accommodate college students and working professionals. Sessions are recorded, and students have permanent access to recordings and materials.',
              },
            ].map((item, idx) => (
              <div key={idx} className="card p-5">
                <h4 className="font-bold text-ink-900">{item.q}</h4>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
