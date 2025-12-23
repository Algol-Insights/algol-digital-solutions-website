import Link from "next/link"
import { Briefcase, Mail, MapPin, Users, TrendingUp, Heart } from "lucide-react"

const jobOpenings = [
  {
    title: "Sales Executive",
    department: "Sales & Business Development",
    type: "Full-time",
    location: "Harare, Zimbabwe",
    description: "We're looking for an energetic sales professional to drive business growth by building relationships with corporate clients and closing deals.",
    requirements: [
      "2+ years experience in B2B technology sales",
      "Proven track record of meeting/exceeding sales targets",
      "Excellent communication and negotiation skills",
      "Knowledge of IT hardware and software products",
      "Valid driver's license"
    ]
  },
  {
    title: "Network Engineer",
    department: "Technical Services",
    type: "Full-time",
    location: "Harare, Zimbabwe",
    description: "Join our technical team to design, implement, and maintain network infrastructure for enterprise clients across Zimbabwe.",
    requirements: [
      "CCNA or equivalent certification (CCNP preferred)",
      "3+ years experience in network design and implementation",
      "Strong knowledge of Cisco, HP, and Mikrotik equipment",
      "Experience with security systems integration",
      "Willingness to travel within Zimbabwe"
    ]
  },
  {
    title: "Software Developer",
    department: "Software Development",
    type: "Full-time",
    location: "Harare, Zimbabwe (Hybrid)",
    description: "Develop custom web and mobile applications for our corporate clients using modern frameworks and best practices.",
    requirements: [
      "3+ years experience in full-stack development",
      "Proficiency in React, Next.js, Node.js, and TypeScript",
      "Experience with databases (PostgreSQL, MongoDB)",
      "Knowledge of mobile development (React Native) is a plus",
      "Strong problem-solving and communication skills"
    ]
  },
  {
    title: "Security Systems Technician",
    department: "Installation & Support",
    type: "Full-time",
    location: "Harare, Zimbabwe",
    description: "Install, configure, and maintain CCTV, alarm systems, and access control solutions for residential and commercial clients.",
    requirements: [
      "2+ years experience in security systems installation",
      "Knowledge of Hikvision, Dahua, and other major brands",
      "Electrical wiring and troubleshooting skills",
      "Good customer service and communication skills",
      "Own transport preferred"
    ]
  }
]

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-golden/10 mb-6">
            <Briefcase className="w-10 h-10 text-brand-golden" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-brand-teal-medium to-brand-golden bg-clip-text text-transparent">
            Join Our Team
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Build your career with Zimbabwe's leading IT solutions provider
          </p>
        </div>

        {/* Why Work With Us */}
        <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-slate-700/50 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Work at Algol Digital Solutions?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-brand-teal-medium/10 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-brand-teal-medium" />
              </div>
              <h3 className="text-xl font-bold mb-2">Growth Opportunities</h3>
              <p className="text-slate-400">
                We invest in our team's development through training, certifications, and career advancement opportunities.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-brand-golden/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-brand-golden" />
              </div>
              <h3 className="text-xl font-bold mb-2">Great Team Culture</h3>
              <p className="text-slate-400">
                Work with talented, passionate professionals in a collaborative and supportive environment.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-brand-teal-medium/10 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-brand-teal-medium" />
              </div>
              <h3 className="text-xl font-bold mb-2">Competitive Benefits</h3>
              <p className="text-slate-400">
                Attractive salary, performance bonuses, medical aid, and other benefits for our valued team members.
              </p>
            </div>
          </div>
        </div>

        {/* Open Positions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <span className="w-2 h-8 bg-gradient-to-b from-brand-teal-medium to-brand-golden rounded-full" />
            Current Openings
          </h2>
          <div className="space-y-6">
            {jobOpenings.map((job, index) => (
              <div 
                key={index}
                className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-slate-700/50 hover:border-brand-teal-medium/50 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="px-3 py-1 bg-brand-teal-medium/10 text-brand-teal-medium rounded-full">
                        {job.type}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-slate-300 mb-4 leading-relaxed">{job.description}</p>
                <div className="mb-6">
                  <h4 className="font-bold mb-3">Requirements:</h4>
                  <ul className="space-y-2">
                    {job.requirements.map((req, i) => (
                      <li key={i} className="flex gap-2 text-slate-300">
                        <span className="text-brand-teal-medium mt-1">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <a 
                  href={`mailto:careers@algoldigital.com?subject=Application for ${job.title}`}
                  className="inline-flex items-center gap-2 bg-brand-teal-medium text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-teal-dark transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  Apply for this position
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Application Process */}
        <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-slate-700/50 mb-16">
          <h2 className="text-3xl font-bold mb-8">Application Process</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-brand-teal-medium/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-brand-teal-medium">1</span>
              </div>
              <h3 className="font-bold mb-2">Submit Application</h3>
              <p className="text-sm text-slate-400">
                Send your CV and cover letter to the email address provided
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-brand-teal-medium/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-brand-teal-medium">2</span>
              </div>
              <h3 className="font-bold mb-2">Initial Review</h3>
              <p className="text-sm text-slate-400">
                Our HR team reviews your application (2-5 business days)
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-brand-teal-medium/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-brand-teal-medium">3</span>
              </div>
              <h3 className="font-bold mb-2">Interview</h3>
              <p className="text-sm text-slate-400">
                Selected candidates are invited for an interview
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-brand-golden/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-brand-golden">4</span>
              </div>
              <h3 className="font-bold mb-2">Welcome Aboard</h3>
              <p className="text-sm text-slate-400">
                Successful candidates receive an offer and onboarding
              </p>
            </div>
          </div>
        </div>

        {/* Don't See a Fit? */}
        <div className="bg-gradient-to-br from-brand-teal-dark to-brand-teal-medium rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Don't See the Right Position?</h2>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            We're always looking for talented individuals to join our team. Send us your CV and we'll keep you in mind for future opportunities.
          </p>
          <a 
            href="mailto:careers@algoldigital.com?subject=General Application"
            className="inline-flex items-center gap-2 bg-white text-brand-teal-dark px-8 py-3 rounded-lg font-medium hover:bg-slate-100 transition-colors"
          >
            <Mail className="w-5 h-5" />
            Send General Application
          </a>
        </div>

        {/* Back Link */}
        <div className="text-center mt-12">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-brand-teal-medium hover:text-brand-golden transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
